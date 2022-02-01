import React from "react";
import LocaleContext from "./context";

export interface Locale {
  locale: string;
  okText: string;
  cancelText: string;
  searchPlaceholder: string;
}

export interface LocaleProviderProps {
  locale: Locale;
  children?: React.ReactNode;
}

export const LocaleProvider = (props: LocaleProviderProps) => {
  // console.log("Props LocaleProvider", props);
  return (
    <LocaleContext.Provider value={{ ...props.locale, exist: true }}>
      {props.children}
    </LocaleContext.Provider>
  );
};

export default LocaleProvider;
