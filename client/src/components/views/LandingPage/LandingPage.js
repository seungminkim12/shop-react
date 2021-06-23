import React, { useEffect, useState } from "react";
import axios from "axios";
import { Icon, Col, Card, Row, Checkbox, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import Meta from "antd/lib/card/Meta";
import ImageSlider from "../../utils/ImageSlider";
import CheckBox from "./Sections/CheckBox";
import { continent, price } from "./Sections/Datas";
import RadioBox from "./Sections/RadioBox";
import SearchFeature from "./Sections/SearchFeature";

function LandingPage() {
  //states
  const [Products, setProducts] = useState([]);
  const [Skip, setSkip] = useState(0);
  const [Limit, setLimit] = useState(4);
  const [PostSize, setPostSize] = useState(0);
  const [Filters, setFilters] = useState({
    continent: [],
    price: [],
  });
  const [SearchTerm, setSearchTerm] = useState("");

  //functions
  useEffect(() => {
    let body = {
      skip: Skip,
      limit: Limit,
    };

    getProducts(body);
  }, []);

  //load products
  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((res) => {
      if (res.data.success) {
        if (body.loadMore) {
          console.log("res.productInfo : ", res.data.productInfo);
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

  //슬라이드 그리기
  const renderCards = Products.map((product, index) => {
    return (
      <Col key={index} lg={6} md={8} xs={24} style={{ marginTop: "15px" }}>
        <Card
          cover={
            <a href={`/product/${product._id}`}>
              <ImageSlider images={product.images} />
            </a>
          }
        >
          <Meta title={product.title} description={`${product.price}`} />
        </Card>
      </Col>
    );
  });

  //더보기
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

  //가격 setting
  const handlePrice = (value) => {
    const data = price;
    let array = [];

    for (let key in data) {
      if (data[key]._id === value) {
        array = data[key].array;
      }
    }
    return array;
  };

  //필터 공통 작업
  const showFilteredResult = (filters) => {
    let body = {
      skip: 0,
      limit: Limit,
      newFilters: filters,
    };

    getProducts(body);
    setSkip(0);
  };

  //필터 판별
  const handleFilters = (filters, category) => {
    const newFilters = { ...Filters };

    newFilters[category] = filters;

    console.log("newFilters", newFilters);

    if (category === "price") {
      let priceValue = handlePrice(filters);
      newFilters[category] = priceValue;
    }

    showFilteredResult(newFilters);
    setFilters(newFilters);
  };

  //검색
  const updateSearchTerm = (newSearchTerm) => {
    let body = {
      skip: 0,
      limit: Limit,
      newFilters: Filters,
      SearchTerm: newSearchTerm,
    };

    setSkip(0);
    setSearchTerm(newSearchTerm);
    getProducts(body);
  };

  return (
    <div style={{ width: "75%", margin: "3rem auto" }}>
      <div style={{ textAlign: "center" }}>
        <h2>Travel</h2>
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
            handleFilters={(filters) => handleFilters(filters, "price")}
          />
        </Col>
      </Row>

      {/*Search */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          margin: "1rem auto",
        }}
      >
        <SearchFeature refreshFunction={(value) => updateSearchTerm(value)} />
      </div>

      {/*Cards */}
      <Row gutter={(16, 16)}>{renderCards}</Row>

      {PostSize >= Limit && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <Button onClick={loadMoreHandler}>
            <Icon type="plus" />
            더보기
          </Button>
        </div>
      )}
    </div>
  );
}

export default LandingPage;
