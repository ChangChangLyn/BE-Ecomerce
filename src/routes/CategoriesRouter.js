const express = require("express");
const router = express.Router();
const CategoriesController = require("../controllers/CategoriesController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create-categories", CategoriesController.createCategories);
router.get("/get-all-categories", CategoriesController.getAllCategories);
router.delete("/delete-categories/:id", CategoriesController.deleteCategories);

module.exports = router;
