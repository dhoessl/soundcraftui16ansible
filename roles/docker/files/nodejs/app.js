// index.js
const express = require('express');
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;

const mqtt_host = "mqtt"
const mqtt_port = "9001"

function uuid4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

app.use(express.static("public"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("", (req, res) => {
  res.render("index", {});
});

app.get("/status", (req, res) => {
  res.render("status", {
    uuid: uuid4(),
    mqtt_host: mqtt_host,
    mqtt_port: mqtt_port
  });
});

app.listen(port, () => {});
