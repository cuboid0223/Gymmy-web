import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FileDrop } from "react-file-drop";
import Modal from "react-modal";

const GuessFoodNutrition = () => {
  const fileInputRef = useRef(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [base64, setBase64] = useState(null);
  const [meal, setMeal] = useState(null);
  const [modalIsOpen, setIsOpen] = useState(false);
  Modal.setAppElement(document.getElementById("root"));
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
    },
  };
  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  // drop the file on drop area
  const onFileDrop = (files) => {
    console.log("file: ", files[0]);
    if (files[0] && files) {
      filetoDataUri(files[0]);
    }
  };
  // when click the drop area
  const onFileInputChange = (event) => {
    const { files } = event.target;
    // console.log("file: ", files[0]);
    // change file to dataUri
    if (files[0] && files) {
      filetoDataUri(files[0]);
    }
  };

  const filetoDataUri = (file) => {
    var reader = new FileReader();
    reader.addEventListener("load", function (e) {
      const uri = e.target.result;
      // display image on browser
      // console.log("uri: ", uri);
      setImageUrl(uri);
      // change dataUri to base64(blob) -> for request
      setBase64(dataURItoBlob(uri));
    });
    reader.readAsDataURL(file);
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
    // 即下方的 <input> 點擊，會跳出選擇檔案
    fileInputRef.current.click();
  };

  // request
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
        setMeal(response.data);
        // 等資料回傳 打開 modal

        setIsOpen(true);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [base64]);
  return (
    <div className="guessFoodNutrition" id="guessFoodNutrition">
      <h1>Guess Your Meal Nutrition</h1>
      <div className="guessFoodNutrition__fileDrop">
        <FileDrop
          onFrameDragEnter={(event) => console.log("onFrameDragEnter", event)}
          onFrameDragLeave={(event) => console.log("onFrameDragLeave", event)}
          onFrameDrop={(event) => console.log("onFrameDrop", event)}
          onDragOver={(event) => console.log("onDragOver", event)}
          onDragLeave={(event) => console.log("onDragLeave", event)}
          onDrop={onFileDrop}
          onTargetClick={onTargetClick}
        >
          <p>Drop or select a file here!</p>
        </FileDrop>
      </div>
      <input
        onChange={onFileInputChange}
        ref={fileInputRef}
        type="file"
        className="hiddenInput"
      />
      {imageUrl && (
        <img className="guessFoodNutrition__image" src={imageUrl} alt="..." />
      )}

      {meal && (
        <div>
          <Modal
            isOpen={modalIsOpen}
            onRequestClose={closeModal}
            style={customStyles}
            contentLabel="Example Modal"
          >
            <button onClick={closeModal}>close</button>
            <p>{meal.category.name}</p>
            <p>
              {meal.nutrition.calories.value} {meal.nutrition.calories.unit}
            </p>
          </Modal>
        </div>
      )}
    </div>
  );
};

export default GuessFoodNutrition;
