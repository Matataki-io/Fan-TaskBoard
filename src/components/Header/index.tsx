import React, { useContext } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useWallet } from 'use-wallet'
import { useMount } from "ahooks";
import { useSelector, useDispatch } from "react-redux";
import { initUser } from '../../store/userSlice'

import logo from "../../assets/img/logo.png";
import logoText from "../../assets/img/logo-text.png";
import AccountButton from './components/AccountButton'

const Header: React.FC = () => {
  // const { account }: { account: string } = useWallet()

  const dispatch = useDispatch()

  useMount(() => {
    dispatch(initUser())
  })

  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <StyledHeaderLogoLink to="/">
          <img className="logo" src={logo} alt="logo" aria-label="logo" />
          <img className="logo-text" src={logoText} alt="logo" aria-label="logo" />
        </StyledHeaderLogoLink>
        <StyledHeaderUser>
          <AccountButton />
        </StyledHeaderUser>
      </StyledHeaderContainer>
    </StyledHeader>
  )
}

const StyledHeader = styled.header`
  width: 100%;
  height: 60px;
  background: #6236FF;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9;
`

const StyledHeaderContainer = styled.div`
  height: 100%;
  margin: 0 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media screen and (max-width: 576px) {
    margin-left: 10px;
    margin-right: 10px;
  }
`
const StyledHeaderLogoLink = styled(Link)`
  display: flex;
  align-items: center;
  .logo {
    height: 30px;
  }
  .logo-text {
    height: 16px;
    margin-left: 10px;
    @media screen and (max-width: 576px) {
      height: 10px;
      margin-left: 2px;
    }
  }
`
const StyledHeaderUser = styled.div`
  display: flex;
  align-items: center;
`
const StyledCreateText = styled.p`
  font-size: 14px;
  margin: -10px 0 10px;
  padding: 0;
  color: rgb(170, 170, 170);
  line-height: 1.5;
`

const StyledCreateButton = styled.button`
  outline: none;
  border-radius: 8px;
  border: 2px solid #FFFFFF;
  background-color: transparent;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  padding: 0 28px;
  text-transform: uppercase;
  box-sizing: border-box;
  height: 40px;
  cursor: pointer;
  white-space: nowrap;
  @media screen and (max-width: 576px) {
    padding: 0 10px;
  }
`


export default Header