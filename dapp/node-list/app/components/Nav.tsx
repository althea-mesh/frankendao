import React from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@aragon/ui'
import styled from 'styled-components'

const NavButton = styled(Button)`
  border-left: none;
  border-right: none;
  border-radius: 0;
  border-bottom: ${props => (props.active ? '5px solid #37CFCB' : 'none')};
`

const Nav = ({ page, pages, setPage }) => {
  let [t] = useTranslation()

  return (
    <div>
      {pages.map(p => (
        <NavButton key={p} onClick={() => setPage(p)} active={page === p}>
          {t(p)}
        </NavButton>
      ))}
    </div>
  )
}

export default Nav
