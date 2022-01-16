const express = require("express");
const cors = require("cors");

const lallave = "estaesunaclave33?";

const app = express();

var fs = require('fs');
var https = require('https');

app.set('lallave', lallave);

var corsOptions = {
  origin: '*', // Reemplazar con dominio
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
//app.use(cors());

app.use(express.json())
app.use(express.urlencoded({
  extended: true
}));

const db = require("./app/models");

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Conectado a la DB!");
  })
  .catch(err => {
    console.log("No se pudo conectar a la DB!", err);
    process.exit();
  });

// ruta
app.get("/", (req, res) => {
  res.json({ message: "Hola yo soy la API." });
});

require("./app/routes/persona.routes")(app);

// puerto 
const PORT = process.env.PORT || 5050;

// LOCAL
/*app.listen(PORT, () => {
  console.log(`el servidor esta corriendo en el puerto ${PORT}.`);
});*/

// REMOTO 
https.createServer({
  cert: fs.readFileSync('../certificados/dic2021/cert.pem'),
  key: fs.readFileSync('../certificados/dic2021/privkey.pem')
},app).listen(PORT, function(){
       console.log(`Servidor https corriendo en el puerto ${PORT}`);
});