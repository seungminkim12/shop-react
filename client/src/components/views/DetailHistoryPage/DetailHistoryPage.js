import React from "react";
import { Link } from "react-router-dom";

function DetailHistoryPage(props) {
  const historyId = props.match.params.historyId;
  let historys = [];

  props.user &&
    props.user.userData.history.map((history) => {
      if (historyId === history.paymentId) {
        historys.push(history);
      }
    });

  return (
    <div style={{ width: "80%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h1>DetailHistory</h1>
      </div>

      <br />

      <table>
        <thead>
          <tr>
            <th>ProductName</th>
            <th>Price</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {props.user.userData &&
            historys.map((history, index) => {
              return (
                <tr key={index}>
                  <td>
                    <Link
                      to={`/product/${history.id}`}
                      style={{
                        textDecoration: "none",
                        color: "rgba(0, 0, 0, 0.65)",
                      }}
                    >
                      {history.name}
                    </Link>
                  </td>

                  <td>{history.price}</td>
                  <td>{history.quantity}</td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default DetailHistoryPage;
