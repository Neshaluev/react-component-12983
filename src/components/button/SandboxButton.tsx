import React from "react";
import { Button } from "./button";
import { Search } from "../icons";
import { Preloader } from "../Preloader";

export const SandboxButton = () => {
  const [loaidng, setloaidng] = React.useState(true);
  const elemRef = React.useRef();

  React.useEffect(() => {
    setTimeout(() => setloaidng(!loaidng), 3000);
  }, []);

  return (
    <>
      <div className="block">
        <Button icon={<Search />} loading={loaidng}>
          Button
        </Button>
      </div>
      <div className="block">
        <Button type="danger" size="small" icon={<Search />} loading={loaidng}>
          Button
        </Button>
      </div>
      <div className="block">
        <Button type="danger" size="large" icon={<Search />} loading={loaidng}>
          Button
        </Button>
      </div>
      <div className="block">
        <Button type="primary" size="small" icon={<Search />} loading={loaidng}>
          Button
        </Button>
      </div>
      <div className="block">
        <Button link size="small" icon={<Search />} loading={loaidng}>
          Button
        </Button>
      </div>
      <Preloader />
    </>
  );
};
