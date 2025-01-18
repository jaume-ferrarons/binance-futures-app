import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Plot = ({ historicalPrices, selectedCrypto, isSpread }) => {
  const data = {
    labels: historicalPrices.map((price) => price.date),
    datasets: isSpread
      ? [
          {
            label: `${selectedCrypto} Perpetual - Quarterly Spread %`,
            data: historicalPrices.map((price) =>
              price.perpetual && price.quarterly
                ? ((price.perpetual - price.quarterly) / price.perpetual) * 100
                : null
            ),
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
          },
          {
            label: `${selectedCrypto} Perpetual - Biquarterly Spread %`,
            data: historicalPrices.map((price) =>
              price.perpetual && price.biquarterly
                ? ((price.perpetual - price.biquarterly) / price.perpetual) * 100
                : null
            ),
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
          },
          {
            label: `${selectedCrypto} Quarterly - Biquarterly Spread %`,
            data: historicalPrices.map((price) =>
              price.quarterly && price.biquarterly
                ? ((price.quarterly - price.biquarterly) / price.quarterly) * 100
                : null
            ),
            borderColor: 'rgba(54, 162, 235, 1)',
            backgroundColor: 'rgba(54, 162, 235, 0.2)',
          },
        ]
      : [
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
        text: `${selectedCrypto} ${isSpread ? 'Spread %' : 'Prices'} Over Time`,
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || '';
            const value = context.raw !== null ? Number(context.raw).toFixed(2) : ''; // P67e8
            const date = context.label || '';
            return `${label}: ${value} (Date: ${date})`;
          },
        },
      },
    },
  };

  return <div className="chart-container"><Line data={data} options={options} /></div>;
};

export default Plot;
