import React from "react";
import cn from "classnames";

import Preview from "./Preview";

import "./image.style.scss";

type ImageStatus = "normal" | "error" | "loading";

export interface ImageProps {
  src?: string;
  placeholder?: React.ReactNode;
  width?: number;
  height?: number;
  fallback?: string;
  preview?: boolean;
  alt?: string;
}

const Image = (props: ImageProps) => {
  const {
    placeholder,
    width,
    height,
    src: imgSrc,
    fallback,
    preview = true,
    alt,
  } = props;

  const isCustomPlaceholder = placeholder && placeholder !== true;

  const [status, setStatus] = React.useState<ImageStatus>(
    isCustomPlaceholder ? "loading" : "normal"
  );

  const [isShowPreview, setShowPreview] = React.useState(false);

  const isError = status === "error";
  const isLoading = status === "loading";
  const canPreview = preview && !isError;
  const mergedSrc = isError && fallback ? fallback : imgSrc;

  const onLoad = () => {
    setStatus("normal");
  };

  const onError = () => {
    setStatus("error");
  };

  const onPreview = () => {
    console.log("Show preview");
    setShowPreview(!isShowPreview);
  };

  const onPreviewClose = () => {
    setShowPreview(false);
  };

  React.useEffect(() => {
    if (isError) {
    }
  }, [imgSrc, isShowPreview]);

  const prefixCls = "wrapper-image";

  const wrapperImage = cn(prefixCls);

  return (
    <>
      <div
        className={wrapperImage}
        style={{
          width,
          height,
        }}
      >
        <img
          onClick={onPreview}
          className={"test-img"}
          {...(isError && fallback
            ? { src: fallback }
            : { onLoad, onError, src: imgSrc })}
        />
        {isLoading && (
          <div aria-hidden="true" className={`${prefixCls}-placeholder`}>
            {placeholder}
          </div>
        )}
      </div>
      {canPreview && (
        <Preview
          visible={isShowPreview}
          onClose={onPreviewClose}
          src={mergedSrc}
          alt={alt}
        />
      )}
    </>
  );
};

export default Image;
