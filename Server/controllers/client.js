import Product from "../models/Product.js";
import ProductStat from "../models/ProductStat.js";
import User from "../models/User.js";
import Transaction from "../models/Transaction.js";
import getCountryIso3 from "country-iso-2-to-3";

export const getProducts = async (req, res) => {
    try {
        const products = await Product.find();

        const productsWithStats = await Promise.all(
            products.map(async (product) => {
                const stat = await ProductStat.find({
                    productId: product._id,
                });
                return {
                    // 'Promise.all()' returns _doc for each item 
                    ...product._doc,
                    stat,
                    // Here we are returning both product and the it's i.e. Array
                };
            })
        );

        res.status(200).json(productsWithStats);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const getCustomers = async (req, res) => {
    try {
        // Here, we have used 'select("-password")' to exclude the 'password' (sensitive data) while passing the data to frontend
        const customers = await User.find({ role: "user" }).select("-password");
        res.status(200).json(customers);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const getTransactions = async (req, res) => {
    try {
        // sort should look like this: { "field": "userId", "sort": "desc"}
        // The above formate would be in the string send by the front end (MaterialUI)
        const { page = 1, pageSize = 20, sort = null, search = "" } = req.query;

        // formated sort should look like { userId: -1 } i.e. parsed into an object('sortParsed') from string
        // The above formate {userId : -1} will be read by the Mongodb
        const generateSort = () => {
            const sortParsed = JSON.parse(sort);
            // console.log("sortParsed is : ", sortParsed);
            const sortFormatted = {
                [sortParsed.field]: (sortParsed.sort = "asc" ? 1 : -1),
            };

            return sortFormatted;
        };
        const sortFormatted = Boolean(sort) ? generateSort() : {};
        // console.log("sortFormatted is : ", sortFormatted);

        const transactions = await Transaction.find({
            $or: [
                { cost: { $regex: new RegExp(search, "i") } },
                { userId: { $regex: new RegExp(search, "i") } },
            ],
        })
            .sort(sortFormatted)
            .skip(page * pageSize)
            .limit(pageSize);
        // console.log("transactions is :", transactions);


        const total = await Transaction.countDocuments({
            name: { $regex: search, $options: "i" },
        });

        res.status(200).json({
            transactions,
            total,
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const getGeography = async (req, res) => {
    try {
        const users = await User.find();

        const mappedLocations = users.reduce((acc, { country }) => {
            // The 'countryISO3' func is used to convert 2 Letter country code to 3 Letter country code
            const countryISO3 = getCountryIso3(country);
            if (!acc[countryISO3]) {
                acc[countryISO3] = 0;
            }
            acc[countryISO3]++;
            return acc;
        }, {});
        // The above empty object signifies no data (object) will be returned if Users data is undefined otherwise an object with country code as key and no. of users for thet country code

        const formattedLocations = Object.entries(mappedLocations).map(
            ([country, count]) => {
                return { id: country, value: count };
            }
        );

        res.status(200).json(formattedLocations);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
