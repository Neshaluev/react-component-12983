import React from "react";
import { Popup } from "./popup";

export const SandboxPopup = () => {
  const triggerElement = <button className="trigger-element">Click Me</button>;
  const triggerElement2 = (
    <p className="trigger-element">
      Lorem ipsum dolor sit amet consectetur adipisicing elit. Molestias
      delectus incidunt magnam facere quo soluta fugiat suscipit quia porro ab,
    </p>
  );
  const contentElement = (
    <div className="popup-content">
      <div>Element</div>
      <div>Element</div>
      <div>Element</div>
    </div>
  );
  const contentElement2 = (
    <div className="popup-content">
      <p>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta dolores
        ratione voluptate atque in ea aspernatur ex magnam facere distinctio,
        consequatur fugit totam dignissimos id, quas maiores animi voluptatem
        vero aut? Reprehenderit dolorum magnam ipsam reiciendis velit provident
        deserunt sint accusantium quasi praesentium aliquid quod molestiae minus
        veritatis ex, ipsum vitae neque totam? Laboriosam, illo eligendi
        mollitia, hic temporibus sed quibusdam ex provident sequi cum atque odio
        doloribus voluptatibus tenetur? Velit officiis rem eius dolor,
        exercitationem nemo, placeat quam optio aut quos veritatis illum sunt
        nostrum? Iure voluptas quibusdam repellendus beatae exercitationem ut
        fuga velit, alias animi expedita? Error commodi tenetur fuga blanditiis
        voluptatum, aperiam amet odit quia possimus fugit! Aliquid dolorem
        minima similique a magni inventore corrupti repellendus consectetur
        mollitia
      </p>
    </div>
  );
  return (
    <>
      <div
        style={{
          backgroundColor: "#03c2fc",
        }}
      >
        <div className="block">
          <Popup
            trigger={triggerElement}
            content={contentElement}
            on={"click"}
          />
        </div>
        <div className="block">
          <Popup
            trigger={triggerElement}
            content={contentElement}
            on={"hover"}
            placement="left"
          />
        </div>
        <div className="block">
          <Popup
            trigger={triggerElement}
            content={contentElement}
            on={"focus"}
            placement="bottom"
          />
        </div>
        <div className="block">
          <Popup
            trigger={triggerElement2}
            content={contentElement2}
            on={"click"}
          />
        </div>
      </div>
    </>
  );
};
