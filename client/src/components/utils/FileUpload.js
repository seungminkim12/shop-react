import React from "react";
import Dropzone from "react-dropzone";
import { Icon } from "antd";
import axios from "axios";

function FileUpload() {
  const dropHandler = (file) => {
    let formData = new FormData();
    const config = {
      header: { contentType: "multipart/form-data" },
    };
    formData.append("file", file[0]);

    axios.post("/api/product/image", formData, config).then((res) => {
      if (res.data.success) {
        //
        console.log(res.data);
      } else {
        alert("파일 업로드 실패");
      }
    });
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
    </div>
  );
}

export default FileUpload;
