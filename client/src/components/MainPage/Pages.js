import React, { useContext } from "react";
import { Route, Switch } from "react-router-dom";
import Products from "../MainPage/prdocuts/Products";
import DetailProduct from "../MainPage/DetailProduct/DetailProduct";
import Login from "../MainPage/auth/Login";
import Register from "../MainPage/auth/Register";
import Cart from "../MainPage/cart/Cart";
import NotFound from "../MainPage/utils/NotFound";
import { GlobalState } from "../../GlobalState";
import OrderHistory from "./History/OrderHistory";
import OrderDetail from "./History/OrderDetail";
import Categories from "../MainPage/Categories/Categories";
import CreateProduct from "../MainPage/CreateProduct/CreateProduct";

function Pages() {
  const state = useContext(GlobalState);
  const [isLoggedIn] = state.userAPI.isLoggedIn;
  const [isAdmin] = state.userAPI.isAdmin;
  return (
    <Switch>
      <Route path="/" exact component={Products} />
      <Route path="/detail/:id" exact component={DetailProduct} />
      <Route path="/login" exact component={isLoggedIn ? NotFound : Login} />
      <Route
        path="/register"
        exact
        component={isLoggedIn ? NotFound : Register}
      />
      <Route
        path="/history"
        exact
        component={isLoggedIn ? OrderHistory : NotFound}
      />
      <Route
        path="/history/:id"
        exact
        component={isLoggedIn ? OrderDetail : NotFound}
      />
      <Route
        path="/category"
        exact
        component={isAdmin ? Categories : NotFound}
      />
      <Route
        path="/create_product"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />
      <Route
        path="/edit_product/:id"
        exact
        component={isAdmin ? CreateProduct : NotFound}
      />
      <Route path="/cart" exact component={Cart} />
      <Route path="*" exact component={NotFound} />
    </Switch>
  );
}

export default Pages;
