import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import BigNumber from 'bignumber.js'
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Select, Form, message, Spin, Pagination } from 'antd'
import { getCookie } from '../../utils/cookie'
import { Link, useHistory } from 'react-router-dom'

import logo from '../../assets/img/logo.png'
// import chef from '../../assets/img/chef.png'
// import Button from '../../components/Button'
// import Container from '../../components/Container'
import Page from '../../components/Page'
import {
  questInterface, getAllQuestsProps, receiveProps,
  getAllQuests, createQuest, receive, getAccountList
} from '../../api/api'
import { selectUser } from '../../store/userSlice';
import TwitterUserSearch from './components/TwitterUserSearch'
import TokenSearch from './components/TokenSearch'
import SearchToken from './components/SearchToken'
import { SystemIcon, CreateIcon } from '../../components/IconAnt'


const { Option } = Select;

const Home: React.FC = () => {
  const [form] = Form.useForm();
  const [questsReload, setQuestsReload] = useState<number>(0)
  const [quests, setQuests] = useState<any[]>([])
  const [questsCount, setQuestsCount] = useState<number>(0) // 任务 总数量
  const [questsCurrent, setQuestsCurrent] = useState<number>(1) // 任务 当前页
  const [questCreateLoading, setQuestCreateLoading] = useState<boolean>(false)
  const [questGetLoading, setQuestGetLoading] = useState<boolean>(false)
  const [bindTwitter, setBindTwitter] = useState<boolean>(false)
  const [questSort, setQuestSort] = useState<string>('new') // 排序
  const [questSearchToken, setQuestSearchToken] = useState<string|number>('') // 根据token搜索
  const user: any = useSelector(selectUser)
  const history = useHistory();

  // 任务排序处理
  const handleChange = (value: string) => {
    setQuestSort(value)
  };

  useEffect(() => {
    // 获取任务列表
    const getData = async () => {
      try {
        let params: getAllQuestsProps = {
          page: questsCurrent,
          size: 6,
          sort: questSort,
          token: questSearchToken
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
  }, [questsReload, questsCurrent, questSort, questSearchToken])

  useEffect(() => {
    // 获取用户的绑定信息
    const getAccountBind = async () => {
    if (!getCookie("x-access-token")) return

      try {
        const result: any = await getAccountList()
        if (result.code === 0) {
          console.log('res', result)
          if (result.data.find((i: any) => i.platform === "twitter")) {
            setBindTwitter(true)
          }
        }
      } catch (error) {
        console.log('error', error)
      }
    }
    getAccountBind()

  }, [])

  // 完成表单
  const onFinish = (value: any) => {
    console.log(value);

    if (!user.id) {
      message.info('请登陆')
      return
    }

    const createQuestFn = async (data: questInterface) => {
      setQuestCreateLoading(true)
      message.info('正在支付并且创建任务，请耐心等待...')
      const result: any = await createQuest(data)
      setQuestCreateLoading(false)
      if (result.code === 0) {
        message.info('创建成功')
        setQuestsReload(Date.now()) // 刷新列表
        form.resetFields()
      } else {
        message.error('创建失败')
        console.log(result)
      }
    }

    let data: any = {
      type: 0,
      twitter_id: value.account ? value.account.value : '',
      token_id: value.token.value,
      reward_people: value.rewardPeople,
      reward_price: value.rewardPrice
    }

    let typeList = [0]
    if (!typeList.includes(data.type)) {
      message.info(`请选择任务类型`)
      return
    }

    for (const key in data) {
      // 忽略type
      if (key !== 'type' && !data[key]) {
        message.info(`${key} 不能为空`)
        return
      }
    }

    if (!(Number.isInteger(Number(data.reward_people)) && Number(data.reward_people) > 0)) {
      message.info(`奖励人数必须为整数并大于0`)
      return
    }
    if (!(Number(data.reward_price) > 0)) {
      message.info(`奖励金额必须大于0`)
      return
    }

    createQuestFn(data)
  };
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
      return (<StyledButton type="primary" disabled={true}>已经领取</StyledButton>)
    } else if (i.following) {
      return (<StyledButton type="primary" onClick={() => receiveFn(i.id)}>领取奖励</StyledButton>)
    } else if (!i.following) {
      return (<StyledButton type="primary" onClick={ () => window.open(`https://twitter.com/${i.screen_name || i.twitter_id}`) }>去做任务</StyledButton>)
    } else {
      return (<StyledButton type="primary">其他</StyledButton>)
    }
  }

  const setSearchTokenFn = (tokenId: string | number): void => setQuestSearchToken(tokenId)

  return (
    <Page>
      <StyledContent>
        <StyledMenu>
          <SearchToken setSearchTokenFn={ setSearchTokenFn }></SearchToken>
          <ul>
            <li><h3>任务分类</h3></li>
            <li>
              <a href="">所有任务（{ questsCount }）</a>
            </li>
            <li>
              <a href="">Twitter关注（{questsCount}）</a>
            </li>
          </ul>

          {/* <ul>
            <li><h3>筛选</h3></li>
            <li>
              <a href="" className="action">全部（{ questsCount }）</a>
            </li>
            <li>
              <a href="">待完成（{questsCount}）</a>
            </li>
            <li>
              <a href="">已完成（{questsCount}）</a>
            </li>
            <li>
              <a href="">领取完毕（{questsCount}）</a>
            </li>
            <li>
              <a href="">我创建的（{questsCount}）</a>
            </li>
          </ul> */}
        </StyledMenu>

        <StyledHall>
          <StyledHallSystem>
            <StyledListItemInfo>
              <div className="head">
                <SystemIcon className="head-icon"></SystemIcon>
                <span className="head-title">系统任务</span>
              </div>
              <p className="hall-description">完成下方任务即可开始获取奖励</p>
              <ul className="item">
                <li>1. <a href={`${process.env.REACT_APP_MATATAKI}/setting/account`} target="_blank" rel="noopener noreferrer">完成Twitter账户绑定</a>
                  <span>{ bindTwitter ? '✅' : '❌' } </span>
                </li>
                {/* <li>2.前往 <a>这里</a> 授权获取Twitter消息</li> */}
              </ul>
            </StyledListItemInfo>

            {/* <StyledListItemBox>
              <StyledListItemBoxReward>
                <div className="box-reward">
                  <p className="box-reward-token">2<sub>DPC</sub></p>
                  <p className="box-reward-title">你可得</p>
                </div>
                <div className="box-reward">
                  <p className="box-reward-token">2<sub>DPC</sub></p>
                  <p className="box-reward-title">你可得</p>
                </div>
              </StyledListItemBoxReward>
              <StyledButton>领取奖励</StyledButton>
            </StyledListItemBox> */}

          </StyledHallSystem>
          <StyledHallCreate>
            <div className="head">
              <CreateIcon className="head-icon"></CreateIcon>
              <span className="head-title">创建任务</span>
            </div>
            {/* <Form
              className="hall-create"
              layout="vertical"
              form={form}
              onFinish={onFinish}
            >
              <Form.Item label="关注账户" name="account" rules={[{ required: true, message: '请输入关注账户!' }]}>
                <TwitterUserSearch />
              </Form.Item>
              <Form.Item label="奖励Fan票类型" name="token" rules={[{ required: true, message: '请选择奖励Fan票类型!' }]}>
                <TokenSearch />
              </Form.Item>
              <Form.Item label="奖励设置">
                <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)' }} name="rewardPeople" rules={[{ required: true, message: '请输入奖励人数!' }]}>
                  <Input placeholder="奖励人数" />
                </Form.Item>
                <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }} name="rewardPrice" rules={[{ required: true, message: '请输入奖励总金额!' }]}>
                  <Input placeholder="奖励总金额" />
                </Form.Item>
              </Form.Item>
              <Form.Item style={{ margin: "-24px 0 0 0" }}>
                <StyledButtonAntd loading={questCreateLoading} type="primary" htmlType="submit">支付并创建</StyledButtonAntd>
              </Form.Item>
            </Form> */}
            <StyledButton onClick={ () => history.push('/publish') }>创建任务</StyledButton>
          </StyledHallCreate>
        </StyledHall>

        <StyledContentHead>
          <div>
            <div className="head-hall">
              <img className="head-logo" src={logo} alt="logo" />
              <span className="head-title">任务大厅</span>
            </div>
            <p className="head-description">关注下方的账号即可领取Fan票奖励</p>
          </div>
          <div>
            <Select defaultValue={questSort} style={{ width: 120 }} onChange={handleChange}>
              <Option value="new">最新创建</Option>
              <Option value="most">最多奖励</Option>
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
                <StyledListItem to={`/${i.id}`} key={i.id}>
                  <StyledListItemInfo>
                    <span className="tips">Twitter关注</span>
                    <StyledListItemUser href={ `https://twitter.com/${i.twitter_id}`} target="_blank" rel="noopener noreferrer">
                      <div className="user">
                        <img src={processTwitterImage(i.profile_image_url_https)} alt="avatar" />
                      </div>
                      <span className="user-name">{i.twitter_id}</span>
                    </StyledListItemUser>
                    <a href={ `${process.env.REACT_APP_MATATAKI}/user/${i.uid}` } target="_blank" rel="noopener noreferrer" className="user-by"><span>by</span>{i.username}</a>
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
                      rewardButton(i)
                    }
                    {/* <StyledButton>去关注</StyledButton> */}
                    {/* <StyledButton>领取奖励</StyledButton> */}
                    {/* <StyledButton>已经领取</StyledButton> */}
                    {/* <StyledButton>取消任务</StyledButton> */}
                    {/* <StyledButton>自己发布</StyledButton> */}
                  </StyledListItemBox>
                </StyledListItem>
              ))
            }
          </StyledList>
        </Spin>
        <Pagination style={{ textAlign: 'center', marginTop: 20 }} hideOnSinglePage={true} defaultPageSize={6} current={questsCurrent} total={questsCount} onChange={handlePaginationChange}></Pagination>
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
  color: #FFFFFF;
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
  color: #FFFFFF;
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
    color: #FFFFFF;
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
  grid-template-columns: 1fr 1fr 1fr;
  grid-row-gap: 24px;
  grid-column-gap: 24px;
