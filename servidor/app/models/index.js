const dbConfig = require("../config/db.config.js");

const mongoose = require("mongoose");
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.personas = require("./persona.model.js")(mongoose);
db.puestos = require("./puesto.model.js")(mongoose);

module.exports = db;
