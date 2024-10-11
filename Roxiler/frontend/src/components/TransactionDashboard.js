import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const TransactionDashboard = ({ selectedMonth, handleMonthChange }) => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);

    // Define the months array for the dropdown
    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        fetchTransactions();
    }, [selectedMonth, search, page, perPage]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/transactions', {
                params: { month: selectedMonth, search, page, perPage }
            });
            setTransactions(response.data.transactions);
            setTotalPages(Math.ceil(response.data.totalCount / perPage));
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    return (
        <div className="dashboard">
            <h2>Transaction Dashboard</h2>
            <div className="controls">
                <input
                    type="text"
                    placeholder="Search transaction"
                    value={search}
                    onChange={handleSearchChange}
                    className="search-input"
                />
                {/* Month dropdown */}
                <select onChange={(e) => handleMonthChange(e.target.value)} value={selectedMonth}>
                    <option value="">Select a Month</option>
                    {months.map((month, index) => (
                        <option key={index} value={month}>
                            {month}
                        </option>
                    ))}
                </select>
            </div>
            <table className="transaction-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Category</th>
                        <th>Sold</th>
                        <th>Image</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.id}</td>
                            <td>{transaction.title}</td>
                            <td>{transaction.description}</td>
                            <td>${transaction.price.toFixed(2)}</td>
                            <td>{transaction.category}</td>
                            <td>{transaction.sold ? 'Yes' : 'No'}</td>
                            <td>
                                <img
                                    src={transaction.imageUrl}
                                    alt={transaction.title}
                                    className="transaction-image"
                                    style={{ width: '50px', height: '50px' }}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => (
                    <button
                        key={i}
                        onClick={() => handlePageChange(i + 1)}
                        className={page === i + 1 ? 'active' : ''}
                    >
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default TransactionDashboard;
