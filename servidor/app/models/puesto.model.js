const { Int32 } = require("bson");

module.exports = mongoose => {

  var schema = mongoose.Schema(
    {
      nombre: String,
      creado: Date,
      actualizado: Date,

    },
    { collection: "puestos" }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Puesto = mongoose.model("puestos", schema);
  return Puesto;
  
};
