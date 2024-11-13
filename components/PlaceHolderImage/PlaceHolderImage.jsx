import { useState } from "react";
import { Image, StyleSheet } from "react-native";

const PlaceholderImage = ({ src, alt }) => {
  const [imgSrc, setImgSrc] = useState({ uri: src });

  const handleError = () => {
    setImgSrc({ uri: "https://placehold.co/400" });
  };

  return (
    <Image
      source={imgSrc}
      onError={handleError}
      accessibilityLabel={alt}
    />
  );
};

export default PlaceholderImage;