import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Statistics = ({ selectedMonth }) => {
    const [totalSales, setTotalSales] = useState(0);
    const [soldItemsCount, setSoldItemsCount] = useState(0);
    const [notSoldItemsCount, setNotSoldItemsCount] = useState(0);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/statistics', {
                    params: { month: selectedMonth },
                });
                
                // Log the response for debugging
                console.log('Response from statistics API:', response.data);
                
                // Update the state with the fetched values
                setTotalSales(response.data.totalSales);
                setSoldItemsCount(response.data.soldItemsCount);
                setNotSoldItemsCount(response.data.notSoldItemsCount);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            }
        };

        if (selectedMonth) {
            fetchStatistics();
        }
    }, [selectedMonth]); // Re-fetch when selectedMonth changes

    // return (
    //     <div>
    //         <h2>Statistics - {selectedMonth}</h2>
    //         <p>Total Sale: {totalSales.toFixed(2)}</p>
    //         <p>Total Sold Items: {soldItemsCount}</p>
    //         <p>Total Not Sold Items: {notSoldItemsCount}</p>
    //     </div>
    // );
};

export default Statistics;
