import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Select, Form, message, Spin, Pagination } from 'antd'
import { Link, useHistory } from 'react-router-dom'

import { decimalProcessing } from '../../utils/index'
import logo from '../../assets/img/logo.png'
import Page from '../../components/Page'
import {
  questInterface, getAllQuestsProps, receiveProps, getQuestCountProps,
  getAllQuests, createQuest, receive, getAccountList, getQuestCount
} from '../../api/api'
import { selectUser } from '../../store/userSlice';
import Hall from './components/Hall';
import Menu from './components/Menu';
import taskLogoCustom from '../../assets/img/task-logo-custom.png'
import taskLogoRetweet from '../../assets/img/task-logo-retweet.png'
import taskLogoKey from '../../assets/img/task-logo-key.png'

const { Option } = Select;

const Home: React.FC = () => {
  const [form] = Form.useForm();
  const [quests, setQuests] = useState<any[]>([])
  const [questsCount, setQuestsCount] = useState<number>(0) // 任务 总数量
  const [questsCurrent, setQuestsCurrent] = useState<number>(1) // 任务 当前页
  const [questGetLoading, setQuestGetLoading] = useState<boolean>(false)
  const [questSort, setQuestSort] = useState<string>('default') // 排序
  const [questSearchToken, setQuestSearchToken] = useState<string|number>('') // 根据token搜索
  const [questType, setQuestType] = useState<string>('all') // 筛选
  const [questFilter, setQuestFilter] = useState<string>('all') // 筛选

  const [count, setCount] = useState<any>({}) // 筛选统计

  const user: any = useSelector(selectUser)

  const sortList = [
    {
      value: 'default',
      label: '默认排序'
    },
    {
      value: 'new',
      label: '最新创建'
    },
    {
      value: 'most',
      label: '最多奖励'
    }
  ]

  // 任务排序处理
  const handleChange = (value: string) => {
    setQuestSort(value)
  };

  // 切换类型
  const toggleType = (e: any, value: string) => {
    // console.log(1111, value)
    e.preventDefault()
    setQuestType(value)
  }
  const toggleFilter = (e: any, value: string) => {
    // console.log(1111, value)
    e.preventDefault()
    setQuestFilter(value)
  }

  useEffect(() => {
    // 获取任务列表
    const getData = async () => {
      try {
        let params: getAllQuestsProps = {
          page: questsCurrent,
          size: 9,
          sort: questSort,
          token: questSearchToken,
          type: questType,
          filter: questFilter
        }
        setQuestGetLoading(true)
        const result: any = await getAllQuests(params)
        setQuestGetLoading(false)
        if (result.code === 0) {
          setQuests(result.data.list)
          setQuestsCount(result.data.count)
        }
      } catch (error) {
        console.log('error', error)
      }
    }

    getData()
  }, [questsCurrent, questSort, questSearchToken, questFilter, questType])


  useEffect(() => {
    // 获取统计信息
    const getData = async () => {
      try {
        let params: getQuestCountProps = {
          type: questType,
          token: questSearchToken,
        }
        const result: any = await getQuestCount(params)
        if (result.code === 0) {
          console.log('res', result)
          setCount(result.data)
        }
      } catch (error) {
        console.log('error', error)
      }
    }
    getData()

  }, [questSearchToken, questType])

  // 处理twitter图片
  const processTwitterImage = (url: string) => {
    try {
      return url.replace('_normal', '_400x400')
    } catch (error) {
      // console.log('processTwitterImage error', error)
      return url
    }
  }

  // 计算获取奖励
  const processReward = (price: string, people: string) => {
    // console.log('1111', price, people)
    let BN = BigNumber.clone()
    let single = new BN(new BN(Number(price))).dividedBy(Number(people))
    return decimalProcessing(single.toString())
  }
  // 计算奖励领取份额
  const processRewardShare = (people: string, received: string) => {
    let BN = BigNumber.clone()
    BN.config({ DECIMAL_PLACES: 3 })
    let single = new BN(new BN(Number(people))).minus(Number(received))
    return single.toString()
  }

  // 领取奖励
  const receiveFn = async (qid: number): Promise<void> => {

    if (!user.id) {
      message.error('请先登陆')
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
      } else {
        message.error(result.message)
      }
    } catch (error) {
      console.log('error', error)
    }
  }

  const handlePaginationChange = (page: any, pagesize: any) => {
    // console.log(11, page, pagesize)
    setQuestsCurrent(page)
  }

  const rewardButton = (i: any) => {
    // console.log('i', i)

    if (String(i.uid) === String(user.id)) {
      return (<StyledButton type="primary" disabled={true}>自己发布</StyledButton>)
    } else if (i.receive) {
      return (<StyledButton type="primary" disabled={true}>我已领取</StyledButton>)
    } else if (( String(i.received) === String(i.reward_people))) {
      return (<StyledButton type="primary" disabled={true}>领取完毕</StyledButton>)
    } else if (i.following) {
      return (<StyledButton type="primary" onClick={(e) => { e.preventDefault();receiveFn(i.id) }}>领取奖励</StyledButton>)
    } else if (!i.following) {
      return (<StyledButton type="primary" onClick={ (e) => { e.preventDefault();window.open(`https://twitter.com/${i.screen_name || i.twitter_id}`) } }>去做任务</StyledButton>)
    } else {
      return (<StyledButton type="primary">其他</StyledButton>)
    }
  }
  const retweetButton = (i: any) => {
    // console.log('i', i)

    if (String(i.uid) === String(user.id)) {
      return (<StyledButton type="primary" disabled={true}>自己发布</StyledButton>)
    } else if (i.receive) {
      return (<StyledButton type="primary" disabled={true}>我已领取</StyledButton>)
    } else if (( String(i.received) === String(i.reward_people))) {
      return (<StyledButton type="primary" disabled={true}>领取完毕</StyledButton>)
    } else {
      return (<StyledButton type="primary" onClick={ (e) => { e.preventDefault();window.open(`${i.twitter_status_url}`) } }>去做任务</StyledButton>)
    }
  }

  const customtaskButton = (i: any) => {
    // console.log('i', i)

    if (String(i.uid) === String(user.id)) {
      return (<StyledButton type="primary" disabled={true}>自己发布</StyledButton>)
    } else if (i.receive) {
      return (<StyledButton type="primary" disabled={true}>我已领取</StyledButton>)
    } else if (( String(i.received) === String(i.reward_people))) {
      return (<StyledButton type="primary" disabled={true}>领取完毕</StyledButton>)
    } else if (i.apply) {
      return (<StyledButton type="primary">我已申请</StyledButton>)
    } else if (!i.apply) {
      return (<StyledButton type="primary">查看任务</StyledButton>)
    } else {
      return (<StyledButton type="primary">其他</StyledButton>)
    }
  }
  const keyButton = (i: any) => {
    // console.log('i', i)

    if (String(i.uid) === String(user.id)) {
      return (<StyledButton type="primary" disabled={true}>自己发布</StyledButton>)
    } else if (i.receive) {
      return (<StyledButton type="primary" disabled={true}>我已领取</StyledButton>)
    } else if (( String(i.received) === String(i.reward_people))) {
      return (<StyledButton type="primary" disabled={true}>领取完毕</StyledButton>)
    } else {
      return (<StyledButton type="primary">查看任务</StyledButton>)
    }
  }

  const setSearchTokenFn = (tokenId: string | number): void => setQuestSearchToken(tokenId)

  return (
    <Page>
      <StyledContent>
        <Menu count={ count } user={ user } questType={ questType } questFilter={ questFilter } toggleType={ toggleType } toggleFilter={ toggleFilter } setSearchTokenFn={ setSearchTokenFn }></Menu>
        <Hall></Hall>

        <StyledContentHead>
          <div>
            <div className="head-hall">
              <img className="head-logo" src={logo} alt="logo" />
              <span className="head-title">任务大厅</span>
            </div>
            <p className="head-description">完成下方任务即可领取Fan票奖励</p>
          </div>
          <div>
            <Select defaultValue={questSort} style={{ width: 120 }} onChange={handleChange}>
              {
                sortList.map(i => (
                  <Option value={ i.value }>{ i.label }</Option>
                ))
              }
            </Select>
          </div>
        </StyledContentHead>

        <Spin spinning={questGetLoading}>
          {
            !quests.length ? <p style={{ color: '#fff', textAlign: 'center', fontSize: 16, margin: '100px 0 0 0' }}>暂无任务！</p> : ''
          }
          <StyledList>
            {
              quests.map(i => (
                <StyledListItem to={`/${i.id}`} key={i.id} target='_blank'>
                  <StyledListItemInfo>
                    <span className="tips">
                      {
                        Number(i.type) === 0 ? 'Twitter关注' :
                        Number(i.type) === 1 ? '自定义' :
                        Number(i.type) === 2 ? '解谜' :
                        Number(i.type) === 3 ? 'Twitter转推' : ''
                      }
                    </span>
                    {
                      Number(i.type) === 0 ?
                      (
                        <StyledListItemUser onClick={ e => e.stopPropagation() } href={ `https://twitter.com/${i.twitter_id}`} target="_blank" rel="noopener noreferrer">
                          <div className="user">
                            <img src={processTwitterImage(i.profile_image_url_https)} alt="avatar" />
                          </div>
                          <span className="user-name">{i.name || i.twitter_id}</span>
                        </StyledListItemUser>
                      ) :
                      Number(i.type) === 3 ?
                      (
                        <StyledListItemUser onClick={ e => e.stopPropagation() } href={ `${i.twitter_status_url}`} target="_blank" rel="noopener noreferrer">
                          <div className="user" style={{ borderRadius: 0 }}>
                            <img src={taskLogoRetweet} alt="avatar" style={{ objectFit: "contain" }} />
                          </div>
                          <span className="user-name">Twitter转推</span>
                        </StyledListItemUser>
                      ) :
                      Number(i.type) === 1 ?
                      (
                        <StyledListItemUser onClick={ e => e.stopPropagation() } target="_blank" rel="noopener noreferrer">
                          <div className="user" style={{ borderRadius: 0 }}>
                            <img src={ taskLogoCustom } alt="avatar" />
                          </div>
                          <span className="user-name">{i.title}</span>
                        </StyledListItemUser>
                      ) :
                      Number(i.type) === 2 ?
                      (
                        <StyledListItemUser onClick={ e => e.stopPropagation() } target="_blank" rel="noopener noreferrer">
                          <div className="user" style={{ borderRadius: 0 }}>
                            <img src={ taskLogoKey } alt="avatar" style={{ objectFit: "contain" }} />
                          </div>
                          <span className="user-name">{i.title}</span>
                        </StyledListItemUser>
                      ) : ''
                    }
                    <a onClick={ e => e.stopPropagation() } href={ `${process.env.REACT_APP_MATATAKI}/user/${i.uid}` } target="_blank" rel="noopener noreferrer" className="user-by"><span>by</span>{i.username}</a>
                  </StyledListItemInfo>

                  <StyledListItemBox>
                    <StyledListItemBoxReward>
                      <div className="box-reward">
                        <p className="box-reward-token">{ processReward(i.reward_price, i.reward_people) }<sub>{i.symbol}</sub></p>
                        <p className="box-reward-title">你可得</p>
                      </div>
                      <div className="box-reward">
                        <p className="box-reward-token">{ processRewardShare(i.reward_people, i.received) }<sub>/{i.reward_people}</sub></p>
                        <p className="box-reward-title">总奖励</p>
                      </div>
                    </StyledListItemBoxReward>
                    {
                      Number(i.type) === 0 ? rewardButton(i) :
                      Number(i.type) === 3 ? retweetButton(i) :
                      Number(i.type) === 1 ? customtaskButton(i) :
                      Number(i.type) === 2 ? keyButton(i) : null
                    }
                    {/* <StyledButton>去关注</StyledButton> */}
                    {/* <StyledButton>领取奖励</StyledButton> */}
                    {/* <StyledButton>我已领取</StyledButton> */}
                    {/* <StyledButton>取消任务</StyledButton> */}
                    {/* <StyledButton>自己发布</StyledButton> */}
                  </StyledListItemBox>
                  {
                    Number(i.end) === 0 ?
                    <span className="tag" role="img" aria-label="进行中" title="进行中">🔥</span> :
                    Number(i.end) === 1 ?
                    <span className="tag" role="img" aria-label="已结束" title="已结束">🔚</span> : ''
                  }
                </StyledListItem>
              ))
            }
          </StyledList>
        </Spin>
        <Pagination style={{ textAlign: 'center', marginTop: 20 }} hideOnSinglePage={true} defaultPageSize={9} current={questsCurrent} total={questsCount} onChange={handlePaginationChange}></Pagination>
      </StyledContent>
    </Page>
  )
}

