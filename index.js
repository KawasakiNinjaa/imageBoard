// server summoning

const express = require("express");
const app = express();

app.use(express.static("./public"));

app.listen(8080, () => {
  console.log("LISTENING AF");
});

app.get("/get-cities", (req, res) => {
  console.log(" GET/get-cities hit!!!", cities);

  //res.json is good for sending data from back to front
  res.json(cities);

  // here we weould do a db query to get the list of cities from the db but we don't have a db. In this case
});
