import React, { useState } from 'react';
import TransactionDashboard from './components/TransactionDashboard';
import TransactionStatistics from './components/TransactionStatistics';
import TransactionBarChart from './components/TransactionBarChart';
import './App.css';

function App() {
    const [selectedMonth, setSelectedMonth] = useState(''); // Set initial state

    const handleMonthChange = (month) => {
        setSelectedMonth(month);
        console.log('Selected month:', month); // For debugging
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    return (
        <div className="App">
            <h3>Created By Ajit Sargar</h3>
            <h1>Transaction Dashboard</h1>
            <div className="month-select-container">
                {/* Dropdown for selecting month */}
                <select onChange={(e) => handleMonthChange(e.target.value)} value={selectedMonth}>
                    <option value="">Select a Month</option>
                    {months.map((m, index) => (
                        <option key={index} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            {/* Pass selectedMonth to components */}
            <TransactionDashboard selectedMonth={selectedMonth} handleMonthChange={handleMonthChange} />
            <TransactionStatistics selectedMonth={selectedMonth} />
            <TransactionBarChart selectedMonth={selectedMonth} />
        </div>
    );
}

export default App;
