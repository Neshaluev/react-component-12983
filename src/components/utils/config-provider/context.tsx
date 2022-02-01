import React from "react";
//@ts-nocheck
export const ConfigContext = React.createContext<any>({
  prefixCls: "main-prefix",
  locale: "en",
});

export const ConfigConsumer = ConfigContext.Consumer;

export const ConfigContextProvider = (props: any) => {
  return (
    <ConfigContext.Consumer>
      {(config) => {
        return (
          <ConfigContext.Provider value={config || null}>
            {props.children}
          </ConfigContext.Provider>
        );
      }}
    </ConfigContext.Consumer>
  );
};
