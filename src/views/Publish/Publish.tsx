import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { Button, message } from 'antd'
import { useSelector, useDispatch } from "react-redux";

import publishTitle from '../../assets/img/publish-title.png';
import publish1 from '../../assets/img/publish-1.png';
import publish2 from '../../assets/img/publish-2.png';
import publish3 from '../../assets/img/publish-3.png';
import publishDecrypt from '../../assets/img/publish-decrypt.png';
import Page from '../../components/Page'

import { selectUser } from '../../store/userSlice';

const Publish: React.FC = () => {
  const history = useHistory();
  const user: any = useSelector(selectUser)

  const toPublish = (url: string) => {
    if (!user.id) {
      message.info('请先登陆')
      return
    }

    history.push(url)
  }

  return (
    <Page>
      <StyledContent>
        <img src={publishTitle} alt="logo" className="title-img" />
        <StyledSubtitle>只要1分钟即可发布属于你的有奖任务</StyledSubtitle>
        <StyledItem>
          <StyledItemBox>
            <img src={publish1} alt="cover"/>
            <p className="title">Twitter关注任务</p>
            <p className="description">此任务要求用户完成关注后即可领取奖励</p>
            <div className="btn">
              <StyledButtonAntd onClick={ () => toPublish('/publish/twitter') }>使用此模版</StyledButtonAntd>
            </div>
          </StyledItemBox>
          <StyledItemBox>
            <img src={publish1} alt="cover"/>
            <p className="title">Twitter转推任务</p>
            <p className="description">此任务要求用户完成转推后即可领取奖励</p>
            <div className="btn">
              <StyledButtonAntd onClick={ () => toPublish('/publish/twitterRetweet') }>使用此模版</StyledButtonAntd>
            </div>
          </StyledItemBox>
          <StyledItemBox>
            <img src={publish2} alt="cover"/>
            <p className="title">红包任务</p>
            <p className="description">知道红包链接的用户即可领取红包</p>
            <div className="btn">
              <StyledButtonAntd disabled={ true }>使用此模版</StyledButtonAntd>
            </div>
          </StyledItemBox>
          <StyledItemBox>
            <img src={publishDecrypt} alt="cover"/>
            <p className="title">解谜任务</p>
            <p className="description">用户根据你布下的线索去找寻密码，输入密码后即可打开宝箱获得奖励</p>
            <div className="btn">
              <StyledButtonAntd onClick={ () => toPublish('/publish/key') }>使用此模版</StyledButtonAntd>
            </div>
          </StyledItemBox>
          <StyledItemBox>
            <img src={publish3} alt="cover"/>
            <p className="title">自定义任务</p>
            <p className="description">发布你的有奖任务，由你亲自判断任务完成情况并发放奖励</p>
            <div className="btn">
              <StyledButtonAntd onClick={ () => toPublish('/publish/customtask') }>使用此模版</StyledButtonAntd>
            </div>
          </StyledItemBox>
        </StyledItem>
        <StyledTips>
          你需要查看自己已经创建的任务吗？
          <Link to="/">点击这里</Link>
        </StyledTips>
      </StyledContent>
    </Page>
  )
}

const StyledButtonAntd = styled(Button)`
  background: #6236FF;
  border-radius: 4px;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 1;
  cursor: pointer;
  height: 40px;
  width: calc(100% - 56px);
  margin: 0;
  box-sizing: border-box;
`

const StyledContent = styled.div`
  width: 100%;
  margin: 0 auto 100px;
  /* padding: 0 10px; */
  box-sizing: border-box;
  position: relative;
  .title-img {
    height: 60px;
    margin: 100px auto 0;
    display: block;
    @media screen and (max-width: 768px) {
      height: auto;
      width: 70%;
      margin-top: 60px;
    }
  }
`
const StyledSubtitle = styled.p`
  font-size: 18px;
  font-weight: 400;
  color: #B2B2B2;
  padding: 0;
  margin: 14px 0 40px;
  text-align: center;
  line-height: 1.2;
  @media screen and (max-width: 768px) {
    font-size: 14px;
    margin-top: 10px;
  }
`
const StyledItem = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-column-gap: 20px;
  grid-row-gap: 20px;
  width: 1400px;
  margin: 0 auto;
  @media screen and (max-width: 1400px) {
    width: 90%;
  }
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
const StyledItemBox = styled.div`
  @keyframes slideInUp {
    from {
        transform: translate3d(0, 20px, 0);
        visibility: visible;
    }

    to {
        transform: translate3d(0, 0, 0);
    }
  }
  animation: slideInUp 400ms both;
  &:nth-of-type(1) {
    animation-delay: 0.2s;
  }
  &:nth-of-type(2) {
    animation-delay: 0.24s;
  }
  &:nth-of-type(3) {
    animation-delay: 0.28s;
  }
  &:nth-of-type(4) {
    animation-delay: 0.32s;
  }
  width: 100%;
  background: #132D5E;
  border-radius: 8px;
  padding: 24px 24px 48px;
  box-sizing: border-box;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    width: 100%;
    max-width: 400px;
  }
  .title {
    font-size: 20px;
    font-weight: 500;
    color: #FFFFFF;
    padding: 0;
    margin: 36px 0 0 0;
  }
  .description {
    font-size: 13px;
    line-height: 1.4;
    font-weight: 400;
    color: #B2B2B2;
    padding: 0;
    margin: 8px 38px 20px;
  }
  .btn {
    flex: 1;
    width: 100%;
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
`
const StyledTips = styled.p`
  font-size: 14px;
  font-weight: 400;
  color: #B2B2B2;
  line-height: 20px;
  padding: 0;
  margin: 48px 0;
  text-align: center;
  a {
    font-weight: 500;
    color: #6236FF;
  }
`

export default Publish
