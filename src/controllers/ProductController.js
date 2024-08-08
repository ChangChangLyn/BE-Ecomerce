const Product = require("../models/ProductModel");
const User = require("../models/UserModel");
const Categories = require("../models/CategoriesModel");
const ProductService = require("../services/ProductService");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      image,
      categories,
      countInStock,
      price,
      rating,
      description,
      discount,
      reviews,
    } = req.body;

    if (!name || !image || !categories || !countInStock || !price) {
      return res.status(200).json({
        status: "ERR",
        message: "The input is required",
      });
    }

    const category = await Categories.findById(categories);
    if (!category) {
      return res.status(404).json({
        status: "ERR",
        message: "Category not found",
      });
    }

    const response = await ProductService.createProduct(req.body);

    category.count += 1;
    await category.save();

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const data = req.body;

    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }
    const product = await ProductService.getProductById(productId);
    if (!product) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }

    if (data.categories && data.categories !== product.categories) {
      const oldCategory = await Categories.findById(product.categories);
      if (oldCategory) {
        oldCategory.count -= 1;
        await oldCategory.save();
      }

      const newCategory = await Categories.findById(data.categories);
      if (newCategory) {
        newCategory.count += 1;
        await newCategory.save();
      }
    }

    const response = await ProductService.updateProduct(productId, data);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getDetailsProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const response = await ProductService.getDetailsProduct(productId);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    if (!productId) {
      return res.status(200).json({
        status: "ERR",
        message: "The productId is required",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        status: "ERR",
        message: "Product not found",
      });
    }

    const response = await ProductService.deleteProduct(productId);

    const category = await Categories.findById(product.categories);
    if (category) {
      category.count -= 1;
      await category.save();
    }

    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const getAllProduct = async (req, res) => {
  try {
    const { limit, page, sort, filter } = req.query;
    const response = await ProductService.getAllProduct(
      Number(limit) || null,
      Number(page) || 0,
      sort,
      filter
    );
    return res.status(200).json(response);
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};

const createProductReview = async (req, res) => {
  try {
    const { rating, comment, userId } = req.body;

    const product = await Product.findById(req.params.id);
    const user = await User.findById({
      _id: userId,
    });

    if (product) {
      const review = {
        name: user.name,
        rating: Number(rating),
        comment,
        user: user._id,
      };

      product.reviews.push(review);
      product.numReviews = product.reviews.length;
      product.rating = (
        product.reviews.reduce((acc, item) => item.rating + acc, 0) /
        product.reviews.length
      ).toFixed(1);

      await product.save();
      return res.status(200).json({ message: "Review added" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const repReviewProduct = async (req, res) => {
  try {
    const { reviewId, repComment, userId } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    const review = product.reviews.find(
      (review) => review._id.toString() === reviewId
    );

    if (!review) {
      res.status(404);
      throw new Error("Review not found");
    }

    const user = await User.findById({
      _id: userId,
    });

    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    const repReview = {
      name: user.name,
      repComment,
      user: user._id,
    };
    review.repReview.push(repReview);

    await product.save();
    return res.status(200).json({ message: "Rep Review added" });
  } catch (e) {
    return res.status(404).json({
      message: e,
    });
  }
};
const getProductsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const products = await Product.find({ categories: categoryId });

    if (products.length === 0) {
      return res
        .status(404)
        .json({ message: "No products found for this category" });
    }

    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createProduct,
  updateProduct,
  getDetailsProduct,
  deleteProduct,
  getAllProduct,
  createProductReview,
  repReviewProduct,
  getProductsByCategory,
};
