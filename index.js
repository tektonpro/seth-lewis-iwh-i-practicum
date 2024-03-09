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
    if (req.header("Referer") === "http://localhost:3000/update-cobj") {
      app.locals.cars = await fetchCarRecords(token, 5);
    }
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

/** 
* * This is sample code to give you a reference for how you should structure your calls. 

* * App.get sample
app.get('/contacts', async (req, res) => {
    const contacts = 'https://api.hubspot.com/crm/v3/objects/contacts';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    try {
        const resp = await axios.get(contacts, { headers });
        const data = resp.data.results;
        res.render('contacts', { title: 'Contacts | HubSpot APIs', data });      
    } catch (error) {
        console.error(error);
    }
});

* * App.post sample
app.post('/update', async (req, res) => {
    const update = {
        properties: {
            "favorite_book": req.body.newVal
        }
    }

    const email = req.query.email;
    const updateContact = `https://api.hubapi.com/crm/v3/objects/contacts/${email}?idProperty=email`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try { 
        await axios.patch(updateContact, update, { headers } );
        res.redirect('back');
    } catch(err) {
        console.error(err);
    }

});
*/

// * Localhost
app.listen(3000, () => console.log("Listening on http://localhost:3000"));
