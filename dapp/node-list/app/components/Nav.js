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

  let [pagename, setPagename] = useState("nodeList");

  let changePage = p => {
    setPagename(p);
    setPage(pages[p]);
  };

  return (
    <div>
      {Object.keys(pages).map(p => {
        return (
          <NavButton
            key={p}
            onClick={() => {
              changePage(p);
            }}
            active={pagename === p}
          >
            {t(p)}
          </NavButton>
        );
      })}
    </div>
  );
};

Nav.propTypes = {
  i18n: PropTypes.object,
  setPage: PropTypes.func,
  mode: PropTypes.string,
  t: PropTypes.func
};

export default Nav;
