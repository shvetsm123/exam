import React, { useState } from 'react';
import { useField } from 'formik';

const ImageUpload = ({ name, classes }) => {
  const [{ value, ...restFields }, , helpers] = useField(name);
  const { uploadContainer, inputContainer, imgStyle } = classes;
  const [previewURL, setPreviewURL] = useState(null);

  const onChange = (e) => {
    const file = e.target.files[0];
    const imageType = /image.*/;
    if (!file.type.match(imageType)) {
      e.target.value = '';
    } else {
      helpers.setValue(file, false);
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewURL(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={uploadContainer}>
      <div className={inputContainer}>
        <span>Support only images (*.png, *.gif, *.jpeg)</span>
        <input
          {...restFields}
          id="fileInput"
          type="file"
          accept=".jpg, .png, .jpeg, .gif"
          onChange={onChange}
        />
        <label htmlFor="fileInput">Choose file</label>
      </div>
      {previewURL ? (
        <img
          id="imagePreview"
          src={previewURL}
          className={imgStyle}
          alt="user"
        />
      ) : null}
    </div>
  );
};

export default ImageUpload;