const StyledButton = styled(Button)`
  background: #6236FF;
  border-radius: 4px;
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  height: 40px;
  padding: 10px 0;
  margin: 34px 0 0 0;
  cursor: pointer;
`
const StyledButtonAntd = styled(Button)`
  background: #6236FF;
  border-radius: 4px;
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  color: #fff;
  line-height: 1;
  cursor: pointer;
  height: 40px;
`

const StyledContent = styled.div`
  width: 840px;
  margin: 0 auto 120px;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  @media screen and (max-width: 992px) {
    width: 90%;
  }
`
const StyledContentHead = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 48px 0 24px;
  .head-hall {
    display: flex;
    align-items: center;
  }
  .head-logo {
    height: 30px;
    margin: 0 8px 0 0;
  }
  .head-title {
    font-size: 24px;
    font-weight: 600;
    color: #fff;
    line-height: 33px;
  }
  .head-description {
    font-size: 14px;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 20px;
  margin: 10px 0 0 0;
  }
`
const StyledList = styled.div`
  min-height: 300px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-row-gap: 24px;
  grid-column-gap: 24px;
  @media screen and (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`
const StyledListItem = styled(Link)`
  background: #132D5E;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  position: relative;
  overflow: hidden;
  .tips {
    font-size: 12px;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 17px;
  }
  .user-by {
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    line-height: 17px;
    margin: 0;
    display: block;
    span {
      font-size: 12px;
      font-weight: 400;
      color: #B2B2B2;
      line-height: 17px;
      margin: 0 4px 0 0;
    }
  }
  .tag {
    position: absolute;
    right: 0;
    top: 0;
    background: #fff;
    border-radius: 0 0 0 8px;
    font-size: 14px;
    color: #333;
    padding: 2px 10px;
  }
`

const StyledListItemInfo = styled.div`
  padding: 24px;
`

const StyledListItemUser = styled.a`
  display: flex;
  align-items: center;
  margin: 16px 0;
  .user {
    margin-right: 8px;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    overflow: hidden;
    margin: 0 8px 0 0;
    flex: 0 0 32px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .user-name {
    font-size: 20px;
    font-weight: 500;
    color: #fff;
    line-height: 28px;
    word-break: break-word;
  }
  .user-by {
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    line-height: 17px;
  }
`
const StyledListItemBox = styled.div`
  background: #1C4085;
  border-radius: 0px 0px 8px 8px;
  padding: 24px;
`
const StyledListItemBoxReward = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  .box-reward {
    text-align: center;
    &-token {
      font-size: 24px;
      font-weight: 500;
      color: #fff;
      line-height: 33px;
      margin: 0;
      font-weight: bold;
      sub {
        line-height: 1;
        font-size: 16px;
        vertical-align: baseline;
        font-weight: bold;
      }
    }
    &-title {
      font-size: 12px;
      font-weight: 400;
      color: #B2B2B2;
      line-height: 17px;
      margin: 4px 0 0 0;
    }
  }
`

const StyledTwitterUserCard = styled.div`
  display: flex;
  height: 38px;


  .twitter-avatar {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 5px;
  }

  .twitter-main {
    max-width: calc(100% - 36px);
    h4 {
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      color: black;
      margin:  1px 0 2px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    p {
      font-size: 14px;
      font-weight: 400;
      line-height: 16px;
      color: #b2b2b2;
      margin: 0;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`

const StyledSpinContent = styled.div`
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default Home
