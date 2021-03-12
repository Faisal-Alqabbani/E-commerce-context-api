import React, { useContext } from "react";
import { GlobalState } from "../../../GlobalState";
function Filters() {
  const state = useContext(GlobalState);
  const [products, setProducts] = state.productsAPI.products;
  const [category, setCategory] = state.productsAPI.category;
  const [sort, setSort] = state.productsAPI.sort;
  const [search, setSearch] = state.productsAPI.search;
  const [categories, setCategories] = state.categoriesAPI.categories;

  const handleCategory = (e) => {
    setCategory(e.target.value);
    setSearch("");
  };
  return (
    <div className="filter_menu">
      <div className="row">
        <span>Filter:</span>
        <select name="categroy" value={category} onChange={handleCategory}>
          <option value="">All Products</option>
          {categories.map((category) => (
            <option value={"category=" + category._id} key={category._id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <input
        type="text"
        placeholder="Search"
        value={search}
        onChange={(e) => setSearch(e.target.value.toLowerCase())}
      />
      <div className="row">
        <span>Sort by:</span>
        <select
          name="categroy"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="">Newset</option>
          <option value="sort=oldest">Oldest</option>
          <option value="sort=-sold">Best Sale</option>
          <option value="sort=-price">Price:Height-low</option>
          <option value="sort=price">Price:Low-Hight</option>
        </select>
      </div>
    </div>
  );
}

export default Filters;
