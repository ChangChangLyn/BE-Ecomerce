const mongoose = require("mongoose");

const categoriesSchema = new mongoose.Schema(
  {
    nameCate: { type: String, required: true, unique: true },
    count: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

const Categories = mongoose.model("Categories", categoriesSchema);
module.exports = Categories;
