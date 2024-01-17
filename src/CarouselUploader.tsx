import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import img from "./assets/Vector.png";
import btnArrow from "./assets/btn_Arrow.png";
import "./CarouselUploader.css";

interface CarouselUploaderProps {}

const CarouselUploader: React.FC<CarouselUploaderProps> = () => {
  const [images, setImages] = useState<string[]>([]);
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [dragOver, setDragOver] = useState<boolean>(false);

  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      "image/*": [".png", ".gif", ".jpeg", ".jpg"],
    },
    multiple: false,
    onDragEnter: () => {
      setDragOver(true);
    },
    onDragLeave: () => {
      setDragOver(false);
    },
    onDrop: (acceptedFiles) => {
      setDragOver(false);
      const newImages = acceptedFiles.reduce(
        (acc, file) => {
          if (file.type.startsWith("image/") && file.type !== "image/svg+xml") {
            const img = new Image();
            img.src = URL.createObjectURL(file);
            img.onload = () => {
              if (img.width <= 800 && img.height <= 800) {
                acc.push(URL.createObjectURL(file));
                setImages(acc);
                setCurrentSlide(acc.length - 1);
              } else {
                alert(
                  "As dimensões da imagem devem ser menores ou iguais a 800x800 pixels."
                );
              }
            };
          }
          return acc;
        },
        [...images]
      );
    },
  });

  const removeImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);
  };

  const scrollLeft = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prevSlide) => prevSlide - 1);
    }
  };

  const scrollRight = () => {
    if (currentSlide < images.length - 1) {
      setCurrentSlide((prevSlide) => prevSlide + 1);
    }
  };

  return (
    <div className="carousel-uploader-container">
      <div
        {...getRootProps({
          onClick: (event) => {
            event.stopPropagation();
          },
        })}
        className={`dropzone ${images.length > 0 ? "with-images" : ""} ${
          dragOver ? "drag-over" : ""
        }`}
      >
        <input {...getInputProps()} />
        {dragOver && (
          <div className="overlay">
            <p>Jogue a imagem aqui!</p>
          </div>
        )}
        {images.length === 0 && (
          <>
            <div className="add-image-card2">
              <img style={{ marginRight: 10 }} src={btnArrow} alt="arrow" />
              <p>Click para carregar</p>
              <div {...getRootProps()} className="add-image-button">
                <input {...getInputProps()} />
                <p>+</p>
              </div>
            </div>
            <div>
              <p className="p_color">ou</p>
              <p className="p_color">Arraste e solte um arquivo aqui</p>
            </div>
          </>
        )}
        {images.length > 0 && (
          <div className="image-scroll">
            <div
              className="image-container"
              style={{ transform: `translateX(-${currentSlide * 120}px)` }}
            >
              <div className="add-image-card">
                <img src={img} alt="mais" />
                <p className="p_size">Adicionar novas imagens</p>
                <div {...getRootProps()} className="add-image-button">
                  <input {...getInputProps()} />
                  <p>+</p>
                </div>
              </div>
              {images.map((imageUrl, index) => (
                <div
                  key={index}
                  className="carousel-slide"
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img
                    src={imageUrl}
                    alt={`slide-${index}`}
                    className="carousel-image"
                  />
                  {hoveredIndex === index && (
                    <button
                      onClick={() => removeImage(index)}
                      className="remove-button"
                    >
                      &#10006;
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
      {images.length > 0 && (
        <div className="scroll-buttons">
          <div className="scroll-button left" onClick={scrollLeft}>
            &#9664;
          </div>
          <div className="scroll-button right" onClick={scrollRight}>
            &#9654;
          </div>
        </div>
      )}
    </div>
  );
};

export default CarouselUploader;
