import zlib from "zlib";
const axios = require('axios')
export {}
import moment from "moment";
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const crypto = require('crypto');
const cosmos = require('../../index');
import {generateJWT} from "../middleware/JWTProvider";
class CommonDao {
    private cosmosDao: any;

    constructor(cosmosDao: any) {
        this.cosmosDao = cosmosDao;
    }

    getDataSource = async (req: any, clientNo: any, dataSourceId: any) => {
        let query = `SELECT *
                     FROM c
                     where c.client_no = '${clientNo}'
                       and c.object_name = 'DATA_SOURCE'
                       and c.data_source_id = '${dataSourceId}'`

        let dataQuery = {
            'query': query,
            parameters: []
        };
        let data: any = await cosmos.cosmosDao.fetchContainer(dataQuery, 'Master', req);
        if (data?.length > 0) {
            data = data[0];
        }
        return Promise.resolve(data);
    }

    getUTCDate() {
        let now = new Date();
        let dateUTC = new Date(now.getTime() + (now.getTimezoneOffset() * 60000));
        return moment(dateUTC).format('YYYY-MM-DDTHH:mm:ss');
    }

    generateOTP() {
        return Math.floor(Math.random() * 899999 + 100000);
    }

    hashPassword = async (password: any) => {
        const salt = await bcrypt.genSalt(10);
        return bcrypt.hash(password, salt);
    }

    generateRandomPassword = (length = 10) => {
        const Allowed = {
            Uppers: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
            Lowers: "abcdefghijklmnopqrstuvwxyz",
            Numbers: "1234567890",
        }
        let pwd = "";
        pwd += this.getRandomCharFromString(Allowed.Uppers);  // pwd will have at least one upper
        pwd += this.getRandomCharFromString(Allowed.Lowers);  // pwd will have at least one lower
        pwd += this.getRandomCharFromString(Allowed.Numbers);  // pwd will have at least one number
        for (let i = pwd.length; i < length; i++)
            pwd += this.getRandomCharFromString(Object.values(Allowed).join(''));  // fill the rest of the pwd with random characters
        return pwd
    }

    getRandomCharFromString(str: any) {
        return str.charAt(Math.floor(Math.random() * str.length))
    }

    // generateRandomPassword() {
    //     let result = '';
    //     const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    //     let charactersLength = characters.length;
    //     for (let i = 0; i < 10; i++) {
    //         result += characters.charAt(Math.floor(Math.random().toString(36) * charactersLength));
    //     }
    //     return result;
    // }

    getUTCDateByAddingOrSubtractingDays(days: number, date: string) {
        let er = /^-?[0-9]+$/;
        let value = er.test(days.toString());
        days = ((days != null && value == true) ? parseInt(days.toString()) : 0)
        let now = new Date(date);
        now.setDate(now.getDate() + days);
        let dateUTC = new Date(now);
        return moment(dateUTC).format('YYYY-MM-DDT00:00:00');
    }

    dateDiffInDays(a: any, b: any) {
        const _MS_PER_DAY = 1000 * 60 * 60 * 24;
        // Discard the time and time-zone information.
        const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
        const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

        return Math.floor((utc2 - utc1) / _MS_PER_DAY);
    }

    sortAnArray(sortOrder: any, a: any, b: any): number {
        let returnValue: number;
        let orderAVal: number;
        let orderBVal: number;
        if (sortOrder === "ASC") {
            orderAVal = 1;
            orderBVal = -1;
        } else //DSC
        {
            orderAVal = -1;
            orderBVal = 1;
        }
        returnValue = (a > b) ? orderAVal : orderBVal;

        return returnValue;
    }

    splitArray(myArray: any, size: any) {
        const arrayLength = myArray.length;
        let tempArray = [];
        let myChunk = {};
        for (let index = 0; index < arrayLength; index += size) {
            myChunk = myArray.slice(index, index + size);
            tempArray.push(myChunk);
        }
        return tempArray;
    }
    isNotNullOrUndefinedOrEmpty = function (value: any) {
        return value != null  && value != '' && value != null && value !="null";
    }
    // @ts-ignore
    async splitIntoChunksBySize(data: any, chunkSize: number, byteLength: number) {
        // @ts-ignore
        const jsonString = JSON.stringify(data);
        let size: number = Buffer.byteLength(jsonString);
        if (size > byteLength) {
            let splitData = this.splitArray(data, chunkSize);
            let finalData: any = [];
            for (let d of splitData) {
                finalData.push(...await this.splitIntoChunksBySize(d, Math.round(chunkSize / 2), byteLength));
            }
            return finalData;
        } else {
            return [data];
        }
    }

