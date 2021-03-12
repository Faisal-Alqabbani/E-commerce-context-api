import React from "react";
import BtnRender from "./BtnRender";
import Loading from "../../utils/Loading/Loading";
function ProductItem({
  product,
  isAdmin,
  deleteProduct,
  handleCheck,
  loading,
}) {
  // handel chang
  if (loading) return <Loading />;
  return (
    <div className="product_card">
      {isAdmin && (
        <input
          type="checkbox"
          checked={product.checked}
          onChange={() => handleCheck(product._id)}
        />
      )}
      <img src={product.image.url} alt="" />
      <div className="product_box">
        <h2 title={product.title}>{product.title}</h2>
        <span>${product.price}</span>
        <p>{product.description.slice(0, 150)}...</p>
      </div>
      <BtnRender product={product} deleteProduct={deleteProduct} />
      {/* <div className="row_btn">
        <Link id="btn_buy" to="#!">
          Buy
        </Link>
        <Link id="btn-view" to={`/detail/${product._id}`}>
          View
        </Link>
      </div> */}
    </div>
  );
}

export default ProductItem;
