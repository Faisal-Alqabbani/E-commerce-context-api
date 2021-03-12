const Category = require("../models/categoryModel");
const Product = require("../models/productModel");
const categoryCtrl = {
  getCategories: async (req, res) => {
    try {
      const categories = await Category.find();
      res.json(categories);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createCategory: async (req, res) => {
    try {
      // if uesr has role 1 ---> admin
      // only admin can cerate, delete and update.
      const { name } = req.body;
      const category = await Category.findOne({ name });
      // Check if the category exists
      if (category)
        return res.status(400).json({ msg: "This category already exists." });
      const newCategory = new Category({ name });
      await newCategory.save();
      res.status(201).json({ msg: "Created Category!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  deleteCategory: async (req, res) => {
    try {
      const products = await Product.findOne({ category: req.params.id });
      if (products)
        return res
          .status(400)
          .json({ msg: "Please delete all Products with a relationship!" });
      await Category.findByIdAndDelete(req.params.id);
      res.json({ msg: "Deleted a Category!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
  updateCategory: async (req, res) => {
    try {
      const { name } = req.body;
      await Category.findOneAndUpdate({ _id: req.params.id }, { name });
      res.status(200).json({ msg: "Updated a Category!" });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = categoryCtrl;
