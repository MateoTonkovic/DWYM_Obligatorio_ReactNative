// src/components/PlaceholderImage.jsx
import React, { useState } from 'react';
import { Image } from 'react-native';

const PlaceholderImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState(src);

  const handleError = () => {
    setImgSrc('https://placehold.co/400');
  };

  return (
    <Image
      source={{ uri: imgSrc }}
      alt={alt}
      onError={handleError}
      style={{ width: '100%', height: '100%' }}
    />
  );
};

export default PlaceholderImage;
