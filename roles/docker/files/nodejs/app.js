// index.js
const express = require('express');
const app = express();
const path = require("path");
const fs = require("fs");
const port = process.env.PORT || 3000;

function uuid4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}

app.use(express.static("public"));
app.use(express.json());

app.use("/fa", express.static("node_modules/@fortawesome/fontawesome-free/css"));
app.use("/webfonts", express.static("node_modules/@fortawesome/fontawesome-free/webfonts"));

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("", (req, res) => {
  res.render("index", {});
});

app.get("/status", (req, res) => {
  const config = JSON.parse(fs.readFileSync("./config.js", "utf8"));
  res.render("status", {mqtt_host: config.mqtt.host, mqtt_port: config.mqtt.port});
});

app.get("/vumeter", (req, res ) => {
  res.render("vumeter");
});

app.post("/api/settings", (req, res) => {
  try {
    const { name, host, port } = req.body;
    if ( !name ) {
      return res.status(400).json({msg: "missing setting name"});
    } else if ( name == "mqtt" && (!host || !port)){
      return res.status(400).json({msg: "Missing host or port for mqtt"});
    }
    const config_file = JSON.parse(fs.readFileSync("./config.js", "utf8"));
    if ( name == "mqtt") {
      config_file.mqtt.host = host;
      config_file.mqtt.port = port;
      fs.writeFileSync("./config.js", JSON.stringify(config_file, null, 2));
    }
    res.json({msg: "success", config: config_file});
  } catch (error) {
    res.status(500).json({msg: error.message});
  }
});

app.get("/api/mqtt", (req, res) => {
  const config = JSON.parse(fs.readFileSync("./config.js", "utf8"));
  res.json({msg: "success", mqtt: config.mqtt, uuid: uuid4()});
});

app.listen(port, () => {});
