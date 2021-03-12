import React, { useContext, useState, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
import PaypalButton from "./Paypal";
function Cart() {
  const state = useContext(GlobalState);
  const [cart, setCart] = state.userAPI.cart;
  const [token] = state.token;
  const [total, setTotal] = useState(0);
  console.log("cart ", cart);
  useEffect(() => {
    const getTotal = () => {
      const total = cart.reduce((prev, item) => {
        return prev + item.price * item.quantity;
      }, 0);
      setTotal(total);
    };
    getTotal();
  }, [cart]);

  const addToCart = async (cart) => {
    await axios.patch(
      "/user/addcart",
      { cart },
      {
        headers: { Authorization: token },
      }
    );
  };
  const removeProduct = (id) => {
    if (window.confirm("Do you want to delete this product!")) {
      cart.forEach((item, index) => {
        if (item._id === id) {
          cart.splice(index, 1);
        }
      });
      setCart([...cart]);
      addToCart(cart);
    }
  };

  const increment = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity += 1;
      }
    });
    setCart([...cart]);
    addToCart(cart);
  };
  const decrement = (id) => {
    cart.forEach((item) => {
      if (item._id === id) {
        item.quantity === 1 ? (item.quantity = 1) : (item.quantity -= 1);
      }
    });
    setCart([...cart]);
    addToCart(cart);
  };
  const tranSuccess = async (payment) => {
    const { paymentID, address } = payment;
    await axios.post(
      "/api/payment",
      {
        cart,
        paymentID,
        address,
      },
      { headers: { Authorization: token } }
    );
    setCart([]);
    addToCart([]);
    alert("You have successfully placed an order!");
  };
  if (cart.length === 0)
    return (
      <h1 style={{ textAlign: "center", fontSize: "5rem", opacity: 0.8 }}>
        Your Cart is Empty
      </h1>
    );
  return (
    <div>
      {cart.map((product) => (
        <div key={product._id} className="detail cart">
          <img
            src={product.image.url}
            alt={product.title}
            className="img_container"
          />
          <div className="box-detail">
            <div className="row">
              <h2>{product.title}</h2>
              <h6>#id: {product.product_id}</h6>
            </div>
            <h3>${product.price * product.quantity}</h3>
            <p>{product.description}</p>
            <p>{product.content}</p>
            <p>Sold: {product.sold}</p>
            <div className="amount">
              <button onClick={() => decrement(product._id)}>-</button>
              <span>{product.quantity}</span>
              <button onClick={() => increment(product._id)}>+</button>
            </div>
            <div className="delete" onClick={() => removeProduct(product._id)}>
              X
            </div>
          </div>
        </div>
      ))}
      <div className="total">
        <h3>Total: ${total}</h3>
        <PaypalButton total={total} tranSuccess={tranSuccess} />
      </div>
    </div>
  );
}

export default Cart;
