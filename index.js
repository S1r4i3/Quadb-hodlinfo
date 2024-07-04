const express = require("express");
const axios = require("axios");
const { Sequelize, DataTypes } = require("sequelize");
const path = require("path");

// Set up Sequelize with correct credentials 
const sequelize = new Sequelize("hodlinfo", "postgres", "sriram77", {
  host: "localhost",
  dialect: "postgres",
});

// Define the Ticker model
const Ticker = sequelize.define(
  "Ticker",
  {
    name: { type: DataTypes.STRING, allowNull: false },
    last: { type: DataTypes.DECIMAL, allowNull: false },
    buy: { type: DataTypes.DECIMAL, allowNull: false },
    sell: { type: DataTypes.DECIMAL, allowNull: false },
    volume: { type: DataTypes.DECIMAL, allowNull: false },
    base_unit: { type: DataTypes.STRING, allowNull: false },
  },
  {
    timestamps: false,
  }
);

const app = express();
const PORT = 3000;

app.use(express.static(path.join(__dirname, "public")));

// Fetch data from API and store in the database
app.get("/fetch-tickers", async (req, res) => {
  try {
    const response = await axios.get("https://api.wazirx.com/api/v2/tickers");
    const tickers = Object.values(response.data).slice(0, 10);

    // Clear existing data
    await Ticker.destroy({ where: {}, truncate: true });

    // Save new data
    for (const ticker of tickers) {
      await Ticker.create({
        name: ticker.name,
        last: ticker.last,
        buy: ticker.buy,
        sell: ticker.sell,
        volume: ticker.volume,
        base_unit: ticker.base_unit,
      });
    }

    res.send("Tickers fetched and stored in database.");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tickers.");
  }
});

// Serve the stored data to the frontend
app.get("/tickers", async (req, res) => {
  try {
    const tickers = await Ticker.findAll();
    res.json(tickers);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching tickers.");
  }
});

// Serve the home page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(PORT, async () => {
  try {
    await sequelize.authenticate();
    console.log(
      "Connection to the database has been established successfully."
    );
    await sequelize.sync();
    console.log(`Server is running on http://localhost:${PORT}`);
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
});
