const { Int32 } = require("bson");

module.exports = mongoose => {
  
  /* var schema = mongoose.Schema(
    {
      title: String,
      description: String,
      published: Boolean
    },
    { timestamps: true }
  ); */

  var schema = mongoose.Schema(
    {
      nombre: String,
      ap: String,
      am: String,
      email: String,
      status: Boolean,
      creado: Date,
      actualizado: Date,
      nombrepuesto: String

    },
    { collection: "personasd" }
  );

  schema.method("toJSON", function () {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
  });

  const Persona = mongoose.model("personasd", schema);
  return Persona;
  
};
