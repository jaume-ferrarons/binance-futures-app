# Binance Futures Price Comparison Web App

This project is a web application built using React that connects to the Binance API to fetch the prices of future contracts for BTC or ETH. It compares the prices for the perpetual, quarterly, and biquarterly futures and computes the spread between them. Additionally, it provides a plot with the prices from the last n days, where n can be selected from a dropdown.

## Setup and Run

To set up and run the project, follow these steps:

1. Clone the repository:
   ```
   git clone https://github.com/githubnext/workspace-blank.git
   ```
2. Navigate to the project directory:
   ```
   cd workspace-blank
   ```
3. Install the dependencies:
   ```
   npm install
   ```
4. Start the development server:
   ```
   npm start
   ```

The application should now be running on `http://localhost:3000`.

## Using the Web App

1. Select the cryptocurrency (BTC or ETH) from the dropdown menu.
2. The app will fetch and display the prices of the perpetual, quarterly, and biquarterly futures contracts.
3. The spread between the future contracts will be computed and displayed.
4. Select the number of days from the dropdown to view the historical prices plot.
