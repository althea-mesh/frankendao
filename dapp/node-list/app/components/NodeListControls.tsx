import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap'
import styled from 'styled-components'
import search from '../search.png'
import { Context } from '../althea'

const SearchIcon = styled.img`
  width: 20px;
  height: 20px;
`

const SearchField = styled.input.attrs({
  className: 'form-control',
  type: 'text',
  placeholder: 'Search nodes',
})`
  border-right: none;
  &::placeholder {
    color: #ccc;
  }
`

const StyledDropdownToggle = styled(DropdownToggle)`
  background: #daeaef !important;
  color: #6d777b !important;
  padding-left: 25px !important;
  margin-bottom: -10px !important;
  border: none !important;
`

const StyledDropdownMenu = styled(DropdownMenu)`
  box-shadow: 2px 4px 15px #ccc;
  border: none !important;
  margin-top: 0px !important;
`

const NodeListControls = () => {
  let [t] = useTranslation()
  let [open, setOpen] = useState(false)
  let { displaySidebar, setSearch } = useContext(Context)

  return (
    <div className="d-flex justify-content-between">
      <div className="input-group mb-3" style={{ width: 220 }}>
        <SearchField onChange={setSearch} />
        <div className="input-group-append">
          <span className="input-group-text bg-white">
            <SearchIcon src={search} />
          </span>
        </div>
      </div>
      <div>
        <Dropdown isOpen={open} toggle={() => setOpen(!open)}>
          <StyledDropdownToggle caret>Actions</StyledDropdownToggle>
          <StyledDropdownMenu right>
            <DropdownItem
              onClick={() => {
                displaySidebar('subscriptionFee')
              }}
            >
              {t('updateSubscriptionFee')}
            </DropdownItem>
            <DropdownItem>Collect Bills</DropdownItem>
            <DropdownItem
              onClick={() => {
                displaySidebar('generateReport')
              }}
            >
              Generate Report
            </DropdownItem>
          </StyledDropdownMenu>
        </Dropdown>
      </div>
    </div>
  )
}

export default NodeListControls
