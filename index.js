const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
require('dotenv').config() 
const cookieParser = require('cookie-parser') 
const app = express();

app.use(express.static(path.join(__dirname, "./public")));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()) 

const mustache = require("mustache-express");
app.engine("mustache", mustache());
app.set("view engine", "mustache");

const router = require("./routes/routes");
app.use("/", router);

const port = process.env.PORT || 3000;
app.listen(port, () =>
  console.log(
    `Express started on http://localhost:${port}` +
      "; press Ctrl-C to terminate."
  )
);
