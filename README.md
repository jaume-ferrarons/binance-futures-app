# Binance Futures Price Comparison Web App

This project is a web application built using React that connects to the Binance API to get the price of BTC or ETH futures contracts. It compares the prices for perpetual, quarterly, and biquarterly futures, computes the spread between them, and plots the prices from the last n days (n to be selected from a dropdown).

## Setup and Installation

1. Clone the repository:
   ```
   git clone https://github.com/githubnext/workspace-blank.git
   cd workspace-blank
   ```

2. Install the dependencies:
   ```
   npm install
   ```

3. Start the development server:
   ```
   npm start
   ```

## Usage

1. Open the web app in your browser:
   ```
   http://localhost:3000
   ```

2. Select the cryptocurrency (BTC or ETH) from the dropdown.

3. The app will fetch and display the prices for perpetual, quarterly, and biquarterly futures contracts.

4. The app will compute and display the spread between the futures contracts.

5. Select the number of days (n) from the dropdown to plot the prices from the last n days.

6. The app will fetch and display the historical prices for the selected number of days.
