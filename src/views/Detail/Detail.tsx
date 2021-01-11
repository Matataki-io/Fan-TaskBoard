import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useParams } from 'react-router-dom'
import { Button, message, Avatar, Table, Input, Popconfirm } from 'antd'
import { useSelector } from "react-redux";
import moment from 'moment'
import BigNumber from 'bignumber.js'
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactMarkdown from 'react-markdown'

import publishTwitter from '../../assets/img/publish-1.png';
import publishKey from '../../assets/img/publish-2.png';
import publishCustomtask from '../../assets/img/publish-3.png';
import publishDecrypt from '../../assets/img/publish-decrypt.png';

import Page from '../../components/Page'
import { selectUser } from '../../store/userSlice';
import {
  receiveProps, applyHandleProps, applyProps, receiveKeyProps,
  getQuestDetail, getQuestDetailList, receive, receiveKey, getQuestDetailApplyList, apply, applyAgree, applyReject
} from '../../api/api'
import { DetailInfoIcon, DetailReceivedIcon, DetailShareIcon, CopyIcon } from '../../components/IconAnt'

const Publish: React.FC = () => {
  const user: any = useSelector(selectUser)
  const { id }: { id: string } = useParams()

  const [reload, setReload] = useState<number>(0)
  const [questDetail, setQuestDetail] = useState<any>({})
  const [receivedList, setReceivedList] = useState<any[]>([])
  const [receivedApplyList, setReceivedApplyList] = useState<any[]>([])
  const [remark, setRemark] = useState<string>('')
  const [key, setKey] = useState<string>('')

  // 获取详情
  useEffect(() => {

    const getData = async () => {
      try {
        const result: any = await getQuestDetail(id)
        console.log('result', result)
        if (result.code === 0) {
          setQuestDetail(result.data)

          if (result.data.type === 1) {
            getDataApplyList()
          }

        }
      } catch (error) {
        console.log('error', error)
      }
    }
  // 获取申请领取记录
    const getDataApplyList = async () => {
      try {
        const result: any = await getQuestDetailApplyList(id)
        console.log('result', result)
        if (result.code === 0) {
          let list = result.data.list.map((i: any, idx: number) => ({
            key: idx + 1,
            ...i
          }))
          setReceivedApplyList(list)
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
        let params: any = {}
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

  // 领取 columns
  const columnsList = [
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
  // 申请 columns
  const columnsApply = [
    {
      title: '申请人',
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
      title: '申请备注',
      dataIndex: 'remark',
      key: 'remark',
      render: (text: string, record: any) => {
        return (
          <span style={{ color: '#fff', fontSize: 14, maxWidth: 300, wordBreak: "break-word", display: "inline-block" }}>
            { text || '暂无'}
          </span>
        )
      }
    },
    {
      title: '申请时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <span style={{ color: '#fff', fontSize: 14 }}>
            { moment(text).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        )
      }
    },
    {
      title: '',
      width: 180,
      render: (text: string, record: any) => {
        console.log('text', text, record)
        return (
          <>
            <Button type="primary" onClick={() => applyAgreeFn({ qid: record.qid, uid: record.uid })}>同意</Button>
            &nbsp;
            <Popconfirm
              placement="top"
              title={"您确定拒绝这条申请？"}
              onConfirm={() => applyRejectFn({ qid: record.qid, uid: record.uid })}
              okText="Yes"
              cancelText="No">
              <Button>拒绝</Button>
            </Popconfirm>
          </>
        )
      }
    },
  ];

  // 领取奖励
  const ReceivedFn = async (qid: string | number): Promise<void> => {
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
  // 申请
  const ApplyFn = async (qid: string | number): Promise<void> => {
    if (!user.id) {
      message.info('请先登陆')
      return
    }

    try {
      const data: applyProps = {
        qid: qid,
        remark: remark
      }
      const result: any = await apply(data)
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
  // 领取
  const rewardKey = async (qid: string | number): Promise<void> => {
    if (!user.id) {
      message.info('请先登陆')
      return
    }

    try {
      const data: receiveKeyProps = {
        qid: qid,
        key: key
      }
      const result: any = await receiveKey(data)
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
  // 申请同意
  const applyAgreeFn = async ({ qid, uid }: applyHandleProps): Promise<void> => {
    if (!user.id) {
      message.info('请先登陆')
      return
    }

    try {
      const data: applyHandleProps = {
        qid: qid,
        uid: uid
      }
      const result: any = await applyAgree(data)
      console.log('result', result)
      if (result.code === 0) {
        message.success('同意成功')
        setReload(Date.now())
      } else {
        message.error(result.message)
      }
    } catch (error) {
      console.log('error', error)
    }

  }
  // 申请拒绝
  const applyRejectFn = async ({ qid, uid }: applyHandleProps): Promise<void> => {
    if (!user.id) {
      message.info('请先登陆')
      return
    }

    try {
      const data: applyHandleProps = {
        qid: qid,
        uid: uid
      }
      const result: any = await applyReject(data)
      console.log('result', result)
      if (result.code === 0) {
        message.success('拒绝成功')
        setReload(Date.now())
      } else {
        message.error(result.message)
      }
    } catch (error) {
      console.log('error', error)
    }

  }

  // 处理申请备注信息
  const handleRemarkChange = (e: any) => {
    let val: string = e.target.value
    setRemark(val.trim())
  }
  // 处理领取Key
  const handleKeyChange = (e: any) => {
    let val: string = e.target.value
    setKey(val.trim())
  }

  // 领取按钮
  const ReceivedButtonTwitter = () => {
    if (String(questDetail.uid) === String(user.id)) {
      return (<StyledButtonAntd className="receive">自己发布</StyledButtonAntd>)
    } else if (questDetail.receive) {
      return (<StyledButtonAntd className="receive">我已领取</StyledButtonAntd>)
    } else if ((String(questDetail.received) === String(questDetail.reward_people))) {
      return (<StyledButtonAntd className="receive">领取完毕</StyledButtonAntd>)
    } else {
      return (<StyledButtonAntd onClick={() => ReceivedFn(id)} className="receive">领取奖励</StyledButtonAntd>)
    }
  }
  // 领取按钮 自定义任务
  const ReceivedButtonCustomTask = () => {
    if (String(questDetail.uid) === String(user.id)) {
      return (<StyledButtonAntd className="receive">自己发布</StyledButtonAntd>)
    } else if (questDetail.receive) {
      return (<StyledButtonAntd className="receive">我已领取</StyledButtonAntd>)
    } else if ((String(questDetail.received) === String(questDetail.reward_people))) {
      return (<StyledButtonAntd className="receive">领取完毕</StyledButtonAntd>)
    } else if (questDetail.apply) {
      return (<StyledButtonAntd className="receive">我已申请</StyledButtonAntd>)
    } else {
      return (
        <>
          <Input.TextArea
            className="remark"
            placeholder="请输入备注"
            showCount
            maxLength={100}
            rows={4}
            onChange={e => handleRemarkChange(e)}
          />
          <StyledButtonAntd onClick={() => ApplyFn(id)} className="receive">我已完成任务并申请发放奖励</StyledButtonAntd>
        </>
      )
    }
  }
  // 领取按钮 key
  const ReceivedButtonKey = () => {
    if (String(questDetail.uid) === String(user.id)) {
      return (<StyledButtonAntd className="receive">自己发布</StyledButtonAntd>)
    } else if (questDetail.receive) {
      return (<StyledButtonAntd className="receive">我已领取</StyledButtonAntd>)
    } else if ((String(questDetail.received) === String(questDetail.reward_people))) {
      return (<StyledButtonAntd className="receive">领取完毕</StyledButtonAntd>)
    } else {
      return (
        <>
          <Input
            className="remark"
            placeholder="请输入Key"
            onChange={e => handleKeyChange(e)}
          />
          <StyledButtonAntd onClick={() => rewardKey(id)} className="receive">立即领取</StyledButtonAntd>
        </>
      )
    }
  }

  // 任务详情 twitter
  const QuestDetailTwitter = () => {
    return (
      <>
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
          {ReceivedButtonTwitter()}
        </StyledBCInfo>
        <StyledLine></StyledLine>
        <StyledBCInfo>
          <span className="info-title">去关注</span>
          <div className="twitter-info">
            <Avatar src={`${questDetail.twitter_profile_image_url_https}`}></Avatar>
            <span className="twitter-account">{questDetail.twitter_name || questDetail.twitter_screen_name || questDetail.twitter_id}</span>
          </div>
          <a
            href={`https://twitter.com/${questDetail.twitter_screen_name || questDetail.twitter_id}`}
            target="_blank" rel="noopener noreferrer"
          >
            <StyledButtonAntd className="follow">前往推特去关注</StyledButtonAntd>
          </a>
        </StyledBCInfo>
      </>
    )
  }

  // 任务详情 custom
  const QuestDetailCustomTask = () => {
    return (
      <>
        <StyledCustomTaskInfo>
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
          {ReceivedButtonCustomTask()}
        </StyledCustomTaskInfo>
      </>
    )
  }

    // 任务详情 key
  const QuestDetailKey = () => {
    return (
      <>
        <StyledCustomTaskInfo>
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
          {ReceivedButtonKey()}
        </StyledCustomTaskInfo>
      </>
    )
  }

  return (
    <Page>
      <StyledContent>
        <StyledBackHead>
          <StyledLinkBack to="/"> {'<'} 返回任务大厅</StyledLinkBack>
        </StyledBackHead>
        <StyledInfo>
          <StyledInfoBox>
            <StyledInfoCover src={
              Number(questDetail.type) === 0 ? publishTwitter :
                Number(questDetail.type) === 1 ? publishCustomtask :
                Number(questDetail.type) === 2 ? publishDecrypt : ''
            } alt="cover" />
          </StyledInfoBox>
          <StyledInfoBox>
            <StyledInfoHead>
              <span className="title">
                {
                  Number(questDetail.type) === 0 ? 'Twitter关注任务' :
                    (Number(questDetail.type) === 1 || Number(questDetail.type) === 2) ? questDetail.title : ''
                }
              </span>
              <span className="status">
                {(String(questDetail.received) === String(questDetail.reward_people)) ? '领取完毕' : '进行中'}
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
            {
              questDetail.key ?
              (
                <StyledInfoHead>
                  <span className="item-title">口&emsp;&emsp;令</span>
                  <span className="key">{ questDetail.key }
                    <CopyToClipboard
                      text={`口令：${questDetail.key}`}
                      onCopy={() => message.info('复制成功，立即分享！')}>
                      <StyledInfoCopy>
                        <CopyIcon className="icon"></CopyIcon>
                      </StyledInfoCopy>
                    </CopyToClipboard>
                  </span>
                </StyledInfoHead>
              ): ''
            }
            <StyledBox className="info">
              <StyledBoxHead>
                <DetailInfoIcon className="icon"></DetailInfoIcon>
                <span className="box-title">任务详情</span>
              </StyledBoxHead>
              <StyledBoxContent className="receive-content">
                {
                  Number(questDetail.type) === 0 ? QuestDetailTwitter() :
                  Number(questDetail.type) === 1 ? QuestDetailCustomTask() :
                  Number(questDetail.type) === 2 ? QuestDetailKey() : ''
                }
              </StyledBoxContent>
            </StyledBox>
          </StyledInfoBox>
        </StyledInfo>
        {
          (Number(questDetail.type) === 1 || Number(questDetail.type) === 2) ?
          (
            <StyledBox className="list">
              <StyledBoxHead>
                <DetailReceivedIcon className="icon"></DetailReceivedIcon>
                <span className="box-title">任务简介</span>
              </StyledBoxHead>
              <StyledBoxContent className="md">
                <ReactMarkdown>
                  {questDetail.content}
                </ReactMarkdown>
              </StyledBoxContent>
            </StyledBox>
          ) : null
        }
        {
          (
            Number(questDetail.type) === 1 &&
            (String(questDetail.uid) === String(user.id))
          ) ?
          (
            <StyledBox className="list">
              <StyledBoxHead>
                <DetailReceivedIcon className="icon"></DetailReceivedIcon>
                <span className="box-title">申请详情</span>
              </StyledBoxHead>
              <StyledBoxContent>
                <StyledBCTable columns={columnsApply} dataSource={receivedApplyList} pagination={false} />
              </StyledBoxContent>
            </StyledBox>
          ) : null
        }
        <StyledBox className="list">
          <StyledBoxHead>
            <DetailReceivedIcon className="icon"></DetailReceivedIcon>
            <span className="box-title">奖励详情</span>
          </StyledBoxHead>
          <StyledBoxContent>
            <StyledBCTable columns={columnsList} dataSource={receivedList} pagination={false} />
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
const StyledInfoCopy = styled.div`
  width: 26px;
  height: 26px;
  background: #6236FF;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
  cursor: pointer;
  margin-left: 10px;
  .icon {
    fill: #fff;
  }
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
    word-break: break-word;
    max-width: 400px;
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
  .key {
    font-size: 16px;
    font-weight: 400;
    color: #FFFFFF;
    line-height: 22px;
    display: flex;
    align-items: center;
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
  &.md {
    padding: 16px;
    box-sizing: border-box;
    color: #fff;
    * {
      color: #fff;
    }
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
const StyledCustomTaskInfo = styled.div`
  width: 50%;
  margin: 0 auto;
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
  .remark {
    margin: 10px 0 0;
    &.ant-input-textarea-show-count::after {
      color: #FFFFFF;
    }
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
