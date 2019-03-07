import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Button } from "@aragon/ui";
import styled from "styled-components";

import NodeList from "./NodeList";
import Settings from "./Settings";

const NavButton = styled(Button)`
  border-left: none;
  border-right: none;
  border-radius: 0;
  border-bottom: ${props => (props.active ? "5px solid #37CFCB" : "none")};
`;

const pages = {
  nodeList: NodeList,
  settings: Settings
};

const Nav = ({ setPage }) => {
  let [t] = useTranslation();

  let [name, setName] = useState("nodeList");

  let changePage = p => {
    setName(p);
    setPage(pages[p]);
  };

  return (
    <div>
      {Object.keys(pages).map(p => {
        return (
          <NavButton key={p} onClick={() => changePage(p)} active={name === p}>
            {t(p)}
          </NavButton>
        );
      })}
    </div>
  );
};

Nav.propTypes = {
  setPage: PropTypes.func
};

export default Nav;
