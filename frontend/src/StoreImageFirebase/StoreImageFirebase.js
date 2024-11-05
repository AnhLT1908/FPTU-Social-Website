import React, { useState } from "react";
import { imgDB } from "./firebaseConfig";
import { v4 } from "uuid"

function StoreImageFirebase() {
  const [img, setImg] = useState("");
  const handleUpload = (e) => {
    console.log(e.target.files);
  };
  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e)} />
    </div>
  );
}

export default StoreImageFirebase;
