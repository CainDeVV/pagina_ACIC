import React from 'react';
import { parseCaption } from '../../utils/captionUtils';
import './CoverImage.css';

const CoverImage = ({
  src,
  fallbackSrc = 'https://placehold.co/1200x500?text=Capa',
  title,
  rawCaption
}) => {
  const { cleanAlt, showCaption, cleanCaption } = parseCaption(rawCaption, title);

  return (
    <div className="cover-image-container">
      <div
        className="cover-image-wrapper"
        style={{ marginBottom: showCaption ? '0' : '32px' }}
      >
        <img
          src={src || fallbackSrc}
          alt={cleanAlt}
        />
      </div>

      {showCaption && (
        <div
          className="cover-image-caption"
          dangerouslySetInnerHTML={{ __html: cleanCaption }}
        />
      )}
    </div>
  );
};

export default CoverImage;
