const CategoriesService = require("../services/CategoriesService");
const Categories = require("../models/CategoriesModel");
const createCategories = async (req, res) => {
  try {
    const { nameCate } = req.body;

    if (!nameCate) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }
    const response = await CategoriesService.createCategories(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllCategories = async (req, res) => {
  try {
    const response = await CategoriesService.getAllCategories();
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const deleteCategories = async (req, res) => {
  try {
    const CateId = req.params.id;

    if (!CateId) {
      return res.status(200).json({
        status: "ERR",
        message: "The CategoriesId is required",
      });
    }

    const category = await Categories.findById(CateId);

    if (!category) {
      return res.status(404).json({
        status: "ERR",
        message: "Category not found",
      });
    }

    if (category.count !== 0) {
      return res.status(400).json({
        status: "ERR",
        message: "Cannot delete category with a non-zero count",
      });
    }

    const response = await CategoriesService.deleteCategories(CateId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

module.exports = {
  createCategories,
  getAllCategories,
  deleteCategories,
};
