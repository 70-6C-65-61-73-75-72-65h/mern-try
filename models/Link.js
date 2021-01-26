const { Schema, model, Types } = require("mongoose");

const schema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    // date: { type: Date, default: Date.now },
    clicks: { type: Number, default: 0 },
    owner: { type: Types.ObjectId, ref: "User" },
  },
  { timestamps: { createdAt: "date" } }
);

module.exports = model("Link", schema);
