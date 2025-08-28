import {decodeJWTToken,generateJWT} from "./JWTProvider";

const cosmos = require('../../index');

const uuid = require('uuid');
const zlib = require('zlib');
const CommonDao = require('../dao/CommonDao');
const {BlobServiceClient} = require('@azure/storage-blob');
require('dotenv').config();

class AuditLog {

    private cosmosDao: any;

    constructor(cosmosDao: any) {
        this.cosmosDao = cosmosDao;
    }

    async auditLog(req: any, res: any, next: any) {
        let commonDao = new CommonDao(cosmos.cosmosDao);

        const oldWrite = res.write;
        const oldEnd = res.end;
        const chunks: any = [];
        let runId = uuid.v4();
        res.header('Run-Id', runId);
        req.headers['Run-Id'] = runId;

        let decodedToken: any = {};
        if (req.headers['authorization']) {
            try {
                const authHeader = req.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                decodedToken = decodeJWTToken(token);
                req.headers['userId'] = decodedToken ? decodedToken.userId : "";
            } catch (e: any) {
                // @ts-ignore
                if (parseInt(process.env.DEBUG) === 1) {
                    console.log(e.stack);
                }
            }

        }

        res.write = (...restArgs: any) => {
            chunks.push(Buffer.from(restArgs[0]));
            oldWrite.apply(res, restArgs);
        };

        res.end = async (...restArgs: any) => {
            try {
                let responseStatusCode = res.statusCode;
                if (restArgs[0]) {
                    chunks.push(Buffer.from(restArgs[0]));
                }
                let body: any = Buffer.concat(chunks).toString('utf8');
                let compressedResponse: any = "";
                if (responseStatusCode !== 201) {
                    body = JSON.parse(body);
                }
                zlib.deflate(JSON.stringify(body.result), async (err: any, buffer: any) => {
                    if (err) {
                        // @ts-ignore
                        if (parseInt(process.env.DEBUG) === 1) {
                            console.log('u-oh')
                        }
                    }
                    if (responseStatusCode !== 200 && responseStatusCode !== 201) {
                        compressedResponse = body;
                    } else {
                        // convert buffer to string
                        body.result = buffer.toString('base64');
                        compressedResponse = body;
                    }

                    //Remove db-usage from headers
                    let dbUsage = req.headers['db-usage'];
                    delete req.headers['db-usage'];

                    //Remove token
                    delete req.headers['authorization'];

                    // INC785026
                    if ('password' in req.body) delete req.body.password;

                    let auditLog = {
                        created_by: 'system',
                        created_dtz: commonDao.getUTCDate(),
                        from_IP: req.headers['x-forwarded-for'] || req.connection.remoteAddress,
                        method: req.method,
                        original_uri: req.originalUrl,
                        uri: req.url,
                        request_data: JSON.stringify(req.body),
                        response_data: JSON.stringify(compressedResponse),
                        request_headers: JSON.stringify(req.headers),
                        user_agent: req.headers['user-agent'],
                        db_usage: JSON.stringify(dbUsage),
                        object_name: 'AUDIT_LOG',
                        client_no: req.headers['client_no'] ? req.headers['client_no'] : "*",
                        user_id: decodedToken?.userId ? decodedToken.userId : "*",
                        run_id: runId,
                        id: uuid.v4(),
                        status: `${compressedResponse.status}`,
                        module: `${compressedResponse.module}`,
                        sub_module: `${compressedResponse.subModule}`,
                        session_id: decodedToken?.sessionId //INC588778 - added session_id
                    };
                    // @ts-ignore
                    if (parseInt(process.env.DEBUG) === 1) {
                        console.log(auditLog);
                    }


                    // @ts-ignore
                    if (responseStatusCode !== 200 && parseInt(process.env.MONITORING) === 1) {
                        let id = uuid.v4();
                        let emailObject = {
                            email_to: process.env.MONITORING_EMAIL,
                            email_cc: "",
                            email_bcc: "",
                            email_subject: `[${process.env.ENV}] - ${compressedResponse.module} - ${runId}`,
                            email_body: `${compressedResponse.subModule} Failed with status code ${compressedResponse.status} - ${compressedResponse.message}. Please trace the run-id- ${runId} for more details.`,
                            email_attachment_location: "",
                            status: "Q",
                            sent_dtz: "",
                            created_by: "system",
                            created_dtz: commonDao.getUTCDate(),
                            object_name: "SYSTEM_EMAIL_QUEUE",
                            client_no: "*",
                            run_id: runId,
                            id: id,
                            status_code: `${compressedResponse.status}`,
                            queue_id: id
                        }
                        req.body.email = emailObject;
                        if(commonDao.isNullOrUndefinedOrEmpty(req.headers.authorization)){
                            // @ts-ignore
                            req.headers.authorization = 'Bearer ' + generateJWT( process.env.YVP_SYSTEM_USER,'*', req,null,uuid.v4())
                        }
                        await commonDao.sendEmail(req);
                       // await cosmos.cosmosDao.addItemIntoCosmos(emailObject, "Master", req);
                    }
                    if (req.url !== '/audit' && req.url !== '/sendAudit') {
                        // upload response json in blob

                    }
                })
                oldEnd.apply(res, restArgs);
            } catch (e: any) {
                // @ts-ignore
                if (parseInt(process.env.DEBUG) === 1) {
                    console.log(e.stack);
                }
            }
        };

        next();
    }
}

export const uploadJsonDataToAzureBlobStorage = async function (jsonData: any) {
    try {
        let fileName = 'response-data' + uuid.v4() + ".json";
        let file_path = JSON.stringify(jsonData);
        let uploadBlobServiceClient = BlobServiceClient.fromConnectionString(process.env.AZURE_BLOB_CONNECTION_STRING);
        let uploadContainerClient = uploadBlobServiceClient.getContainerClient("audit-log");
        let uploadBlockBlobClient = uploadContainerClient.getBlockBlobClient(fileName);
        await uploadBlockBlobClient.upload(file_path, file_path.length);
        return Promise.resolve(fileName);
    } catch (e: any) {
        // @ts-ignore
        if (parseInt(process.env.DEBUG) === 1) {
            console.log(e.stack);
        }
        return Promise.reject(e);
    }
}
module.exports = AuditLog;
