import React, { useEffect } from "react";
import axios from "axios";

function LandingPage() {
  useEffect(() => {
    axios.post("/api/product/products").then((res) => {
      if (res.data.success) {
        //
        console.log(res.data);
      } else {
        alert("상품 로딩 실패");
      }
    });
  }, []);

  return <div>LandingPage</div>;
}

export default LandingPage;
