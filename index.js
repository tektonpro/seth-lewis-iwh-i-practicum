const express = require("express");
const axios = require("axios");
const app = express();
const queryString = require("querystring");

let appTitle =
  "Update Custom Object Form | Integrating With HubSpot I Practicum";

app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// * Please DO NOT INCLUDE the private app access token in your repo. Don't do this practicum in your normal account.
const PRIVATE_APP_ACCESS = "";

// TODO: ROUTE 1 - Create a new app.get route for the homepage to call your custom object data. Pass this data along to the front-end and create a new pug template in the views folder.

// * Code for Route 1 goes here
// ✅ Create a new pug template called updates in the views folder.
// ✅ Render the updates template and pass along a page title called Update Custom Object Form | Integrating With HubSpot I Practicum.
app.get("/update-cobj", function (req, res) {
  res.render("updates", {
    title: appTitle,
  });
});
// ✅ In the updates pug template, add a link “Return to the homepage” that links to the root route.

// TODO: ROUTE 2 - Create a new app.get route for the form to create or update new custom object data. Send this data along in the next route.
// Make a POST request with the HTML form data to create a new CRM record.
// After the CRM record is created, write a redirect back to the homepage.
// * Code for Route 2 goes here
app.post("/update-cobj", async function (req, res) {
  // Test POST request
  const name = req.body.name;
  const make = req.body.make;
  const model = req.body.model;
  const formData = {
    body: {
      title: name,
      body: `${make} - ${model}`,
      userId: 1,
    },
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };
  try {
    const response = await axios.post(
      "https://jsonplaceholder.typicode.com/posts",
      queryString.stringify(formData)
    );
    res.send(response.data);
  } catch (error) {
    console.error(error);
  }
});
// TODO: ROUTE 3 - Create a new app.post route for the custom objects form to create or update your custom object data. Once executed, redirect the user to the homepage.

// * Code for Route 3 goes here

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
