import React, { useContext, useState } from "react";
import { GlobalState } from "../../../GlobalState";
import ProductItem from "../utils/productItem/ProductItem";
import Loading from "../utils/Loading/Loading";
import axios from "axios";
import Filter from "./Filters";
import LoadMore from "./LoadMore";
function Products() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [isAdmin] = state.userAPI.isAdmin;
  const [token] = state.token;
  const [callback, setCallback] = state.productsAPI.callback;
  const [loading, setLoading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const deleteProduct = async (id, public_id) => {
    console.log(id, public_id);
    try {
      setLoading(true);
      const destroyImage = axios.post(
        "/api/destroy",
        { public_id },
        {
          headers: { Authorization: token },
        }
      );
      const deleteProduct = axios.delete(`/api/products/${id}`, {
        headers: { Authorization: token },
      });
      await destroyImage;
      await deleteProduct;
      setLoading(false);
      setCallback(!callback);
    } catch (error) {
      alert(error.response.data.msg);
    }
  };

  const handleCheck = (id) => {
    products.forEach((product) => {
      if (product._id === id) product.checked = !product.checked;
    });
    setProducts([...products]);
  };
  const checkAll = () => {
    products.forEach((product) => {
      product.checked = !isChecked;
    });
    setProducts([...products]);
    setIsChecked(!isChecked);
  };
  const deleteAll = () => {
    products.forEach((product) => {
      if (product.checked) deleteProduct(product._id, product.image.public_id);
    });
  };
  return (
    <>
      <Filter />
      {isAdmin && (
        <div className="delete-all">
          <span>Select All</span>
          <input type="checkbox" checked={isChecked} onChange={checkAll} />
          <button onClick={deleteAll}>Delete All</button>
        </div>
      )}
      <div className="products">
        {products.map((product) => (
          <ProductItem
            key={product._id}
            product={product}
            deleteProduct={deleteProduct}
            isAdmin={isAdmin}
            handleCheck={handleCheck}
            loading={loading}
          />
        ))}
      </div>
      <LoadMore />
      {products.length === 0 && <Loading />}
    </>
  );
}

export default Products;
