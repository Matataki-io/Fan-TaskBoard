import React from 'react';
import styled from 'styled-components'
import { Button } from 'antd'


const Login = () => {

  const jumpToMttkOAuth = () => {
    (window as any).location = process.env.REACT_APP_OAuthUrl;
  };

  return (
    <StyledContent>
      <Button type="primary" onClick={jumpToMttkOAuth}>One-Click Login / 一键登录</Button>
    </StyledContent>
  )
}

const StyledContent = styled.div`
  width: 240px;
  height: 300px;
  margin: 60px auto;
  text-align: center;
`

export default Login