// Packages
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const { header } = require("express/lib/request");

// Constants
const APP_TITLE =
  "Update Custom Object Form | Integrating With HubSpot I Practicum";
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
const CARS_OBJ_ID = "2-25309173";

// App config
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Record Storage
app.locals.cars = [];

// Functions
async function fetchCarRecords(token, limit) {
  const carsEndpoint = "https://api.hubapi.com/crm/v3/objects/cars/search";
  const data = JSON.stringify({
    limit,
    properties: ["name", "condition", "year", "make", "model", "vin"],
    sorts: [
      {
        propertyName: "hs_createdate",
        direction: "DESCENDING",
      },
    ],
  });
  const payload = {
    method: "post",
    maxBodyLength: Infinity,
    url: carsEndpoint,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data,
  };

  try {
    const response = await axios(payload);
    return response.data.results.map((item) => item.properties);
  } catch (error) {
    console.error(error);
    return [];
  }
}

/** Routes */
app.get("/", async function (req, res) {
  if (PRIVATE_APP_ACCESS) {
    const token = PRIVATE_APP_ACCESS;
    app.locals.cars = await fetchCarRecords(token, 10);
    res.render("homepage", { token, title: APP_TITLE, cars: app.locals.cars });
  } else {
    res.render("homepage");
  }
});

app.get("/update-cobj", function (req, res) {
  res.render("updates", {
    title: APP_TITLE,
  });
});

app.post("/update-cobj", async function (req, res) {
  const { name, year, condition, make, model, vin } = req.body;
  const createUpdateCarsEndpoint = `https://api.hubapi.com/crm/v3/objects/${CARS_OBJ_ID}`;
  const data = JSON.stringify({
    properties: { name, condition, year, make, model, vin },
  });
  const payload = {
    method: "post",
    maxBodyLength: Infinity,
    url: createUpdateCarsEndpoint,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
    },
    data,
  };

  try {
    await axios(payload);
    // After updating the record, clear the car records in "cache"
    app.locals.cars = [];
    res.redirect("/");
  } catch (error) {
    console.error(error);
  }
});

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
