import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useHistory } from 'react-router-dom'
import { Button, message, Avatar, Table, Tag, Space } from 'antd'
import { useSelector, useDispatch } from "react-redux";

import publish1 from '../../assets/img/publish-1.png';
import Page from '../../components/Page'

import { selectUser } from '../../store/userSlice';

const Publish: React.FC = () => {
  const history = useHistory();
  const user: any = useSelector(selectUser)

  const columns = [
    {
      title: '领取人',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <a>{text}</a>,
    },
    {
      title: '领取数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '领取时间',
      dataIndex: 'date',
      key: 'date',
    },
  ];
  const data = [
    {
      key: '1',
      name: 'John Brown',
      amount: 32,
      date: '2020-12-17 12:00:00',
    },
    {
      key: '2',
      name: 'Jim Green',
      amount: 42,
      date: '2020-12-17 12:00:00',
    },
    {
      key: '3',
      name: 'Joe Black',
      amount: 32,
      date: '2020-12-17 12:00:00',
    },
  ];

  return (
    <Page>
      <StyledContent>
        <StyledBackHead>
          <StyledLinkBack to="/"> {'<'} 返回任务大厅</StyledLinkBack>
        </StyledBackHead>
        <StyledInfo>
          <StyledInfoBox>
            <StyledInfoCover src={publish1} alt="cover" />
          </StyledInfoBox>
          <StyledInfoBox>
            <StyledInfoHead>
              <span className="title">Twitter关注任务</span>
              <span className="status">进行中</span>
              <span className="icon">share</span>
            </StyledInfoHead>
            <StyledInfoHead>
              <span className="item-title">任务创建者 </span>
              <Avatar></Avatar>
              <a className="account">HideoKojima</a>
            </StyledInfoHead>
            <StyledInfoHead>
              <span className="item-title">创建时间</span>
              <span className="time">2020年12月16日 13:55</span>
            </StyledInfoHead>
            <StyledBox className="info">
              <StyledBoxHead>
                <span className="icon">icon</span>
                <span className="box-title">任务详情</span>
              </StyledBoxHead>
              <StyledBoxContent className="receive-content">
                <StyledBCInfo>
                  <StyledBCInfoCenter>
                    <div className="info-content">
                      <p className="info-title">你可得到</p>
                      <p className="info-amount">100<sub>KML</sub></p>
                    </div>
                    <div className="info-content">
                      <p className="info-title">总奖励数量</p>
                      <p className="info-amount">10<sub>/10</sub></p>
                    </div>
                  </StyledBCInfoCenter>
                  <StyledButtonAntd className="receive">领取奖励</StyledButtonAntd>
                </StyledBCInfo>
                <StyledLine></StyledLine>
                <StyledBCInfo>
                  <span className="info-title">去关注</span>
                  <div className="twitter-info">
                    <Avatar></Avatar>
                    <span className="twitter-account">召喚少女レム</span>
                  </div>
                  <StyledButtonAntd className="follow">前往推特去关注</StyledButtonAntd>
                </StyledBCInfo>
              </StyledBoxContent>
            </StyledBox>
          </StyledInfoBox>
        </StyledInfo>
        <StyledBox className="list">
          <StyledBoxHead>
            <span className="icon">icon</span>
            <span className="box-title">奖励详情</span>
          </StyledBoxHead>
          <StyledBoxContent>
            <Table columns={columns} dataSource={data} />
          </StyledBoxContent>
        </StyledBox>
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
  width: 100%;
  margin: 0;
  box-sizing: border-box;
  &.receive {
    background: #6236FF;
    margin-top: 16px;
  }
  &.follow {
    background: transparent;
    border: 1px solid #FFFFFF;
    margin-top: 10px;
  }
`

const StyledContent = styled.div`
  max-width: 1100px;
  margin: 0 auto 100px;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  .title-img {
    height: 60px;
    margin: 100px auto 0;
    display: block;
  }
`
const StyledBackHead = styled.div`
  margin: 48px 0 24px;
`
const StyledLinkBack = styled(Link)`
  font-size: 16px;
  font-weight: 500;
  color: #6236FF;
  line-height: 22px;
  padding: 0;
  margin: 0;
`
const StyledInfo = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
`
const StyledInfoBox = styled.div`
  width: calc(50% - 12px);
`

const StyledInfoCover = styled.img`
      width: 100%;
`

const StyledInfoHead = styled.div`
display: flex;
align-items: center;
margin: 8px 0 0 0;
.title {
font-size: 36px;
font-weight: 600;
color: #FFFFFF;
line-height: 50px;
}
.status {
  display: inline-block;
    height: 30px;
    background: #E3FCF6;
    border-radius: 4px;
    font-size: 14px;
    font-weight: 500;
    color: #2EAFB4;
    line-height: 30px;
    padding: 0 10px;
    margin: 0 0 0 16px;
}
.icon {
  margin-left: auto;
  color: #FFFFFF;
}

.item-title {
font-size: 16px;
font-weight: 400;
color: #B2B2B2;
line-height: 22px;
margin-right: 8px;
}
.account {
  width: 97px;
height: 22px;
font-size: 16px;
font-weight: 500;
color: #6236FF;
line-height: 22px;
margin-left: 8px;
}
.time {
font-size: 16px;
font-weight: 400;
color: #FFFFFF;
line-height: 22px;
}
`

const StyledBox = styled.div`
  border-radius: 8px;
  overflow: hidden;
  &.info {
    margin-top: 16px;
  }
  &.list {
    margin-top: 48px;
  }
`
const StyledBoxHead = styled.div`
  padding: 15px;
background: #132D5E;
box-sizing: border-box;
  .icon {
    color: #FFFFFF;
  }
  .box-title {
font-size: 16px;
font-weight: 500;
color: #FFFFFF;
line-height: 22px;
margin-left: 8px;
  }
`
const StyledBoxContent = styled.div`
  background-color: #1C4085;
  padding: 16px;
  box-sizing: border-box;
  &.receive-content {
    display: flex;
    justify-content: space-between;
  }
`
const StyledBCInfo = styled.div`
  width: calc(50% - 1px);
  .info-title {
font-size: 14px;
font-weight: 400;
color: #B2B2B2;
line-height: 20px;
padding: 0;
margin: 0;
  }
  .info-content {
    flex: 1;
  }
  .info-amount {
font-size: 24px;
font-weight: 600;
color: #FFFFFF;
line-height: 33px;
padding: 0;
margin: 8px 0 0 0;
sub {
  bottom: 0;
    font-size: 14px;
    color: #e3e3e3;
    font-weight: 400;
    margin-left: 2px;
}
  }

  .twitter-account {
font-size: 24px;
font-weight: 600;
color: #FFFFFF;
line-height: 33px;
margin-left: 4px;
  }
  .twitter-info {
    display: flex;
    align-items: center;
    margin: 8px 0 0 0;
  }
`
const StyledLine = styled.div`
width: 1px;
height: auto;
background-color: #fff;
margin: 0 16px;
`
const StyledBCInfoCenter = styled.div`
  display: flex;
  align-items: center;
`
export default Publish
