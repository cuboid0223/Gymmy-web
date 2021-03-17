import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileDrop } from "react-file-drop";

const GuessFoodNutrition = () => {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [base64, setBase64] = useState(null);
  // click the drop area
  const onFileInputChange = (event) => {
    const { files } = event.target;
    console.log("file: ", files[0]);
    // change file to dataUri
    if (files[0] && files) {
      var reader = new FileReader();
      reader.addEventListener("load", function (e) {
        const uri = e.target.result;
        // display image on browser
        // console.log("uri: ", uri);
        setImageUrl(uri);
        // change dataUri to base64(blob) -> for request
        setBase64(dataURItoBlob(uri));
      });
      reader.readAsDataURL(files[0]);
    }
  };

  const dataURItoBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    var byteString;
    if (dataURI.split(",")[0].indexOf("base64") >= 0)
      byteString = atob(dataURI.split(",")[1]);
    else byteString = unescape(dataURI.split(",")[1]);

    // separate out the mime component
    var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to a typed array
    var ia = new Uint8Array(byteString.length);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ia], { type: mimeString });
  };

  const onTargetClick = () => {
    fileInputRef.current.click();
    console.log("onTargetClick");
    // console.log(fileInputRef);
    console.log(fileInputRef.current);
  };

  useEffect(() => {
    if (!base64) {
      return;
    }
    const form = new FormData();
    form.append("file", base64);

    const options = {
      method: "POST",
      url:
        "https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/images/analyze",
      headers: {
        "content-type":
          "multipart/form-data; boundary=---011000010111000001101001",
        "x-rapidapi-key": "561ee6d36amshf73fd6455efaa12p1935aejsn0c7dc81a59b2",
        "x-rapidapi-host":
          "spoonacular-recipe-food-nutrition-v1.p.rapidapi.com",
      },
      data: form,
    };
    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [base64]);
  return (
    <div className="guessMealNutrition" style={{ marginTop: "200px" }}>
      <div
        className="guessMealNutrition__fileDrop"
        style={{
          border: "1px solid black",
          width: "100%",
          color: "black",
          padding: 20,
        }}
      >
        <FileDrop
          onFrameDragEnter={(event) => console.log("onFrameDragEnter", event)}
          onFrameDragLeave={(event) => console.log("onFrameDragLeave", event)}
          onFrameDrop={(event) => console.log("onFrameDrop", event)}
          onDragOver={(event) => console.log("onDragOver", event)}
          onDragLeave={(event) => console.log("onDragLeave", event)}
          onDrop={(files, event) => console.log("onDrop!", files, event)}
          onTargetClick={onTargetClick}
        >
          Drop some files here!
        </FileDrop>
        <input
          onChange={onFileInputChange}
          ref={fileInputRef}
          type="file"
          className="hidden"
        />
      </div>
      {imageUrl && <img src={imageUrl} alt="..." />}
    </div>
  );
};

export default GuessFoodNutrition;
