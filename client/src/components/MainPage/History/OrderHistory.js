import React, { useContext, useEffect } from "react";
import { GlobalState } from "../../../GlobalState";
import { Link } from "react-router-dom";
import axios from "axios";
function OrderHistory() {
  const state = useContext(GlobalState);
  const [history, setHistory] = state.userAPI.history;
  const [token] = state.token;
  const [isAdmin] = state.userAPI.isAdmin;
  useEffect(() => {
    if (token) {
      const getHistory = async () => {
        if (isAdmin) {
          const result = await axios.get("/api/payment", {
            headers: { Authorization: token },
          });
          setHistory(result.data);
        } else {
          const result = await axios.get("/user/history", {
            headers: { Authorization: token },
          });
          setHistory(result.data);
        }
      };
      getHistory();
    }
  }, [token, isAdmin, setHistory]);
  if (history.length === 0) return <h1>You have not ordered yet!</h1>;
  return (
    <div className="history-page">
      <h2>History</h2>
      <h4>You have {history.length} Ordered</h4>
      <div>
        <table>
          <thead>
            <tr>
              <th>Payment ID</th>
              <th>Date of Purchased</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {history.map((item) => (
              <tr key={item._id}>
                <td>{item.paymentID}</td>
                <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                <td>
                  <Link to={`/history/${item._id}`}>View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default OrderHistory;
