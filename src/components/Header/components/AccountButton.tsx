import React from 'react'
import styled from 'styled-components'
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { selectUser, setUser } from '../../../store/userSlice'
import { removeCookie } from '../../../utils/cookie'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  let history = useHistory();
  const user: any = useSelector(selectUser)
    const dispatch = useDispatch()


  const logout = () => {
    dispatch(setUser({}))
    removeCookie("x-access-token")
  }

  console.log('user', user)
  return (
    <StyledAccountButton>
      {!user.username ? (
        <StyledButton onClick={() => history.push("/login")}>Login</StyledButton>
      ) : (
        <StyledAccount>
          <div className="avatar">
            <img src={ `${process.env.REACT_APP_MTTK_IMG_CDN}/${user.avatar}` } alt="avatar"/>
          </div>
          <span className="username">{ user.username }</span>
          <span className="logout" onClick={logout}>Log out</span>
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
display: flex;
    align-items: center;
    color: #fff;
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
