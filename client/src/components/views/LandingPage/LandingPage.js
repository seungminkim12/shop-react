import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon, Col, Card, Row } from "antd";
import Meta from "antd/lib/card/Meta";

function LandingPage() {
  const [Products, setProducts] = useState([]);

  useEffect(() => {
    axios.post("/api/product/products").then((res) => {
      if (res.data.success) {
        //
        console.log(res.data);
        setProducts(res.data.productInfo);
      } else {
        alert("상품 로딩 실패");
      }
    });
  }, []);

  const renderCards = Products.map((product, index) => {
    console.log("product", product);
    return (
      <Col key={index} lg={6} md={8} xs={24}>
        <Card
          cover={
            <img
              style={{ width: "100%", maxHeight: "150px" }}
              src={`http://localhost:5000/${product.images[0]}`}
            />
          }
        >
          <Meta title={product.title} description={`${product.price}`} />
        </Card>
      </Col>
    );
  });

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travel Anywhere <Icon type="rocket" />
        </h2>
      </div>

      {/*Filter */}

      {/*Search */}

      {/*Cards */}
      <Row gutter={(16, 16)}>{renderCards}</Row>

      <div style={{ display: "flex", justifyContent: "center" }}>
        <button>더보기</button>
      </div>
    </div>
  );
}

export default LandingPage;
