const Payments = require("../models/paymentModel");
const Users = require("../models/userModel");
const Product = require("../models/productModel");

const paymentCtrl = {
  getPayments: async (req, res) => {
    try {
      const payments = await Payments.find();
      res.json(payments);
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
  createPayment: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("name email");
      if (!user) return res.status(400).json({ msg: "User dose not exists!" });
      const { cart, paymentID, address } = req.body;
      const { _id, name, email } = user;
      const newPayment = new Payments({
        user_id: _id,
        name,
        email,
        cart,
        paymentID,
        address,
      });
      cart.filter((item) => {
        return sold(item._id, item.quantity, item.sold);
      });
      await newPayment.save();
      res.status(201).json({ msg: "Payemnt Success!" });
    } catch (error) {
      return res.status(500).json({ msg: error.message });
    }
  },
};

const sold = async (id, quantity, oldSold) => {
  await Product.findOneAndUpdate(
    { _id: id },
    {
      sold: quantity + oldSold,
    }
  );
};

module.exports = paymentCtrl;
