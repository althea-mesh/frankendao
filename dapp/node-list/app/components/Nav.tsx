import { Button } from '@aragon/ui'
import React, { FunctionComponent, ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

const NavButton = styled(Button)`
  border-left: none;
  border-right: none;
  border-radius: 0;
  border-bottom: ${props => (props.active ? '5px solid #37CFCB' : 'none')};
`

type Props = {
  page: ReactNode
  pages: string[]
  setPage: (s: string) => void
}

const Nav: FunctionComponent<Props> = ({ page, pages, setPage }) => {
  const [t] = useTranslation()
  const selectPage = (e: React.FormEvent<HTMLInputElement>) =>
    setPage(e.currentTarget.dataset.page as string)

  return (
    <>
      {pages.map(p => (
        <NavButton
          key={p}
          onClick={selectPage}
          active={page === p}
          data-page={p}
        >
          {t(p)}
        </NavButton>
      ))}
    </>
  )
}

export default Nav
