import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'

import { getAllQuests, createQuest, questInterface } from '../../api/api'

import { Button, Input, Select, Form, message, Spin } from 'antd'

import TwitterUserSearch from './components/TwitterUserSearch'
import TokenSearch from './components/TokenSearch'

import logo from '../../assets/img/logo.png'
const { Search } = Input;
const { Option } = Select;


const Home: React.FC = () => {
  const onSearch = (value: any) => console.log(value);
  const handleChange = (value: any) => console.log(`selected ${value}`);

  const [form] = Form.useForm();
  const [questsReload, setQuestsReload] = useState<number>(0)
  const [quests, setQuests] = useState<any[]>([])
  const [questsCount, setQuestsCount] = useState<number>(0)

  useEffect(() => {
    const getData = async () => {
      try {
        const result: any = await getAllQuests()
        if (result.code === 0) {
          setQuests(result.data.list)
          setQuestsCount(result.data.count)
        }
      } catch (error) {
        console.log('error', error)
      }
    }
    getData()

  }, [questsReload])

  const onFinish = (value: any) => {
    console.log(value);

    const createQuestFn = async (data: questInterface) => {
      const result: any = await createQuest(data)
      if (result.code === 0) {
        message.info('创建成功')
        setQuestsReload(Date.now()) // 刷新列表
        form.resetFields()
      } else {
        message.error('创建失败')
        console.log(result)
      }
    }
    let data = {
      type: 0,
      twitter_id: value.account ? value.account.value : '',
      token_id: 21,
      reward_people: value.rewardPeople,
      reward_price: value.rewardPrice
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

  return (
    <Page>
      <StyledContent>
        <StyledMenu>
          <Search placeholder="搜索特定Fan票奖励下的任务" onSearch={onSearch} style={{ width: 200 }} />
          <ul>
            <li><h3>任务分类</h3></li>
            <li>
              <a href="">所有任务（{ questsCount }）</a>
            </li>
            <li>
              <a href="">Twitter关注（{questsCount}）</a>
            </li>
          </ul>
        </StyledMenu>

        <StyledHall>
          <StyledHallSystem>
            <StyledListItemInfo>
              <div className="head">
                <span className="head-icon">icon</span>
                <span className="head-title">系统任务</span>
              </div>
              <p className="hall-description">完成下方任务即可开始获取奖励</p>
              <ul className="item">
                <li>1.前往 <a>这里</a> 完成Twitter账户绑定</li>
                <li>2.前往 <a>这里</a> 授权获取Twitter消息</li>
              </ul>
            </StyledListItemInfo>

            <StyledListItemBox>
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
            </StyledListItemBox>

          </StyledHallSystem>
          <StyledHallCreate>
            <div className="head">
              <span className="head-icon">icon</span>
              <span className="head-title">创建任务</span>
            </div>
            <Form
              className="hall-create"
              layout="vertical"
              form={form}
              onFinish={onFinish}
            >
              <Form.Item label="关注账户" name="account" rules={[{ required: true,
                 message: '请输入关注账户!' }]}>
                <TwitterUserSearch />
              </Form.Item>
              {/* <Form.Item label="奖励Fan票类型" name="token" rules={[{ required: true, message: '请选择奖励Fan票类型!' }]}>
                <Select onChange={handleChange} placeholder="选择奖励Fan票类型">
                  <Option value="dao">DAO</Option>
                  <Option value="meta">META</Option>
                </Select>
              </Form.Item> */}
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
                <StyledButtonAntd type="primary" htmlType="submit">支付并创建</StyledButtonAntd>
              </Form.Item>
            </Form>
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
            <Select defaultValue="new" style={{ width: 120 }} onChange={handleChange}>
              <Option value="new">最新创建</Option>
            </Select>
          </div>
        </StyledContentHead>

        <StyledList>
          {
            quests.map(i => (
              <StyledListItem>
                <StyledListItemInfo>
                  <span className="tips">Twitter关注</span>
                  <StyledListItemUser>
                    <div className="user">
                      <img src={processTwitterImage(i.profile_image_url_https)} alt="avatar" />
                    </div>
                    <span className="user-name">{i.twitter_id}</span>
                  </StyledListItemUser>
                  <p className="user-by"><span>by</span>{i.username}</p>
                </StyledListItemInfo>

                <StyledListItemBox>
                  <StyledListItemBoxReward>
                    <div className="box-reward">
                      <p className="box-reward-token">{i.reward_price}<sub>{i.symbol}</sub></p>
                      <p className="box-reward-title">你可得</p>
                    </div>
                    <div className="box-reward">
                      <p className="box-reward-token">{i.reward_people}<sub>/{i.reward_people}</sub></p>
                      <p className="box-reward-title">总奖励</p>
                    </div>
                  </StyledListItemBoxReward>
                  <StyledButton>领取奖励</StyledButton>
                </StyledListItemBox>
              </StyledListItem>
            ))
          }
        </StyledList>
      </StyledContent>
    </Page>
  )
}

const StyledButton = styled.button`
  background: #6236FF;
  border-radius: 4px;
  width: 100%;
  border: none;
  outline: none;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 20px;
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
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-row-gap: 24px;
  grid-column-gap: 24px;
`
const StyledListItem = styled.div`
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

const StyledListItemUser = styled.div`
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
        color: #6236FF;
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


export default Home
