import express from 'express';
// Parse incoming 'request' bodies in a middleware before your handlers, available under the 'req.body' property.
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv'
// 'Helmet' helps secure Express apps by setting HTTP response headers.
import helmet from 'helmet';

// morgan - HTTP request logger middleware for node.js
// Formate - morgan(format, options)
// The 'format' argument may be a string of a predefined name, a string of a 'format' string, or a function that will produce a log entry.
import morgan from 'morgan';
import mongoose from 'mongoose';

import User from './models/User.js';
import Product from './models/Product.js';
import ProductStat from './models/ProductStat.js';
import Transaction from './models/Transaction.js';
import OverallStat from './models/OverallStat.js';
import AffiliateStat from './models/AffiliateStat.js';
import { dataUser, dataProduct, dataProductStat, dataTransaction, dataOverallStat, dataAffiliateStat } from './data/index.js';

import clientRoutes from "./routes/client.js"
import generalRoutes from "./routes/general.js"
import managementRoutes from "./routes/management.js"
import salesRoutes from "./routes/sales.js"




// CONFIGURATIONS
dotenv.config();
const app = express();

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
// Below will enable us to use cross origin resources
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan('common'));



/* ROUTES */
app.use("/client", clientRoutes);
app.use("/general", generalRoutes);
app.use("/management", managementRoutes);
app.use("/sales", salesRoutes);



// MONGOOSE SETUP
const PORT = process.env.PORT || 9000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    app.listen(PORT, () => {
        console.log(`Server stated running on port : ${PORT}`);

        // ONLY ADD DATA ONE TIME
        // User.insertMany(dataUser);
        // Product.insertMany(dataProduct);
        // ProductStat.insertMany(dataProductStat);
        // Transaction.insertMany(dataTransaction);
        // OverallStat.insertMany(dataOverallStat);
        // AffiliateStat.insertMany(dataAffiliateStat);
    })
}).catch(error => {
    console.log(`Error occurred : ${error}`);
})
