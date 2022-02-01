import React from "react";

const FormItemError = (props: any) => {
  const { debounceErrors } = props;
  console.log("Props FormItemError", props);
  return (
    <>
      <ul>
        {debounceErrors?.map((item: any) => (
          <li>{item}</li>
        ))}
      </ul>
    </>
  );
};

export default FormItemError;
