const express = require("express");
const app = express();
const axios = require("axios");
const csv = require("csv-parse");
const fs = require("fs");

require("dotenv").config();

let plants = [];

fs.readFile("./data/plants.json", "utf8", (err, data) => {
  if (err) {
    console.log(err);
  } else {
    plants = JSON.parse(data);
      console.log(plants)
  }
});

app.get("/plants", (req, res) => {
  res.json(plants);
});

// Retrieve details of a specific plant by ID
app.get("/plants/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const plant = plants.find((p) => p.id === id);
  if (plant) {
    res.json(plant);
  } else {
    res.status(404).json({ message: `Plant with ID ${id} not found` });
  }
});

// Search for plants based on various criteria
app.get("/plants/search", (req, res) => {
  let results = plants;

  // Filter by food element
  if (req.query.food_element) {
    results = results.filter((p) => p.food_element === req.query.food_element);
  }

  // Filter by blooming time
  if (req.query.blooming_time) {
    results = results.filter(
      (p) => p.blooming_time === req.query.blooming_time
    );
  }

  // Filter by flower color
  if (req.query.flower_color) {
    results = results.filter((p) => p.flower_color === req.query.flower_color);
  }

  // Filter by water needs
  if (req.query.water_needs) {
    results = results.filter((p) => p.water_needs === req.query.water_needs);
  }

  // Filter by native region
  if (req.query.native_region) {
    results = results.filter(
      (p) => p.native_region === req.query.native_region
    );
  }

  // Filter by companion plants
  if (req.query.companion_plants) {
    results = results.filter((p) =>
      p.companion_plants.includes(req.query.companion_plants)
    );
  }

  res.json(results);
});

const port = process.env.PORT || 4001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
