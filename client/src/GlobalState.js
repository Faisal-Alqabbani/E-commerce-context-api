import React, { createContext, useState, useEffect } from "react";
import ProductsAPI from "./api/ProductAPI";
import UserAPI from "./api/UserAPI";
import axios from "axios";
import CategoryAPI from "./api/CategoryAPI";
export const GlobalState = createContext();

export const DataProvider = ({ children }) => {
  const [token, setToken] = useState(false);

  useEffect(() => {
    const refreshToken = async () => {
      const result = await axios.get("/user/refresh_token");
      setToken(result.data.accesstoken);
      setTimeout(() => {
        refreshToken();
      }, 10 * 60 * 1000);
    };
    refreshToken();
  }, []);
  const state = {
    token: [token, setToken],
    productsAPI: ProductsAPI(),
    userAPI: UserAPI(token),
    categoriesAPI: CategoryAPI(token),
  };
  return <GlobalState.Provider value={state}>{children}</GlobalState.Provider>;
};
