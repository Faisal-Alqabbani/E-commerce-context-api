import axios from "axios";
import { useEffect, useState } from "react";

function UserAPI(token) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [cart, setCart] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (token) {
      const getUser = async () => {
        try {
          const result = await axios.get("/user/infor", {
            headers: { Authorization: token },
          });
          setIsLoggedIn(true);
          // Check if the user is admin ? setUserAdmin = true if not false;
          result.data.user.role === 1 ? setIsAdmin(true) : setIsAdmin(false);
          // setCart if there is a user's cart
          setCart(result.data.user.cart);
        } catch (error) {
          alert(error.response.data.msg);
        }
      };
      getUser();
    }
  }, [token]);

  const addCart = async (product) => {
    if (!isLoggedIn)
      return alert("Please login to Continue purchase Proccess!");
    const check = cart.every((item) => {
      return item._id !== product._id;
    });
    if (check) {
      setCart([...cart, { ...product, quantity: 1 }]);

      await axios.patch(
        "/user/addcart",
        { cart: [...cart, { ...product, quantity: 1 }] },
        {
          headers: { Authorization: token },
        }
      );
    } else {
      alert("This product already exists in Your Cart!");
    }
  };
  return {
    isLoggedIn: [isLoggedIn, setIsLoggedIn],
    isAdmin: [isAdmin, setIsAdmin],
    cart: [cart, setCart],
    addCart: addCart,
    history: [history, setHistory],
  };
}

export default UserAPI;
