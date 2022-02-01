import React from "react";
import { Locale } from ".";

const LocaleContext = React.createContext<
  (Partial<Locale> & { exist: true }) | undefined
>(undefined);

export default LocaleContext;
