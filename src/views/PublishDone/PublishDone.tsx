import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { Button, message, Input } from 'antd'
import { useSelector, useDispatch } from "react-redux";
import {CopyToClipboard} from 'react-copy-to-clipboard';

import publishDone from '../../assets/img/publish-done.png';
import publish1 from '../../assets/img/publish-1.png';
import publish2 from '../../assets/img/publish-2.png';
import publish3 from '../../assets/img/publish-3.png';
import Page from '../../components/Page'

import { selectUser } from '../../store/userSlice';

const Publish: React.FC = () => {
  const history = useHistory();
  const user: any = useSelector(selectUser)

  return (
    <Page>
      <StyledContent>
        <img src={publishDone} alt="logo" className="title-img" />
        <StyledTitle>创建成功！</StyledTitle>
        <StyledSubtitle>分享链接给你的社区，即可开始获取</StyledSubtitle>

        <StyledInputContent>
          <Input type="text" value={ window.location.search.slice(1) } />
          <CopyToClipboard
            text={`立即领取奖励：${window.location.search.slice(1)}`}
            onCopy={() => message.info('复制成功，立即分享！')}>
              <Button className="input-btn" type="primary">复制</Button>
          </CopyToClipboard>
          <Button className="input-btn" type="primary" onClick={ () => window.open(window.location.search.slice(1)) }>打开</Button>
        </StyledInputContent>
        <StyledButtonAntd onClick={ () => history.push('/publish') } className="create">再创建一个</StyledButtonAntd>
        <StyledButtonAntd onClick={ () => history.push('/') } className="back">返回任务大厅</StyledButtonAntd>

        <StyledTips>
          你需要查看自己已经创建的任务吗？
          <Link to="/">点击这里</Link>
        </StyledTips>
      </StyledContent>
    </Page>
  )
}

const StyledButtonAntd = styled(Button)`
  border-radius: 4px;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 1;
  cursor: pointer;
  height: 40px;
  width: 240px;
  margin: 0 auto;
  box-sizing: border-box;
  &.create {
    background: #6236FF;
    display: block;
    margin-top: 48px;
  }
  &.back {
    background: transparent;
    border: 1px solid #FFFFFF;
    display: block;
    margin-top: 24px;
  }
`

const StyledContent = styled.div`
  width: 100%;
  margin: 0 auto 100px;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;

  @keyframes swing {
      20% {
          transform: rotate3d(0, 0, 1, 15deg);
      }

      40% {
          transform: rotate3d(0, 0, 1, -10deg);
      }

      60% {
          transform: rotate3d(0, 0, 1, 5deg);
      }

      80% {
          transform: rotate3d(0, 0, 1, -5deg);
      }

      to {
          transform: rotate3d(0, 0, 1, 0deg);
      }
  }

  .title-img {
    height: 294px;
    margin: 100px auto 0;
    display: block;
    animation: swing 1000ms infinite both
  }
`
const StyledTitle = styled.p`
  padding: 0;
  margin: 24px 0 0;
  line-height: 1;
  font-size: 24px;
  font-weight: 500;
  color: #FFFFFF;
  text-align: center;
`
const StyledSubtitle = styled.p`
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  color: #B2B2B2;
  padding: 0;
  margin: 40px 0 0;
  text-align: center;
`
const StyledInputContent = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 480px;
    margin: 24px auto 0;
    .input-btn {
      margin-left: 8px;
    }
`
const StyledTips = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #B2B2B2;
  line-height: 1;
  padding: 0;
  margin: 50px 0;
  text-align: center;
  a {
    font-weight: 500;
    color: #6236FF;
  }
`

export default Publish
