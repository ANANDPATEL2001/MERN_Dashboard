import mongoose from "mongoose";

import User from "../models/User.js";
import Transaction from "../models/Transaction.js";

export const getAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: "admin" }).select("-password");
        res.status(200).json(admins);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


export const getUserPerformance = async (req, res) => {
    try {
        const { id } = req.params;

        const userWithStats = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(id) } },
            {
                $lookup: {
                    from: "affiliatestats",
                    localField: "_id",
                    foreignField: "userId",
                    as: "affiliateStats",
                },
            },
            // $'unwind' is basically used to flatten the array returned i.e. 'affiliateSales'
            { $unwind: "$affiliateStats" },
        ]);
        // console.log('User with sales :', userWithStats)

        const saleTransactions = await Promise.all(
            userWithStats[0].affiliateStats.affiliateSales.map((id) => {
                return Transaction.findById(id);
            })
        );
        // console.log('Transactions with sales :', saleTransactions)

        const filteredSaleTransactions = saleTransactions.filter(
            (transaction) => transaction !== null
        );
        // console.log('filtered transactions with sales :', filteredSaleTransactions)


        res
            .status(200)
            .json({ user: userWithStats[0], sales: filteredSaleTransactions });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};
