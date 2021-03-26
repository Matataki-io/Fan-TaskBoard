import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Drawer, Button } from 'antd'

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

  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

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
    <>
      <StyledHeaderMore type="primary" onClick={showDrawer}>
        More
      </StyledHeaderMore>
      <Drawer
        title="个人主页"
        placement="right"
        closable={false}
        onClose={onClose}
        visible={visible}
      >
        {!user.username ? (
          <StyledSignOut onClick={jumpToMttkOAuth}>一键登陆</StyledSignOut>
        ) : (
          <>
            <StyledItem>
              <div className="avatar">
                <img src={ `${process.env.REACT_APP_MTTK_IMG_CDN}/${user.avatar}` } alt="avatar"/>
              </div>
              <span className="username">{ user.username }</span>
            </StyledItem>
            <StyledItem onClick={() => history.push('/rewards')}>
              待发放奖励
              </StyledItem>
              <StyledItem onClick={() => history.push('/tasks')}>
              管理任务
              </StyledItem>
              <StyledItem onClick={() => history.push('/publish')}>
              创建任务
            </StyledItem>
            <StyledItem onClick={logout}>
              Sign Out
            </StyledItem>
          </>
        )}
      </Drawer>
    </>
  )
}

const StyledHeaderMore = styled(Button)`
  display: none;
  @media screen and (max-width: 768px) {
    display: initial;
  }
`

const StyledSignOut = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #333;
  cursor: pointer;
`
const StyledItem = styled.div`
  display: flex;
  align-items: center;
  color: #333;
  margin: 10px 0;
  cursor: pointer;
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
    margin-left: 4px;
  }
`


export default AccountButton
