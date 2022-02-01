import React from "react";
import { Dropdown } from ".";

export const DropdownSandox = () => {
  const options = [
    {
      key: "Jenny Hess",
      text: "Jenny Hess",
      value: "Jenny Hess",
      image: { avatar: true, src: "/images/avatar/small/jenny.jpg" },
    },
    {
      key: "Elliot Fu",
      text: "Elliot Fu",
      value: "Elliot Fu",
      image: { avatar: true, src: "/images/avatar/small/elliot.jpg" },
    },
    {
      key: "Stevie Feliciano",
      text: "Stevie Feliciano",
      value: "Stevie Feliciano",
      image: { avatar: true, src: "/images/avatar/small/stevie.jpg" },
    },
    {
      key: "Christian",
      text: "Christian",
      value: "Christian",
      image: { avatar: true, src: "/images/avatar/small/christian.jpg" },
    },
    {
      key: "Matt",
      text: "Matt",
      value: "Matt",
      image: { avatar: true, src: "/images/avatar/small/matt.jpg" },
    },
    {
      key: "Justen Kitsune",
      text: "Justen Kitsune",
      value: "Justen Kitsune",
      image: { avatar: true, src: "/images/avatar/small/justen.jpg" },
    },
  ];

  return (
    <>
      <h3>Drop down</h3>
      <div className="block">
        <Dropdown
          placeholder={"Placeholder Select Filed"}
          options={options}
          selection
        />
      </div>
      <div className="block">
        <Dropdown
          placeholder={"Search Filed"}
          options={options}
          selection
          search
        />
      </div>
      <div className="block" style={{ width: "400px" }}>
        <Dropdown
          placeholder={"Multiple Search  Filed"}
          options={options}
          selection
          multiple
          search
        />
      </div>
    </>
  );
};
