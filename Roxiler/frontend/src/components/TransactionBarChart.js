import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const TransactionBarChart = ({ selectedMonth }) => {
    const [chartData, setChartData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBarChartData = async () => {
        try {
            console.log(`Fetching bar chart data for month: ${selectedMonth}`);
            const response = await axios.get('http://localhost:5000/api/bar-chart', {
                params: { month: selectedMonth }
            });
            const data = response.data;
            console.log('API response data:', data);

            // Check if the data is defined and has the expected structure
            if (!data || typeof data !== 'object') {
                console.error('Unexpected data format:', data);
                setError('Unexpected data format received from the API.');
                return;
            }

            // Prepare the data for the chart
            setChartData({
                labels: [
                    '0-100', '101-200', '201-300', '301-400', '401-500', 
                    '501-600', '601-700', '701-800', '801-900', '901-above'
                ],
                datasets: [
                    {
                        label: 'Number of Items',
                        data: [
                            data['0-100'] || 0, data['101-200'] || 0, data['201-300'] || 0, 
                            data['301-400'] || 0, data['401-500'] || 0, data['501-600'] || 0, 
                            data['601-700'] || 0, data['701-800'] || 0, data['801-900'] || 0, 
                            data['901-above'] || 0
                        ],
                        backgroundColor: 'rgba(0, 188, 212, 0.6)',
                        borderColor: 'rgba(0, 300, 212, 1)',
                        borderWidth: 1,
                    }
                ]
            });
        } catch (error) {
            console.error('Error fetching bar chart data:', error);
            setError('Error fetching data from the server.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBarChartData();
    }, [selectedMonth]);

    const options = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
                position: 'top',
            },
            title: {
                display: true,
                text: `Transaction Bar Chart for ${selectedMonth}`,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Price Ranges (₹)',
                },
            },
            y: {
                title: {
                    display: true,
                    text: 'Number of Items',
                },
                beginAtZero: true,
            },
        },
    };

    return (
        <div>
            <h2>Transaction Bar Chart</h2>
            {loading && <p>Loading chart data...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && chartData.datasets ? (
                <Bar data={chartData} options={options} />
            ) : null}
        </div>
    );
};

export default TransactionBarChart;
    