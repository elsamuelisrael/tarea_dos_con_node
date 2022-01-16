module.exports = app => {
  
  //const personas = require("../controllers/persona.controller.js");
  const jwt = require('jsonwebtoken');

  const db = require("../models");
  const Persona = db.personas;
  const Puesto = db.puestos;

  var router = require("express").Router();

  //router.post("/", personas.create);
  router.post("/", (req, res) => {

    const token = req.headers['authorization'];

    if (token) {
      jwt.verify(token, app.get('lallave'), (err, decoded) => {
        if (err) {
          return res.json({ mensaje: 'Token inválida' });
        } else {

          // Validacion
  
          if (!req.body.nombre) {
            res.status(400).send({ message: "Necesita el campo nombre!" });
            return;
          }
        
          if (!req.body.ap) {
            res.status(400).send({ message: "Necesita el campo ap!" });
            return;
          }
  
          console.log({ "Insertando": req.body });
  
          const persona = new Persona({
            nombre: req.body.nombre,
            ap: req.body.ap,
            am: req.body.am,
            email: req.body.email,
            status: req.body.status ? req.body.status : false,
            creado: new Date,
            actualizado: new Date,
            nombrepuesto: req.body.nombrepuesto,
          });
  
          // Guardar una persona en la colección
          persona
            .save(persona)
            .then(data => {
              //res.send(data);
              res.send({ 
                status: true,
                message: "Los datos nuevos se guardaron correctamente" 
              });
            })
            .catch(err => {
              res.status(500).send({
                status: false,
                message:
                  err.message || "algo paso mientras se creaba - Persona."
              });
            });
          }
      });
    } 
    else {
      res.send({
        mensaje: 'Token no proveída.'
      });
    }

  });
  
  router.get("/puestos", (req, res) => {

    const token = req.headers['authorization'];

    if (token) {
      jwt.verify(token, app.get('lallave'), (err, decoded) => {
        if (err) {
          return res.json({ mensaje: 'Token inválida' });
        } else {

          console.log("Puestos")
          
          Puesto.find().sort( { nombre: 1 } )
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "algo paso mientras se solicitaba la información."
              });
            });

        }
      });
    } else {
      res.send({
        mensaje: 'Token no proveída.'
      });
    }

  });

  router.post("/paginacion", (req, res) => {

    const token = req.headers['authorization'];

    if (token) {
      jwt.verify(token, app.get('lallave'), (err, decoded) => {
        if (err) {
          return res.json({ mensaje: 'Token inválida' });
        } else {
          
          console.log(req.body)

          var condicion = { status: true }

          Persona.find(condicion).skip(req.body.epp).limit(20)
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "algo paso mientras se solicitaba la información."
              });
            });

        }
      });
    } else {
      res.send({
        mensaje: 'Token no proveída.'
      });
    }

  });
  
  router.post("/cuantoshayb", (req, res) => {

    const token = req.headers['authorization'];

    if (token) {
      jwt.verify(token, app.get('lallave'), (err, decoded) => {
        if (err) {
          return res.json({ mensaje: 'Token inválida' });
        } else {
          
          //console.log(req)
          //req.decoded = decoded;
          //next();

          var query = Persona.find();
          var condicion = { status: true }
  
          query.countDocuments(condicion, function (err, count) {
            if (err) {
              //console.log(err)

              res.status(500).send({
                message:
                  err.message || "algo paso mientras se solicitaba la información."
              });

            }
            else {
              console.log("cuantoshay:", count)
              res.send({"cuantoshay":count});
            }

          });

        }
      });
    } else {
      res.send({
        mensaje: 'Token no proveída.'
      });
    }

  })

  router.get("/publishedb", (req, res) => {

    const token = req.headers['authorization'];

    if (token) {
      jwt.verify(token, app.get('lallave'), (err, decoded) => {
        if (err) {
          return res.json({ mensaje: 'Token inválida' });
        } else {

          Persona.find({ status: true })
            .then(data => {
              res.send(data);
            })
            .catch(err => {
              res.status(500).send({
                message:
                  err.message || "algo paso mientras se solicitaba la información."
              });
            });

        }
      });
    } else {
      res.send({
        mensaje: 'Token no proveída.'
      });
    }
  })

  router.post('/autenticar', (req, res) => {
    if (req.body.usuario === "unir" && req.body.contrasena === "unir33?") {
      const payload = {
        check: true
      };
      const token = jwt.sign(payload, app.get('lallave'), {
        //expiresIn: "12h"
        expiresIn: 1440
      });
      res.json({
        status: true,
        mensaje: 'Autenticación correcta',
        token: token
      });
    } else {
      res.json({ 
        status: false,
        mensaje: "Usuario o contraseña incorrectos",
        token: false
      })
    }
  })

  router.put("/:id", (req, res) => {

    const token = req.headers['authorization'];

    if (token) {
      jwt.verify(token, app.get('lallave'), (err, decoded) => {
        if (err) {
          return res.json({ mensaje: 'Token inválida' });
        } else {

          
          if (!req.body) {
            return res.status(400).send({
              message: "Los datos para actualizar no pueden estar vacios!"
            });
          }
        
          console.log({ "Actualizando con ": req.body });
        
          const id = req.params.id;
        
          Persona.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
            .then(data => {
              if (!data) {
                res.status(404).send({
                  message: `no se puede actualizar los datos del ID ${id}`
                });
              } else res.send({ message: "Los datos se actualizaron correctamente" });
            })
            .catch(err => {
              res.status(500).send({
                message: `ERROR al actualizar los datos del ID ${id}`
              });
            });

        }
      });
    } else {
      res.send({
        mensaje: 'Token no proveída.'
      });
    }

  })

  // Eliminar una Persona por el id
  router.delete("/:id", (req, res) => {

    const token = req.headers['authorization'];

    if (token) {
      jwt.verify(token, app.get('lallave'), (err, decoded) => {
        if (err) {
          return res.json({ mensaje: 'Token inválida' });
        } else {

          const id = req.params.id;

          console.log({ "Eliminando... ": req.params.id });
  
          Persona.findByIdAndRemove(id, { useFindAndModify: false })
            .then(data => {
              if (!data) {
                res.status(404).send({
                  message: `No se puede eliminar a la Persona con el id ${id}. Persona no encontrada!`
                });
              } else {
                res.send({
                  message: "Se elimino correctamente!"
                });
              }
            })
            .catch(err => {
              res.status(500).send({
                message: "No se puede eliminar a la Persona con el id " + id
              });
            });
        }
      });
    } else {
      res.send({
        mensaje: 'Token no proveída.'
      });
    }

  });

  app.use("/api/personas", router);

};