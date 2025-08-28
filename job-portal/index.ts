import express from 'express';
import bodyParser from 'body-parser';
import {decodeJWTToken} from "./src/middleware/JWTProvider";

export const sql = require('mssql');

require('dotenv').config();
const CosmosClient = require('@azure/cosmos').CosmosClient;
const cors = require('cors');
const { mongoDb } = require('./src/dao/core/MongoDb');
const AuditLog = require('./src/middleware/AuditLog')


const app = express();
app.disable("x-powered-by");


//Route imports
const auth = require('./src/route/Auth.route');
const log = require('./src/route/JobPortalOperation.route');
const userProfile = require('./src/route/UserProfile.route');
const application = require('./src/route/Application.route');

//CORS
const corsOptions = {
    exposedHeaders: ['X-AUTH-TOKEN', 'Run-Id', 'SESSION-INACTIVITY-TIME'],//INC772452
    optionsSuccessStatus: 200
}
app.use(cors(corsOptions));

//Body Parser
// create application/json parser
const jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
const urlencodedParser = bodyParser.urlencoded({ extended: false })

app.use(jsonParser);
app.use(urlencodedParser);

// Initialize MongoDB connection
async function initializeMongoDB() {
    try {
        await mongoDb.init();
        console.log('✅ MongoDB initialized successfully');
    } catch (error) {
        console.error('❌ MongoDB initialization failed:', error);
    }
}

// Initialize MongoDB on server start
initializeMongoDB();

//Routes
app.use('/auth/api', auth);
app.use('/auth/api', log);
app.use('/auth/api', userProfile);
app.use('/auth/api', application);

//Health check
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Job Portal API is running!' });
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/auth/api`);
});

// Export MongoDB instance for use in other modules
module.exports = { mongoDb };
