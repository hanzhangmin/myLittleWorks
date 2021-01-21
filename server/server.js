const express = require("express");
const fs = require("fs");
const app = express();

app.all("*", function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By", " 3.2.1");
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});

app.get("/data", (req, res) => {
  fs.readFile("./data.json", (err, data) => {
    res.send(data);
  });
});

const server = app.listen(3000, function () {
  console.log("Express app server listening on port %d", server.address().port);
});
