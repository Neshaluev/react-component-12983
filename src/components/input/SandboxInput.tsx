import React from "react";

import Input from "./input";
import { CloseCircle, Search } from "../icons";
import { ConfigProvider } from "../utils/config-provider";

export const SandBoxInput = () => {
  const inputRef = React.useRef(null);
  const [componentSize, setComponentSize] = React.useState("small");
  const [locale, setLocale] = React.useState("en");

  const defaultProps = {
    defaultValue: "test Value",
    ref: inputRef,
  };

  return (
    <>
      <div className="block">
        <ConfigProvider locale={locale} componentSize={componentSize}>
          <Input {...defaultProps} ref={inputRef} placeholder="Basic usage" />
        </ConfigProvider>
      </div>

      <div className="block">
        <Input suffix=".com" defaultValue="mysite" />
      </div>
      <div className="block">
        <Input suffix=".com" defaultValue="mysite" allowClear />
      </div>

      <div className="block">
        <Input size="small" placeholder="prefix icon" prefix={<Search />} />
      </div>
      <div className="block">
        <Input
          size="small"
          placeholder="prefix icon"
          prefix={<Search />}
          allowClear
        />
      </div>

      <div className="block">
        <CloseCircle />
      </div>
    </>
  );
};
