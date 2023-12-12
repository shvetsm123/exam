import React, { useState } from 'react';
import { useField } from 'formik';

const FieldFileInput = ({ classes, name, ...rest }) => {
  const {
    fileUploadContainer,
    labelClass,
    fileNameClass,
    fileInput,
    imagePreview,
  } = classes;
  const [{ value, ...restFields }, , helpers] = useField(name);
  const getFileName = () => {
    if (value) {
      return value.name;
    }
    return '';
  };

  const [previewURL, setPreviewURL] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      helpers.setValue(file);

      if (file.type.startsWith('image')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewURL(reader.result);
        };
        reader.readAsDataURL(file);
      } else if (file.type === 'application/pdf') {
        setPreviewURL(URL.createObjectURL(file));
      } else {
        setPreviewURL(null);
      }
    } else {
      helpers.setValue(null);
      setPreviewURL(null);
    }
  };

  const previewStyles = {
    width: '120px',
    height: '120px',
    alignSelf: 'center',
  };

  const supportTextStyles = {
    display: previewURL ? 'none' : 'block',
    color: 'red',
  };

  return (
    <div className={fileUploadContainer}>
      <label htmlFor="fileInput" className={labelClass}>
        Choose file
      </label>
      <span id="fileNameContainer" className={fileNameClass}>
        {getFileName()}
      </span>
      <input
        {...restFields}
        onChange={handleFileChange}
        className={fileInput}
        id="fileInput"
        type="file"
        accept=".jpg, .png, .jpeg, .pdf"
      />
      <span style={supportTextStyles}>
        Supports only (*.jpeg, *.jpg, *.png, *.pdf)
      </span>
      {previewURL && value.type.startsWith('image') ? (
        <img
          src={previewURL}
          alt="Preview"
          style={previewStyles}
          className={imagePreview}
        />
      ) : previewURL && value.type === 'application/pdf' ? (
        <object
          data={previewURL}
          type="application/pdf"
          width="120"
          height="120"
          aria-label="pdf"
        ></object>
      ) : null}
    </div>
  );
};

export default FieldFileInput;
