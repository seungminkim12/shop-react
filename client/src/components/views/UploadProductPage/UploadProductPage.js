import React, { useState, useEffect } from "react";
import { Typography, Button, Form, Input } from "antd";
import FileUpload from "../../utils/FileUpload";
import Axios from "axios";

const { Title } = Typography;
const { TextArea } = Input;

const Continents = [
  { key: 1, value: "Africa" },
  { key: 2, value: "Europe" },
  { key: 3, value: "Asia" },
  { key: 4, value: "North America" },
  { key: 5, value: "South America" },
  { key: 6, value: "Australia" },
  { key: 7, value: "Antarctica" },
];

function UploadProductPage(props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState(0);
  const [continent, setContinent] = useState(1);
  const [images, setImages] = useState([]);

  const onChangeHandler = (event) => {
    const { target } = event;
    if (target.name === "title") {
      setTitle(target.value);
    } else if (target.name === "description") {
      setDescription(target.value);
    } else if (target.name === "price") {
      setPrice(target.value);
    } else if (target.name === "continents") {
      console.log(target.value);
      setContinent(target.value);
    }
  };

  const updateImages = (newImages) => {
    setImages(newImages);
    console.log("afterImages:", images);
  };

  useEffect(() => {
    console.log("before Images:", images);
  }, [images]);

  const submitHandler = (event) => {
    event.preventDefault();

    if (!title || !description || !price || !images || !continent) {
      return alert("모든 값을 입력해 주세요!");
    }

    //서버에 채운 값을 request로 보냄
    const body = {
      writer: props.user.user.email,
      title,
      description,
      price,
      images,
      continent,
    };

    Axios.post("/api/product", body).then((res) => {
      if (res.data.success) {
        alert("업로드 성공");
        props.history.push("/");
      } else {
        alert("업로드 실패");
      }
    });
  };

  return (
    <div style={{ maxWidth: "700px", margin: "2rem auto" }}>
      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <Title level={2}>여행 상품 업로드</Title>
      </div>
      <Form onSubmit={submitHandler}>
        <FileUpload refreshFunction={updateImages} />
        <br />
        <br />
        <label>이름</label>
        <Input name="title" value={title} onChange={onChangeHandler} />
        <br />
        <br />
        <label>설명</label>
        <TextArea
          name="description"
          value={description}
          onChange={onChangeHandler}
        />
        <br />
        <br />
        <label>가격</label>
        <Input
          type="number"
          name="price"
          value={price}
          onChange={onChangeHandler}
        />
        <br />
        <br />
        <select name="continents" onChange={onChangeHandler} value={continent}>
          {Continents.map((items) => (
            <option key={items.key} value={items.key}>
              {items.value}
            </option>
          ))}
        </select>
        <br />
        <br />
        <Button type="submit">확인</Button>
      </Form>
    </div>
  );
}

export default UploadProductPage;
