import { parseCaption } from '@/utils/captionUtils';
import DOMPurify from 'dompurify';
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
        className={`cover-image-wrapper ${showCaption ? '' : 'cover-image-mb'}`}
      >
        <img
          src={src || fallbackSrc}
          alt={cleanAlt}
          loading="lazy"
        />
      </div>

      {showCaption && (
        <div
          className="cover-image-caption"
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(cleanCaption) }}
        />
      )}
    </div>
  );
};

export default CoverImage;
