const express = require("express");
const router = express.Router();
const ProductController = require("../controllers/ProductController");
const { authMiddleWare } = require("../middleware/authMiddleware");

router.post("/create", ProductController.createProduct);
router.put("/update/:id", authMiddleWare, ProductController.updateProduct);
router.get("/get-details/:id", ProductController.getDetailsProduct);
router.delete("/delete/:id", authMiddleWare, ProductController.deleteProduct);
router.get("/get-all", ProductController.getAllProduct);
router.post("/reviews/:id", ProductController.createProductReview);
router.post(
  "/rep-reviews/:id",
  authMiddleWare,
  ProductController.repReviewProduct
);

router.get(
  "/products-by-category/:categoryId",
  ProductController.getProductsByCategory
);

module.exports = router;
