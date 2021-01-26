const { Schema, model, Types } = require("mongoose");

const schema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // связка модели пользователя и записей в бд
  links: [{ type: Types.ObjectId, ref: "Link" }],
});

module.exports = model("User", schema);
