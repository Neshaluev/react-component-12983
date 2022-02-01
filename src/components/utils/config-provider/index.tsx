//@ts-nocheck
import React from "react";
import { ConfigContext, ConfigConsumer } from "./context";
import { SizeContextProvider } from "./SizeContext";
import { LocaleProvider } from "../loacale-config";

const config = {
  locale: "en",
  size: "middle",
};

export const ProviderChildren = (props: any) => {
  const { children, locale, componentSize, parentContext } = props;
  let childNode = children;

  const memoedConfig = React.useMemo(
    () => config,
    (prevConfig, currentConfig) => {
      const prevKeys = Object.keys(prevConfig);
      const currentKeys = Object.keys(currentConfig);

      return (
        prevKeys.length !== currentKeys ||
        prevKeys.some((key) => prevConfig[key] !== currentConfig[key])
      );
    }
  );

  if (locale) {
    childNode = <LocaleProvider locale={locale}>{childNode}</LocaleProvider>;
  }
  if (componentSize) {
    childNode = (
      <SizeContextProvider size={componentSize}>
        {childNode}
      </SizeContextProvider>
    );
  }
  return (
    <ConfigContext.Provider value={memoedConfig}>
      {childNode}
    </ConfigContext.Provider>
  );
};

export const ConfigProvider = (props: any) => {
  return (
    <ConfigConsumer>
      {(context) => <ProviderChildren parentContext={context} {...props} />}
    </ConfigConsumer>
  );
};
