const Product = require("../models/productModel");
// Filter,Sorting and pagination.

class APIfeature {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }
  filtering() {
    const queryObject = { ...this.queryString }; // queryStgin --> req.query;
    // before delete page
    const excludeFields = ["page", "sort", "limit"];
    excludeFields.forEach((el) => delete queryObject[el]);
    // after delete Page
    let queryStr = JSON.stringify(queryObject);
    // put $ in your query
    // gte -->  greater than or equal
    // lte --> less than or equal
    // lt --> less than
    // gt --> greater than
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt|regex)\b/g,
      (match) => "$" + match
    );
    this.query.find(JSON.parse(queryStr));

    return this;
  }
  sorting() {
    if (this.queryString.sort) {
      const sortBy = this.queryString.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 5;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}
productCtrl = {
  getProducts: async (req, res) => {
    try {
      const feature = new APIfeature(Product.find(), req.query)
        .filtering()
        .sorting()
        .pagination();
      const products = await feature.query;
      res.json({
        status: "success",
        result: products.length,
        products,
      });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createProduct: async (req, res) => {
    try {
      const {
        product_id,
        title,
        price,
        description,
        content,
        image,
        category,
        checked,
      } = req.body;
      if (!image) return res.status(400).json({ msg: "No Image Uploaded!" });
      const product = await Product.findOne({ product_id });
      // check if the product already exists
      if (product)
        return res.status(400).json({ msg: "Product already exists!" });
      // create new product
      const newProduct = await new Product({
        product_id,
        title: title.toLowerCase(),
        price,
        description,
        content,
        image,
        category,
        checked,
      });
      newProduct.save();
      res.status(201).json({ msg: "Created Product!" });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      await Product.findOneAndDelete({ _id: req.params.id });
      res.status(200).json({ msg: "product has been deleted successfuly!" });
    } catch (error) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const {
        title,
        price,
        description,
        content,
        image,
        category,
        checked,
      } = req.body;
      if (!image) return res.status(400).json({ msg: "No images uploaded" });
      await Product.findOneAndUpdate(
        { _id: req.params.id },
        {
          title: title.toLowerCase(),
          price,
          description,
          content,
          image,
          category,
          checked,
        }
      );
      res.status(200).json({ msg: "product has been updated" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

module.exports = productCtrl;
