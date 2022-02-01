import React from "react";

export default function Search(props: any) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="-2.5 -2.5 24 24"
      width={props.size === "large" ? 35 : props.size === "small" ? 16 : 24}
      height={props.size === "large" ? 35 : props.size === "small" ? 16 : 24}
      preserveAspectRatio="xMinYMin"
      {...props}
      fill={props.type !== "default" ? "#fff" : "#000"}
    >
      <path d="M8 14A6 6 0 1 0 8 2a6 6 0 0 0 0 12zm6.32-1.094l3.58 3.58a1 1 0 1 1-1.415 1.413l-3.58-3.58a8 8 0 1 1 1.414-1.414z" />
    </svg>
  );
}