`
const StyledListItem = styled(Link)`
  background: #132D5E;
  border-radius: 8px;
  box-sizing: border-box;
  .tips {
    font-size: 12px;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 17px;
  }
  .user-by {
    font-size: 12px;
    font-weight: 500;
    color: #FFFFFF;
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
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .user-name {
    font-size: 20px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 28px;
  }
  .user-by {
    font-size: 12px;
    font-weight: 500;
    color: #FFFFFF;
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
      color: #FFFFFF;
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

// left 部分
const StyledMenu = styled.div`
  position: fixed;
  margin: 60px 0 0 -240px;
  ul {
    margin: 24px 0 0 0;
    padding: 0;
    list-style: none;
    li {
      margin: 16px 0;
      h3 {
        font-size: 16px;
        font-weight: 500;
        color: #B2B2B2;
        line-height: 22px;
        padding: 0;
        margin: 0;
      }
      a {
        font-size: 14px;
        font-weight: 500;
        color: #FFFFFF;
        line-height: 20px;
        text-decoration: none;
        &.action {
          color: #6236FF;
        }
      }
    }
  }
`
const StyledHall = styled.div`
  position: fixed;
  margin: 40px 0 0 860px;
  width: 256px;
  .head {
    display: flex;
    align-items: center;
    &-icon {
      margin-right: 7px;
      color: #FFFFFF;
    }
    &-title {
      font-size: 16px;
      font-weight: 600;
      color: #FFFFFF;
      line-height: 22px;
    }
  }
  .hall-description {
    font-size: 12px;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 17px;
    padding: 0;
    margin: 7px 0;
  }
`
const StyledHallSystem = styled.div`
  width: 100%;
  background: #132D5E;
  border-radius: 8px;
  .item {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      font-size: 14px;
      font-weight: 400;
      color: #FFFFFF;
      line-height: 20px;
      margin: 16px 0 0;
      a {
        color: #fff;
        text-decoration: underline;
      }
      span {
        margin: 0 0 0 6px;
      }
    }
  }
`
const StyledHallCreate = styled.div`
  width: 100%;
  background: #132D5E;
  color: #fff;
  border-radius: 8px;
  margin-top: 24px;
  padding: 24px;
  .hall-create {
    margin-top: 16px;
    .ant-form-item-label > label {
      color: #fff;
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
