import React from 'react';
import PropTypes from 'prop-types';
import { Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import { translate } from 'react-i18next';
import styled from 'styled-components';
import search from '../search.png';
import { Contract } from '../Contract';

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const SearchField = styled.input.attrs({
  className: 'form-control',
  type: 'text',
  placeholder: 'Search nodes'
})`
  border-right: none;
  &::placeholder {
    color: #ccc;
  } 
`;

const StyledDropdownToggle = styled(DropdownToggle)`
  background: #DAEAEF !important;
  color: #6D777B !important;
  padding-left: 25px !important;
  margin-bottom: -10px !important;
  border: none !important;
`;

const StyledDropdownMenu = styled(DropdownMenu)`
  box-shadow: 2px 4px 15px #ccc;
  border: none !important;
  margin-top: 0px !important;
`;

class NodeListControls extends React.Component {
  state = {
    actionsOpen: false
  }

  toggleActions = () => {
    this.setState({ actionsOpen: !this.state.actionsOpen });
  }

  render () {
    return (
      <Contract.Consumer>{state =>
        <div className="d-flex justify-content-between">
          <div className="input-group mb-3" style={{ width: 220 }}>
            <SearchField onChange={state.setSearch} />
            <div className="input-group-append">
              <span className="input-group-text bg-white">
                <SearchIcon src={search} />
              </span>
            </div>
          </div>
          <div>
            <Dropdown isOpen={this.state.actionsOpen} toggle={this.toggleActions}>
              <StyledDropdownToggle caret>
              Actions
              </StyledDropdownToggle>
              <StyledDropdownMenu right>
                <DropdownItem onClick={() => { state.displaySidebar('subscriptionFee'); }}>Update Subscription Fee</DropdownItem>
                <DropdownItem>Collect Bills</DropdownItem>
                <DropdownItem onClick={() => { state.displaySidebar('generateReport'); }}>Generate Report</DropdownItem>
              </StyledDropdownMenu>
            </Dropdown>
          </div>
        </div>
      }</Contract.Consumer>
    );
  }
}

NodeListControls.propTypes = {
  t: PropTypes.func
};

export default translate()(NodeListControls);
