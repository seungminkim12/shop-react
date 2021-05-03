import React, { useState } from "react";
import Dropzone from "react-dropzone";
import { Icon } from "antd";
import axios from "axios";

function FileUpload(props) {
  const [images, setImages] = useState([]);

  const dropHandler = (file) => {
    let formData = new FormData();
    const config = {
      header: { contentType: "multipart/form-data" },
    };
    formData.append("file", file[0]);

    axios.post("/api/product/image", formData, config).then((res) => {
      if (res.data.success) {
        //
        setImages([...images, res.data.filePath]);
        images.map((image) => console.log(`../server/${image}`));
        props.refreshFunction([...images, res.data.filePath]);
      } else {
        alert("파일 업로드 실패");
      }
    });
  };

  const deleteHandler = (image) => {
    const currentIndex = images.indexOf(image);
    let newImages = [...images];
    newImages.splice(currentIndex, 1);
    setImages(newImages);
    props.refreshFunction(newImages);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <Dropzone onDrop={dropHandler}>
        {({ getRootProps, getInputProps }) => (
          <div
            style={{
              width: 300,
              height: 240,
              border: "1px solid lightgray",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            {...getRootProps()}
          >
            <input {...getInputProps()} />
            <Icon type="plus" style={{ fontSize: "3rem" }} />
          </div>
        )}
      </Dropzone>

      {images && (
        <div
          style={{
            display: "flex",
            width: "350px",
            height: "240px",
            overflowY: "hidden",
          }}
        >
          {images.map((image, index) => (
            <>
              <div onClick={() => deleteHandler(image)} key={index}>
                <img
                  style={{ minWidth: "300px", width: "300px", height: "240px" }}
                  src={`../../../server/${image}`}
                />
              </div>
            </>
          ))}
        </div>
      )}
    </div>
  );
}

export default FileUpload;
