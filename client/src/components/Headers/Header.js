import React, { useContext } from "react";
import { GlobalState } from "../../GlobalState";
import Menu from "./icon/bar.svg";
import Close from "./icon/close.svg";
import Cart from "./icon/cart.svg";
import { Link } from "react-router-dom";
import axios from "axios";
function Header() {
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [isAdmin] = state.userAPI.isAdmin;
  const [cart] = state.userAPI.cart;

  const adminRouter = () => {
    return (
      <>
        <li>
          <Link to="/create_product">Create Product</Link>
        </li>
        <li>
          <Link to="/category">Category</Link>
        </li>
      </>
    );
  };

  const loggedRouter = () => {
    return (
      <>
        <li>
          <Link to="/history">History</Link>
        </li>
        <li>
          <Link to="/" onClick={logoutUser}>
            Logout
          </Link>
        </li>
      </>
    );
  };
  const logoutUser = async () => {
    await axios.get("/user/logout");
    window.location.href = "/";
  };
  return (
    <header>
      <div className="menu">
        <img src={Menu} alt="menu" width="30" />
      </div>
      <h1 className="logo">
        <Link to="/">{isAdmin ? "Admin" : "Faisal Shop"}</Link>
      </h1>

      <ul>
        <li>
          <Link to="/">{isAdmin ? "Products" : "Shop"}</Link>
        </li>
        {isAdmin && adminRouter()}
        {isLoggedIn ? (
          loggedRouter()
        ) : (
          <li>
            <Link to="/login">Login 🔥 Regiseter</Link>
          </li>
        )}

        <li>
          <img className="close-icon" src={Close} alt="" width="30" />
        </li>
      </ul>
      {isAdmin ? (
        ""
      ) : (
        <div className="cart-icon">
          <span>{cart.length}</span>
          <Link to="/cart">
            <img src={Cart} alt="" width="30" />
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;
