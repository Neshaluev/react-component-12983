import React from "react";

export interface ToolProps {
  name?: string;
  onClick?: (...args: any) => void;
  Component?: any;
}

export interface ToolsProps {
  tools?: ToolProps[];
  prefixCls?: string;
}

const Tools = (props: ToolsProps) => {
  const { tools } = props;
  return (
    <ul className="preview-tools">
      {tools &&
        tools.map(({ name, onClick, Component }) => (
          <li className="preview-tools-item" key={name}>
            <span className="preview-tools-icon" onClick={onClick}>
              <Component />
            </span>
          </li>
        ))}
    </ul>
  );
};

export default Tools;
