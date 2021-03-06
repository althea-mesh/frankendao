import React, { useContext, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
} from 'reactstrap'
import styled from 'styled-components'
import { Context } from '../althea'
import search from '../search.png'

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
  const [t] = useTranslation()
  const [open, setOpen] = useState(false)
  const { displaySidebar, setSearch } = useContext(Context)

  const toggleOpen = () => setOpen(!open)
  const displayFeeSidebar = () => displaySidebar('subscriptionFee')
  const displayReportSidebar = () => displaySidebar('generateReport')

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
        <Dropdown isOpen={open} toggle={toggleOpen}>
          <StyledDropdownToggle caret={true}>Actions</StyledDropdownToggle>
          <StyledDropdownMenu right={true}>
            <DropdownItem onClick={displayFeeSidebar}>
              {t('updateSubscriptionFee')}
            </DropdownItem>
            <DropdownItem>Collect Bills</DropdownItem>
            <DropdownItem onClick={displayReportSidebar}>
              Generate Report
            </DropdownItem>
          </StyledDropdownMenu>
        </Dropdown>
      </div>
    </div>
  )
}

export default NodeListControls
