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

function LandingPage(props) {
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

<<<<<<< HEAD
    console.log("body", body);
=======
>>>>>>> proxyTest
    getProducts(body);
  }, []);

  //load products
  const getProducts = (body) => {
    axios.post("/api/product/products", body).then((res) => {
      if (res.data.success) {
        if (body.loadMore) {
          //필터링해서 더보기 했을때 중복제거 이슈가 있었는데 해결위해 현재State와 res로 데이터 가져온 값을 배열에 담음
          const allProducts = [...Products, ...res.data.productInfo];
          const newProducts = [];

          //일단 비교를 위해 현재 state의 갯수X 가져온 res 데이터 수 로 이중 map 돌림
          Products.map((product) => {
            res.data.productInfo.map((pro) => {
              //첫째 product와 res데이터 갯수대로 pro _id 값 비교 && state안에 없는값 && temp 안에 없는 값
              if (
                product._id !== pro._id &&
                !JSON.stringify(Products).includes(pro._id) &&
                !JSON.stringify(newProducts).includes(pro._id)
              ) {
                newProducts.push(pro);
              }
            });
          });

          //새로운 걊이 하나라도 있으면 현재State + temp걊
          if (newProducts.length > 0) {
            setProducts([...Products, ...newProducts]);
          } else {
            //필터링 없이 더보기 했을때
            setProducts([...allProducts]);
          }
        } else {
          //더보기 없는 값 불러오기
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
