import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../App.css';

const TransactionStatistics = () => {
    const [selectedMonth, setSelectedMonth] = useState('March'); // Default month
    const [statistics, setStatistics] = useState({
        totalSale: 0,
        totalSoldItems: 0,
        totalNotSoldItems: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    useEffect(() => {
        fetchStatistics();
    }, [selectedMonth]);

    const fetchStatistics = async () => {
        setLoading(true); // Start loading
        setError(null); // Reset error state
        try {
            const response = await axios.get('http://localhost:5000/api/statistics', {
                params: { month: selectedMonth }
            });
            setStatistics({
                totalSale: response.data.totalSales || 0,
                totalSoldItems: response.data.soldItemsCount || 0,
                totalNotSoldItems: response.data.notSoldItemsCount || 0,
            });
        } catch (error) {
            console.error('Error fetching statistics:', error);
            setError('Error fetching statistics'); // Set error message
        } finally {
            setLoading(false); // End loading
        }
    };

    const handleMonthChange = (e) => {
        setSelectedMonth(e.target.value);
    };

    return (
        <div className="statistics-card">
            <h3>Transaction Statistics</h3>
            <div className="controls">
                <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="month-select"
                    style={{ marginBottom: '10px', padding: '5px' }}
                >
                    <option value="">Select a Month</option>
                    {months.map((month, index) => (
                        <option key={index} value={month}>{month}</option>
                    ))}
                </select>
            </div>
            {loading && <p>Loading statistics...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
                <div className="statistics-info">
                    <p><strong>Total Sale:</strong> {statistics.totalSale}</p>
                    <p><strong>Total Sold Items:</strong> {statistics.totalSoldItems}</p>
                    <p><strong>Total Not Sold Items:</strong> {statistics.totalNotSoldItems}</p>
                </div>
            )}
        </div>
    );
};

export default TransactionStatistics;
