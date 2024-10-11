const express = require('express');
const cors = require('cors');
const axios = require('axios'); // Make sure to install axios

const app = express();
const PORT = 5000;

app.use(cors()); // Enable CORS for all routes

// Endpoint to fetch all transactions
app.get('/api/transactions', async (req, res) => {
    const { month, search = '', page = 1, perPage = 10 } = req.query;

    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Filter transactions by month
        const filteredTransactions = transactions.filter(transaction => {
            const date = new Date(transaction.dateOfSale);
            return date.toLocaleString('default', { month: 'long' }) === month;
        });

        // Implement search logic
        const searchedTransactions = filteredTransactions.filter(transaction => {
            return (
                transaction.title.toLowerCase().includes(search.toLowerCase()) ||
                transaction.description.toLowerCase().includes(search.toLowerCase()) ||
                transaction.price.toString().includes(search)
            );
        });

        // Pagination logic
        const totalCount = searchedTransactions.length;
        const paginatedTransactions = searchedTransactions.slice((page - 1) * perPage, page * perPage);

        res.json({ transactions: paginatedTransactions, totalCount });
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint to get statistics
app.get('/api/statistics', async (req, res) => {
    const { month } = req.query; // Retrieve the month from the query parameters

    if (!month) {
        return res.status(400).json({ message: 'Month is required' }); // Proper error handling
    }

    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Filter transactions by month
        const filteredTransactions = transactions.filter(transaction => {
            const date = new Date(transaction.dateOfSale);
            return date.toLocaleString('default', { month: 'long' }) === month;
        });

        // Calculate total sales, sold items, and not sold items
        const totalSales = filteredTransactions.reduce((acc, transaction) => acc + transaction.price, 0);
        const soldItemsCount = filteredTransactions.filter(t => t.sold).length;
        const notSoldItemsCount = filteredTransactions.length - soldItemsCount;

        res.json({
            totalSales,
            soldItemsCount,
            notSoldItemsCount
        });
    } catch (error) {
        console.error('Error fetching statistics:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Endpoint to get bar chart data
app.get('/api/bar-chart', async (req, res) => {
    const { month } = req.query;

    if (!month) {
        return res.status(400).json({ message: 'Month is required' });
    }

    try {
        const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        const transactions = response.data;

        // Prepare bar chart data
        const barChartData = transactions.map(transaction => {
            const date = new Date(transaction.dateOfSale);
            return {
                month: date.toLocaleString('default', { month: 'long' }),
                price: transaction.price
            };
        });

        // Filter the bar chart data by the selected month
        const filteredData = barChartData.filter(data => data.month === month);

        res.json(filteredData);
    } catch (error) {
        console.error('Error fetching bar chart data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
