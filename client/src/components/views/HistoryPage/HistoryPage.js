import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function HistoryPage(props) {
  const [Ids, setIds] = useState([]);

  useEffect(() => {
    if (props.user.userData && props.user.userData.history) {
      setIds([...Ids, ...props.user.userData.history]);
    }
  }, [props.user]);

  let newIds = [];

  Ids.map((id) => {
    props.user.userData.history.map((item) => {
      if (!JSON.stringify(newIds).includes(item.paymentId)) {
        newIds.push(item);
      }
    });
  });

  console.log(newIds);

  return (
    <>
      <div style={{ width: "80%", margin: "3rem auto" }}>
        <div style={{ textAlign: "center" }}>
          <h1>History</h1>
        </div>
        <br />

        <table>
          <thead>
            <tr>
              <th>Payment Id</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Date Of Purchase</th>
            </tr>
          </thead>
          <tbody>
            {props.user.userData &&
              newIds.map((it, index) => {
                return (
                  <tr key={index}>
                    <td>
                      <Link
                        to={`/history/${it.paymentId}`}
                        style={{
                          textDecoration: "none",
                          color: "rgba(0, 0, 0, 0.65)",
                        }}
                      >
                        {it.paymentId}
                      </Link>
                    </td>
                    <td>{it.price}</td>
                    <td>{it.quantity}</td>
                    <td>{it.dateOfPurchase.toString().substring(0, 10)}</td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default HistoryPage;
