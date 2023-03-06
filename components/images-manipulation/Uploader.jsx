import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import styles from "../../styles/images-manipulation/Uploader.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";

function ResultItem(props) {
  return (
    <div className={styles.result_container}>
      <div>
        <img
          src={props.imageUrl}
          onClick={(event) => {
            props.onLightBoxGalleryOpen(event);
            props.onFilesReady(event);
          }}
        />
      </div>
      <button onClick={props.deleteImage}>
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
}
ResultItem.propTypes = {
  imageUrl: PropTypes.string.isRequired,
  deleteImage: PropTypes.func.isRequired,
  onLightBoxGalleryOpen: PropTypes.func,
  onFilesReady: PropTypes.func,
};

function Uploader(props) {
  const inputRef = useRef();
  const [resultImages, setResultImages] = useState([]);

  function readUploadedFiles(files) {
    setResultImages([]);
    let images = [];
    if (props.multiple && resultImages) {
      for (let i = 0; i < files.length; i++) {
        let element = window.URL.createObjectURL(files[i]);
        images = [...images, element];
        setResultImages((arr) => [...arr, element]);
      }
    } else {
      let element = window.URL.createObjectURL(files[0]);
      images = [element];
      setResultImages((arr) => [...arr, element]);
    }
    props.onFilesUpload(files);
  }

  /**
   * @param {Number} index
   */
  function deleteTargetImage(event, index) {
    setResultImages((prevArray) => {
      return prevArray.map((image, key) => {
        if (key !== index) return image;
      });
    });
    const parent = event.target.parentElement.parentElement;
    parent.removeChild(event.target.parentElement);
  }

  function handleFileChange(event) {
    event.preventDefault();

    readUploadedFiles(event.target.files);
  }

  function dragOver(event) {
    event.preventDefault();
    inputRef.current.dataset.labelDrop = true;
  }

  function dragLeave(event) {
    event.preventDefault();
    inputRef.current.dataset.labelDrop = false;
  }

  function handleDrop(event) {
    event.preventDefault();
    inputRef.current.dataset.labelDrop = true;
    readUploadedFiles(event.dataTransfer.files);
  }

  return (
    <div className={styles.container} data-active={props.openUploader}>
      <div className={styles.upload}>
        <label
          htmlFor={props.label}
          ref={inputRef}
          data-label-drop={false}
          onDragOver={dragOver}
          onDragLeave={dragLeave}
          onDrop={handleDrop}
        >
          <h4>{props.message}</h4>
          {props.inforMessage ? <span>{props.inforMessage}</span> : null}
        </label>
        <input
          type="file"
          accept="image/*"
          multiple={props.multiple}
          id={props.label}
          onChange={handleFileChange}
        />
      </div>
      {resultImages && resultImages.length > 0 ? (
        <div className={styles.result}>
          {resultImages.map((image, index) => (
            <ResultItem
              key={index}
              imageUrl={image}
              deleteImage={(event) => deleteTargetImage(event, index)}
              onLightBoxGalleryOpen={props.onLightBoxGalleryOpen}
              onFilesReady={props.onFilesReady}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

Uploader.propTypes = {
  multiple: PropTypes.bool,
  label: PropTypes.string.isRequired,
  openUploader: PropTypes.bool, // Open the Uploader UI
  message: PropTypes.string.isRequired, // title
  inforMessage: PropTypes.string, // More informations
  onFilesReady: PropTypes.func, // HTMLImageElement can be access
  onLightBoxGalleryOpen: PropTypes.func, // Open a Light Box Gallery and display current image
  onFilesUpload: PropTypes.func, // Upload the given files
};

export default Uploader;
