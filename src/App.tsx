import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { SandboxButton } from "./components/button/SandboxButton";
import { SandBoxInput } from "./components/input/SandboxInput";
import { SandboxPopup } from "./components/popup/SandboxPopup";
import { DropdownSandox } from "./components/dropdown/DropdownSandox";
import { SandboxImage } from "./components/image/SandboxImage";
import { SandboxForm } from "./components/form/SandboxForm";

const navlist = [
  { name: "Button", component: SandboxButton, href: "/button" },
  { name: "Dropdown", component: DropdownSandox, href: "/dropdown" },
  { name: "Input", component: SandBoxInput, href: "/input" },
  { name: "Popup", component: SandboxPopup, href: "/popup" },
  { name: "Image", component: SandboxImage, href: "/image" },
  { name: "Form", component: SandboxForm, href: "/form" },
];

const Navigation = () => {
  return (
    <ul className="navigation">
      {navlist.map((nav) => (
        <li>
          <Link to={nav.href}>{nav.name}</Link>
        </li>
      ))}
    </ul>
  );
};

function App() {
  return (
    <Router>
      <div className="App">
        <h1>React Components</h1>
        <Navigation />
        <Switch>
          {navlist.map((nav, i) => (
            <Route key={i} path={nav.href} component={nav.component} exact />
          ))}
        </Switch>

        {/* <SandboxForm /> */}
      </div>
    </Router>
  );
}

export default App;
