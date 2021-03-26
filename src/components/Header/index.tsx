import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { Button, Drawer } from 'antd'
import { useSelector } from "react-redux";

import logo from "../../assets/img/logo.png";
import logoText from "../../assets/img/logo-text.png";
import AccountButton from './components/AccountButton'
import AccountDrawer from './components/AccountDrawer'
import { selectUser } from '../../store/userSlice'


const Header: React.FC = () => {
  // const { account }: { account: string } = useWallet()
  const history = useHistory();
  const user: any = useSelector(selectUser)

  return (
    <StyledHeader>
      <StyledHeaderContainer>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <StyledHeaderLogoLink to="/">
            <img className="logo" src={logo} alt="logo" aria-label="logo" />
            <img className="logo-text" src={logoText} alt="logo" aria-label="logo" />
          </StyledHeaderLogoLink>

          <StyledHeaderNav>
            <Link to="/rewards">待发放奖励</Link>
            {
              user.id ? (<>&nbsp;<Link to="/tasks">管理任务</Link></>) : null
            }
          </StyledHeaderNav>
        </div>

        <StyledHeaderUser>
          <StyledCreateButton type="primary" onClick={() => history.push('/publish')}>创建任务</StyledCreateButton>
          <AccountButton />
        </StyledHeaderUser>
        <AccountDrawer></AccountDrawer>
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

const StyledHeaderNav = styled.nav`
  margin-left: 10px;
  a {
    color: #fff;
    font-size: 14px;
    &:hover {
      text-decoration: underline;
    }
  }
  @media screen and (max-width: 768px) {
    display: none;
  }
`

const StyledHeaderUser = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 768px) {
    display: none;
  }
`

const StyledCreateText = styled.p`
  font-size: 14px;
  margin: -10px 0 10px;
  padding: 0;
  color: rgb(170, 170, 170);
  line-height: 1.5;
`

const StyledCreateButton = styled(Button)`
  outline: none;
  font-size: 16px;
  font-weight: 500;
  color: #6236FF;
  line-height: 22px;
  padding: 0 28px;
  text-transform: uppercase;
  box-sizing: border-box;
  height: 40px;
  border-radius: 4px;
  cursor: pointer;
  white-space: nowrap;
  margin-right: 24px;
  background: #fff;
  border: none;
  outline: none;
  @media screen and (max-width: 576px) {
    padding: 0 10px;
    min-width: auto;
  }
`


export default Header