    externalAPICall = async function (data: any, url: any, _clientNo: any, headers: any,req:any) {
        try {
            const { generateJWT } = require('../middleware/JWTProvider');
            headers["authorization"] = 'Bearer ' + generateJWT(process.env.YVP_SYSTEM_USER,'*', req,null,uuid.v4())//76280
            let config = {
                method: 'post',
                url: process.env.YVP_BASE_URL + url,
                headers: headers,
                data: data
            };
            return new Promise((resolve, reject) => {
                axios(config)
                    .then(function (response: any) {
                        resolve(response.data);
                        console.log(JSON.stringify(response.data));
                    })
                    .catch(function (error: any) {
                        reject(error);
                    });
            });
        } catch (e: any) {
            // @ts-ignore
            if (parseInt(process.env.DEBUG) === 1) {
                console.log(e.stack);
            }
            return Promise.reject(e);
        }
    }
    isNullOrUndefinedOrEmpty = function (value: any) {
        return value === null || value === undefined || value === '';
    }
    //INC798364- calling External API
    sendEmail = async (req:any) =>{
        let header: any = {
            'client_no': req.headers.client_no,
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json',
            'user-agent': req.headers["user-agent"],
        };
        await this.externalAPICall(req.body, 'common/api/email/sendEmail', req.headers.client_no, header,req);
    }
    //54995 -->Start
    private prepareHeaders(req: any): any {
        return {
            'client_no': req.headers.client_no,
            'Authorization': req.headers.authorization,
            'Content-Type': 'application/json',
            'user-agent': req.headers["user-agent"]
        };
    }
    // Process data to Redis
    processDataToRedis=async(data: any, key: any, req: any)=> {
        // Define the size limit (2 MB)
        const sizeLimitBytes = 2 * 1024 * 1024; // 2 MB in bytes
        let liveShipments = await this.splitIntoChunksBySize(data,300,sizeLimitBytes);// split the JSON size less than by 2 MB
        let redisSplitIndex : number = 1;
        if (liveShipments?.length > 0) {
            for (let shipment of liveShipments) {
                req.body = { data: shipment, key: key,redisSplitIndex: redisSplitIndex };
                const header = this.prepareHeaders(req);
                await this.externalAPICall(req.body, 'common/api/redis/insertIntoRedis', req.headers.client_no, header,req);
                redisSplitIndex++;
            }
        }
        return "Data Processed Successfully";
    }
    // Fetch data from Redis
    fetchDataFromRedis = async (key: any, req: any) =>{
        req.body.key = key;
        const header = this.prepareHeaders(req);
        let data: any = await this.externalAPICall(req.body, 'common/api/redis/fetchFromRedisForSession', req.headers.client_no, header,req);
        if(data.status == 200){
            data = data.result;
        }else{
            data =[];
        }
        return data;
    }
    // Delete data from Redis
    deleteDataFromRedis=async (key: any, req: any)=> {
        req.body.key = key;
        const header = this.prepareHeaders(req);
        return await this.externalAPICall(req.body, 'common/api/redis/deleteFromRedis', req.headers.client_no, header,req);
    }
    addHours(hours: number, date: string) {
        hours = (hours != null) ? parseFloat(hours.toString()) : 0;
        let now = new Date(date);
        if (hours < 1) {
            // Convert hours to minutes and add to the date
            let minutes = hours * 60;
            now.setMinutes(now.getMinutes() + minutes);
        } else {
            // Add hours to the date
            now.setHours(now.getHours() + hours);
        }
        // Return the formatted date in 'YYYY-MM-DDTHH:mm:ss' format
        let dateUTC = new Date(now);
        return moment(dateUTC).format('YYYY-MM-DDTHH:mm:ss');
    }
}

module.exports = CommonDao;
