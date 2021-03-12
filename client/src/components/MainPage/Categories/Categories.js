import React, { useState, useContext } from "react";
import { GlobalState } from "../../../GlobalState";
import axios from "axios";
function Categories() {
  const state = useContext(GlobalState);
  const [categories, setCategories] = state.categoriesAPI.categories;
  const [token] = state.token;
  const [callback, setCallback] = state.categoriesAPI.callback;
  const [category, setCategory] = useState("");
  const [onEdit, setOnEdit] = useState(false);
  const [id, setID] = useState("");

  const createCategory = async (e) => {
    e.preventDefault();
    if (onEdit) {
      const res = await axios.put(
        `/api/category/${id}`,
        { name: category },
        {
          headers: { Authorization: token },
        }
      );
      alert(res.data.msg);
    } else {
      try {
        const res = await axios.post(
          "/api/category",
          { name: category },
          {
            headers: { Authorization: token },
          }
        );
        alert(res.data.msg);
      } catch (error) {
        alert(error.response.data.msg);
      }
    }
    setCallback(!callback);
    setCategory("");
  };

  const editeHandler = async (id, name) => {
    setID(id);
    setCategory(name);
    setOnEdit(true);
  };
  const deleteHandler = async (id) => {
    try {
      if (window.confirm("Are you sure you want to delete")) {
        const res = await axios.delete(`/api/category/${id}`, {
          headers: { Authorization: token },
        });
        setCallback(!callback);
        alert(res.data.msg);
      }
    } catch (error) {
      alert(error.response.data.msg);
    }
  };
  return (
    <div className="categories">
      <form onSubmit={createCategory}>
        <label htmlFor="category">Category</label>
        <input
          type="text"
          id="category"
          name="category"
          value={category}
          placeholder="Add new Category"
          required
          onChange={(e) => setCategory(e.target.value)}
        />
        <button type="submit">{onEdit ? "Update" : "Save"}</button>
      </form>
      <div className="cal">
        {categories.map((item) => (
          <div className="row" key={item._id}>
            <p>{item.name}</p>
            <div>
              <button onClick={() => editeHandler(item._id, item.name)}>
                Edit
              </button>
              <button onClick={() => deleteHandler(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Categories;
