const axios = require('axios');
const Transaction = require('../models/Transaction');

// Initialize database with seed data
exports.initializeDatabase = async (req, res) => {
    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Clear existing data
        await Transaction.deleteMany({});
        // Insert new data
        await Transaction.insertMany(transactions);

        res.status(200).json({ message: 'Database initialized with seed data' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get all transactions with search and pagination
exports.getTransactions = async (req, res) => {
    const { month, search, page = 1, perPage = 10 } = req.query;
    const searchRegex = new RegExp(search, 'i');

    try {
        // Get start and end date for the month
        const startDate = new Date(`2024-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const query = {
            dateOfSale: { $gte: startDate, $lt: endDate }
        };

        if (search) {
            query.$or = [
                { title: searchRegex },
                { description: searchRegex },
                { price: { $regex: searchRegex } }
            ];
        }

        const transactions = await Transaction.find(query)
            .skip((page - 1) * perPage)
            .limit(Number(perPage));

        const totalCount = await Transaction.countDocuments(query);

        res.status(200).json({ transactions, totalCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get statistics for a selected month
exports.getStatistics = async (req, res) => {
    const { month } = req.query;

    try {
        const startDate = new Date(`2024-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const totalSales = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: null, totalAmount: { $sum: '$price' }, soldCount: { $sum: { $cond: ['$sold', 1, 0] } } } }
        ]);

        const totalItems = await Transaction.countDocuments({
            dateOfSale: { $gte: startDate, $lt: endDate }
        });

        const notSoldCount = totalItems - (totalSales[0]?.soldCount || 0);
        const totalAmount = totalSales[0]?.totalAmount || 0;

        res.status(200).json({ totalAmount, soldCount: totalSales[0]?.soldCount || 0, notSoldCount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Bar chart data for price ranges
exports.getBarChartData = async (req, res) => {
    const { month } = req.query;

    try {
        const startDate = new Date(`2024-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const priceRanges = [
            { range: '0-100', min: 0, max: 100 },
            { range: '101-200', min: 101, max: 200 },
            { range: '201-300', min: 201, max: 300 },
            { range: '301-400', min: 301, max: 400 },
            { range: '401-500', min: 401, max: 500 },
            { range: '501-600', min: 501, max: 600 },
            { range: '601-700', min: 601, max: 700 },
            { range: '701-800', min: 701, max: 800 },
            { range: '801-900', min: 801, max: 900 },
            { range: '901-above', min: 901, max: Infinity }
        ];

        const results = await Promise.all(priceRanges.map(async (range) => {
            const count = await Transaction.countDocuments({
                dateOfSale: { $gte: startDate, $lt: endDate },
                price: { $gte: range.min, $lt: range.max === Infinity ? Infinity : range.max }
            });
            return { range: range.range, count };
        }));

        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Pie chart data for unique categories
exports.getPieChartData = async (req, res) => {
    const { month } = req.query;

    try {
        const startDate = new Date(`2024-${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        const categories = await Transaction.aggregate([
            { $match: { dateOfSale: { $gte: startDate, $lt: endDate } } },
            { $group: { _id: '$category', count: { $sum: 1 } } }
        ]);

        res.status(200).json(categories);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Combined API
exports.getCombinedData = async (req, res) => {
    const { month } = req.query;

    try {
        const transactions = await this.getTransactions(req, res);
        const statistics = await this.getStatistics(req, res);
        const barChartData = await this.getBarChartData(req, res);
        const pieChartData = await this.getPieChartData(req, res);

        res.status(200).json({
            transactions: transactions.transactions,
            statistics,
            barChartData,
            pieChartData
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
