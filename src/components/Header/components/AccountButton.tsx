import React from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectUser, setUser } from '../../../store/userSlice'
import { removeCookie } from '../../../utils/cookie'
import { setOAuthRedirectUri } from '../../../api/developer'
import { removeCookieService } from '../../../api/api'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  let history = useHistory();
  const user: any = useSelector(selectUser)
  const dispatch = useDispatch()
  let location = useLocation();

  const logout = () => {
    dispatch(setUser({}))
    removeCookieService()
  }

  const jumpToMttkOAuth = async () => {
    try {
      console.log('from', location)
      await setOAuthRedirectUri(location.pathname);
    } catch (error) {
      console.log('error', error)
    }
    (window as any).location = process.env.REACT_APP_OAuthUrl;
  };

  console.log('user', user)
  return (
    <StyledAccountButton>
      {!user.username ? (
        <StyledButton onClick={jumpToMttkOAuth}>一键登录</StyledButton>
      ) : (
        <StyledAccount>
          <a href={ `https://www.matataki.io/user/${user.id}` } target="_blank" rel="noopener noreferrer" className="user">
            <div className="avatar">
              <img src={ `${process.env.REACT_APP_MTTK_IMG_CDN}/${user.avatar}` } alt="avatar"/>
            </div>
            <span className="username">{ user.username }</span>
          </a>
          <span className="logout" onClick={logout}>Sign Out</span>
        </StyledAccount>
      )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

const StyledButton = styled.button`
  outline: none;
  border-radius: 8px;
  border: 2px solid #FFFFFF;
  background-color: transparent;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  padding: 0 28px;
  box-sizing: border-box;
  height: 40px;
  cursor: pointer;
  white-space: nowrap;
  @media screen and (max-width: 576px) {
    padding: 0 10px;
  }
`
const StyledAccount = styled.div`
  color: #fff;
  display: flex;
  align-items: center;
  .user {
    display: flex;
    align-items: center;
    color: #fff;
  }
  .avatar {
    width: 30px;
    height: 30px;
    border-radius: 100%;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .username {
    font-size: 14px;
    margin: 0 10px;
  }
  .logout {
    cursor: pointer;
    font-size: 14px;
  }
`


export default AccountButton
