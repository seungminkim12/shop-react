import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon, Col, Card, Row, Checkbox } from "antd";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { continent, price } from "./Sections/Datas";
import RadioBox from "./Sections/RadioBox";

function LandingPage() {
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(4);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    continents: [],
    price: [],
  });

  useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };

    getProducts(body);
  }, []);

  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((res) => {
      if (res.data.success) {
        if (body.loadMore) {
          setProducts([...Products, ...res.data.productInfo]);
        } else {
          setProducts(res.data.productInfo);
        }
        setPostSize(res.data.postSize);
      } else {
        alert("상품 로딩 실패");
      }
    });
  };

  const loadMoreHandler = () => {
    let skip = Skip + Limit;

    let body = {
      skip,
      limit: Limit,
      loadMore: true,
    };

    getProducts(body);
    setSkip(skip);
  };

  const renderCards = Products.map((product, index) => {
    console.log("product", product);
    return (
      <Col key={index} lg={6} md={8} xs={24}>
        <Card cover={<ImageSlider images={product.images} />}>
          <Meta title={product.title} description={`${product.price}`} />
        </Card>
      </Col>
    );
  });

  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };

    newFilters[category] = filters;
    console.log(newFilters[category]);
    let body = {
      skip: 0,
      limit: Limit,
      newFilters,
    };

    getProducts(body);
    setSkip(0);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>
          Let's Travel Anywhere <Icon type="rocket" />
        </h2>
      </div>

      {/*Filter */}

      <Row gutter={[16, 16]}>
        <Col lg={12} xs={24}>
          {/*Checkbox*/}
          <CheckBox
            list={continent}
            handleFilters={(filters) => handleFilters(filters, "continent")}
          />
        </Col>
        <Col lg={12} xs={24}>
          {/*RadioBox */}
          <RadioBox
            list={price}
            handleFilters={(filters) => handleFilters(filters, "continent")}
          />
        </Col>
      </Row>

      {/*Search */}

      {/*Cards */}
      <Row gutter={(16, 16)}>{renderCards}</Row>

      {PostSize >= Limit && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <button onClick={loadMoreHandler}>더보기</button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
