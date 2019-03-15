import { Button } from '@aragon/ui'
import React, { FunctionComponent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const NavButton = styled(Button)`
  border-left: none;
  border-right: none;
  border-radius: 0;
  border-bottom: ${(props) => (props.active ? '5px solid #37CFCB' : 'none')};
`

type Props = {
  page: ReactNode
  pages: string[]
  setPage: Dispatch<SetStateAction<string>>,
}

const Nav: FunctionComponent<Props> = ({ page, pages, setPage }) => {
  const [t] = useTranslation()

  return (
    <div>
      {pages.map((p) => (
        <NavButton key={p} onClick={() => setPage(p)} active={page === p}>
          {t(p)}
        </NavButton>
      ))}
    </div>
  )
}

export default Nav
