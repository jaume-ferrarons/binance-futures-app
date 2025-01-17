import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Plot = ({ historicalPrices, selectedCrypto }) => {
  const data = {
    labels: historicalPrices.map((price) => price.date),
    datasets: [
      {
        label: `${selectedCrypto} Perpetual Prices`,
        data: historicalPrices.map((price) => price.perpetual),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: `${selectedCrypto} Quarterly Prices`,
        data: historicalPrices.map((price) => price.quarterly),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: `${selectedCrypto} Biquarterly Prices`,
        data: historicalPrices.map((price) => price.biquarterly),
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `${selectedCrypto} Prices Over Time`,
      },
    },
  };

  return <Line data={data} options={options} />;
};

export default Plot;
