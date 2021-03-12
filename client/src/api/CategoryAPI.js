import { useState, useEffect } from "react";
import axios from "axios";
function CategoryAPI(token) {
  const [categories, setCategories] = useState([]);
  const [callback, setCallback] = useState(false);

  useEffect(() => {
    const getCategory = async () => {
      const result = await axios.get("/api/category");
      console.log(result);
      setCategories(result.data);
    };
    getCategory();
  }, [callback]);
  return {
    categories: [categories, setCategories],
    callback: [callback, setCallback],
  };
}

export default CategoryAPI;
