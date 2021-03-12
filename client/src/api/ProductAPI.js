import { useEffect, useState } from "react";
import axios from "axios";
function ProductAPI() {
  const [products, setProducts] = useState([]);
  const [callback, setCallback] = useState(false);
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(0);

  const getProducts = async () => {
    const result = await axios.get(
      `/api/products?limit=${
        page * 9
      }&${category}&${sort}&title[regex]=${search}`
    );
    setProducts(result.data.products);
    setResult(result.data.result);
  };
  useEffect(() => {
    getProducts();
  }, [callback, category, sort, search, page]);
  return {
    products: [products, setProducts],
    callback: [callback, setCallback],
    category: [category, setCategory],
    sort: [sort, setSort],
    result: [result, setResult],
    search: [search, setSearch],
    page: [page, setPage],
  };
}

export default ProductAPI;
