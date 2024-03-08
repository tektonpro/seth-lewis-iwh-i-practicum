// Packages
require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const queryString = require("querystring");
const { header } = require("express/lib/request");

// Constants
const APP_TITLE =
  "Update Custom Object Form | Integrating With HubSpot I Practicum";
const PRIVATE_APP_ACCESS = process.env.PRIVATE_APP_ACCESS;
// App config
app.set("view engine", "pug");
app.use(express.static(__dirname + "/public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/** Routes */
app.get("/", async function (req, res) {
  if (PRIVATE_APP_ACCESS) {
    const token = PRIVATE_APP_ACCESS;
    try {
      const posts = "https://jsonplaceholder.typicode.com/posts/3";
      const headers = {
        "Content-type": "application/json; charset=UTF-8",
      };
      const data = await axios.get(posts, headers);
      res.render("homepage", { token, title: APP_TITLE, data });
    } catch (error) {
      console.error(error);
    }
  } else {
    res.render("homepage");
  }
});

app.get("/update-cobj", function (req, res) {
  res.render("updates", {
    title: appTitle,
  });
});

app.post("/update-cobj", async function (req, res) {
  // TODO: Wire up POST call to custom object
  const { name, make, model } = req.body;
  const formData = {
    title: name,
    body: `${make} - ${model}`,
    userId: 1,
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  };

  try {
    const responseData = await axios.post(
      "https://jsonplaceholder.typicode.com/posts",
      queryString.stringify(formData)
    );
    app.submittedName = responseData.data.title;
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
