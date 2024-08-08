const Categories = require("../models/CategoriesModel");
const createCategories = (newCategories) => {
  return new Promise(async (resolve, reject) => {
    const { nameCate } = newCategories;
    try {
      const checkCategories = await Categories.findOne({
        nameCate: nameCate,
      });
      if (checkCategories !== null) {
        resolve({
          status: "OK",
          message: "The name Categories is already",
        });
      }
      const createdCategories = await Categories.create({
        nameCate,
      });
      if (createdCategories) {
        resolve({
          status: "OK",
          message: "Success",
          data: createdCategories,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

const getAllCategories = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const allCategories = await Categories.find();
      resolve({
        status: "OK",
        message: "Success",
        data: allCategories,
      });
    } catch (e) {
      reject(e);
    }
  });
};

const deleteCategories = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const checkCategories = await Categories.findOne({
        _id: id,
      });
      if (checkCategories === null) {
        resolve({
          status: "ERR",
          message: "The Categories is not defined",
        });
      }
      if (checkCategories.count === 0) {
        await Categories.findByIdAndDelete(id);
      } else {
        resolve({
          status: "ERR",
          message: "The category has products",
        });
      }

      resolve({
        status: "OK",
        message: "Delete Categories Success",
      });
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  createCategories,
  getAllCategories,
  deleteCategories,
};
