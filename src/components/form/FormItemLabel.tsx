import React from "react";

export const FormItemLabel = (props: any) => {
  const { label = "" } = props;

  return <label>{label}</label>;
};
