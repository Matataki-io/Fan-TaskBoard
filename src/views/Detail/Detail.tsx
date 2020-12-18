import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useHistory, useParams } from 'react-router-dom'
import { Button, message, Avatar, Table, Tag, Space } from 'antd'
import { useSelector, useDispatch } from "react-redux";
import { useMount } from 'ahooks';
import moment from 'moment'
import BigNumber from 'bignumber.js'
import {CopyToClipboard} from 'react-copy-to-clipboard';

import publish1 from '../../assets/img/publish-1.png';
import Page from '../../components/Page'
import { selectUser } from '../../store/userSlice';
import {
  getQuestDetailProps, receiveProps,
  getQuestDetail, getQuestDetailList, receive
} from '../../api/api'
import { DetailInfoIcon, DetailReceivedIcon, DetailShareIcon } from '../../components/IconAnt'

const Publish: React.FC = () => {
  const history = useHistory();
  const user: any = useSelector(selectUser)
  const { id }: { id: string } = useParams()

  const [reload, setReload] = useState<number>(0)
  const [questDetail, setQuestDetail] = useState<any>({})
  const [receivedList, setReceivedList] = useState<any[]>([])

  // 获取详情
  useEffect(() => {

    const getData = async () => {
      try {
        const result: any = await getQuestDetail(id, { type: 0 })
        console.log('result', result)
        if (result.code === 0) {
          setQuestDetail(result.data)
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    getData()

  }, [id, reload])

  // 获取领取记录
  useEffect(() => {

    const getData = async () => {
      try {
        let params: getQuestDetailProps = { type: 0 }
        const result: any = await getQuestDetailList(id, params)
        console.log('result', result)
        if (result.code === 0) {
          let list = result.data.list.map((i: any, idx: number) => ({
            key: idx + 1,
            ...i
          }))
          setReceivedList(list)
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    getData()

  }, [id, reload])

  // 计算获取奖励
  const processReward = (price: string, people: string) => {
    // console.log('1111', price, people)
    let BN = BigNumber.clone()
    BN.config({ DECIMAL_PLACES: 3 })
    let single = new BN(new BN(Number(price))).dividedBy(Number(people))
    return single.toString()
  }
  // 计算奖励领取份额
  const processRewardShare = (people: string, received: string) => {
    let BN = BigNumber.clone()
    BN.config({ DECIMAL_PLACES: 3 })
    let single = new BN(new BN(Number(people))).minus(Number(received))
    return single.toString()
  }

  const columns = [
    {
      title: '领取人',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <a href={`${process.env.REACT_APP_MATATAKI}/user/${record.uid}`} target="_blank" rel="noopener noreferrer">
            <Avatar src={`${process.env.REACT_APP_MTTK_IMG_CDN}/${record.avatar}`}></Avatar>
            <span style={{ marginLeft: 8, color: '#fff', fontSize: 14 }}>{text}</span>
          </a>
        )
      }
    },
    {
      title: '领取数量',
      dataIndex: 'amount',
      key: 'amount',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <a style={{ color: '#fff', fontSize: 14 }} href={`${process.env.REACT_APP_MATATAKI}/token/${record.token_id}`} target="_blank" rel="noopener noreferrer">
            {text} {record.symbol}
          </a>
        )
      }
    },
    {
      title: '领取时间',
      dataIndex: 'create_time',
      key: 'create_time',
      width: 180,
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <span style={{ color: '#fff', fontSize: 14 }}>
            { moment(text).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        )
      }
    },
  ];

  const ReceivedFn = async (qid: string|number): Promise<void> => {
    if (!user.id) {
      message.info('请先登陆')
      return
    }

    try {
      const data: receiveProps = {
        qid: qid
      }
      const result: any = await receive(data)
      console.log('result', result)
      if (result.code === 0) {
        message.success('领取成功')
        setReload(Date.now())
      } else {
        message.error(result.message)
      }
    } catch (error) {
      console.log('error', error)
    }

  }

  const ReceivedButton = () => {
    if (questDetail.receive) {
      return (<StyledButtonAntd className="receive">已经领取</StyledButtonAntd>)
    } else if (( String(questDetail.received) === String(questDetail.reward_people))) {
      return (<StyledButtonAntd className="receive">领取完毕</StyledButtonAntd>)
    } else {
      return (<StyledButtonAntd onClick={ () => ReceivedFn(id) } className="receive">领取奖励</StyledButtonAntd>)
    }
  }

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
              <span className="status">
                {( String(questDetail.received) === String(questDetail.reward_people)) ? '领取完毕' : '进行中' }
              </span>

              <CopyToClipboard
                text={`立即领取奖励：${window.location.href}`}
                onCopy={() => message.info('复制成功，立即分享！')}>
                  <StyledInfoShare>
                    <DetailShareIcon className="icon"></DetailShareIcon>
                  </StyledInfoShare>
              </CopyToClipboard>

            </StyledInfoHead>
            <StyledInfoHead>
              <span className="item-title">任务创建者 </span>
              <a
                href={`${process.env.REACT_APP_MATATAKI}/user/${questDetail.uid}`}
                target="_blank" rel="noopener noreferrer"
                className="account">
                <Avatar src={`${process.env.REACT_APP_MTTK_IMG_CDN}/${questDetail.avatar}`}></Avatar>
                <span>{questDetail.username}</span>
              </a>
            </StyledInfoHead>
            <StyledInfoHead>
              <span className="item-title">创建时间</span>
              <span className="time">{moment(questDetail.create_time).format('YYYY-MM-DD HH:mm:ss')}</span>
            </StyledInfoHead>
            <StyledBox className="info">
              <StyledBoxHead>
                <DetailInfoIcon className="icon"></DetailInfoIcon>
                <span className="box-title">任务详情</span>
              </StyledBoxHead>
              <StyledBoxContent className="receive-content">
                <StyledBCInfo>
                  <StyledBCInfoCenter>
                    <div className="info-content">
                      <p className="info-title">你可得到</p>
                      <p className="info-amount">{processReward(questDetail.reward_price, questDetail.reward_people)}<sub>{questDetail.symbol}</sub></p>
                    </div>
                    <div className="info-content">
                      <p className="info-title">总奖励数量</p>
                      <p className="info-amount">{processRewardShare(questDetail.reward_people, questDetail.received)}<sub>/{questDetail.reward_people}</sub></p>
                    </div>
                  </StyledBCInfoCenter>
                  { ReceivedButton() }
                </StyledBCInfo>
                <StyledLine></StyledLine>
                <StyledBCInfo>
                  <span className="info-title">去关注</span>
                  <div className="twitter-info">
                    <Avatar src={`${process.env.REACT_APP_MTTK_IMG_CDN}/${questDetail.avatar}`}></Avatar>
                    <span className="twitter-account">{questDetail.twitter_id}</span>
                  </div>
                  <a
                    href={`https://twitter.com/${questDetail.twitter_screen_name || questDetail.twitter_id}`}
                    target="_blank" rel="noopener noreferrer"
                  >
                    <StyledButtonAntd className="follow">前往推特去关注</StyledButtonAntd>
                  </a>
                </StyledBCInfo>
              </StyledBoxContent>
            </StyledBox>
          </StyledInfoBox>
        </StyledInfo>
        <StyledBox className="list">
          <StyledBoxHead>
            <DetailReceivedIcon className="icon"></DetailReceivedIcon>
            <span className="box-title">奖励详情</span>
          </StyledBoxHead>
          <StyledBoxContent>
            <StyledBCTable columns={columns} dataSource={receivedList} pagination={false} />
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
  width: 1100px;
  margin: 0 auto 100px;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  .title-img {
    height: 60px;
    margin: 100px auto 0;
    display: block;
  }
  @media screen and (max-width: 1200px) {
    width: 90%;
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
const StyledInfoShare = styled.div`
  width: 32px;
  height: 32px;
  background: #6236FF;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  cursor: pointer;
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
  font-size: 16px;
  font-weight: 500;
  color: #6236FF;
  line-height: 22px;
  display: flex;
  align-items: center;
  span {
    margin-left: 8px;
  }
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
  display: flex;
  align-items: center;
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
  box-sizing: border-box;
  &.receive-content {
    display: flex;
    justify-content: space-between;
    padding: 16px;
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
const StyledBCTable = styled(Table)`
  .ant-table table {
    background: #1c4084;
  }
  .ant-table-thead > tr > th {
    color: #B2B2B2;
    background: #1c4084;
  }
  .ant-table-tbody > tr.ant-table-row:hover > td {
    background: #193974;
  }
  .ant-table-tbody > tr:nth-last-of-type(1) > td {
    border-bottom: none;
  }
`
export default Publish
