import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Select, Form, message, Spin, Pagination } from 'antd'

import { selectUser } from '../../store/userSlice';
import {
  questInterface, createQuest
} from '../../api/api'

import Page from '../../components/Page'
import TwitterUserSearch from './components/TwitterUserSearch'
import TokenSearch from './components/TokenSearch'

const PublishType: React.FC = () => {
  const { type }: { type: string } = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [questCreateLoading, setQuestCreateLoading] = useState<boolean>(false)
  const user: any = useSelector(selectUser)


  // 判断任务类型
  useEffect(() => {
    if (type !== 'twitter') {
      history.go(-1)
    }
  }, [history, type])


  // 完成表单
  const onFinish = (value: any) => {
    console.log(value);

    if (!user.id) {
      message.info('请登陆')
      return
    }

    const createQuestFn = async (data: questInterface) => {
      setQuestCreateLoading(true)
      try {
      message.info('正在支付并且创建任务，请耐心等待...')
      const result: any = await createQuest(data)
      if (result.code === 0) {
        message.info('创建成功，可返回首页查询任务')
        form.resetFields()
      } else {
        message.error('创建失败')
        console.log(result)
      }
      } catch (error) {
        console.log('createQuestFn error', error)
      } finally {
        setQuestCreateLoading(false)
      }
    }

    let data: any = {
      type: 0,
      twitter_id: value.account ? value.account.value : '',
      token_id: value.token,
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

  return (
    <Page>
      <StyledContent>
        <StyledBackPage to="/publish"> { '<' } 返回选择创建任务类型</StyledBackPage>
        <p className="title">创建Twitter关注任务</p>

        <Form
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
          <Form.Item label="奖励人数" name="rewardPeople" rules={[{ required: true, message: '请输入奖励人数!' }]}>
            <Input size="large" placeholder="奖励人数" />
          </Form.Item>
          <Form.Item label="奖励总金额" name="rewardPrice" rules={[{ required: true, message: '请输入奖励总金额!' }]}>
            <Input size="large" placeholder="奖励总金额" />
          </Form.Item>
          <Form.Item>
            <StyledButtonAntd loading={questCreateLoading} type="primary" htmlType="submit">支付并创建</StyledButtonAntd>
          </Form.Item>
        </Form>

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
  width: 100%;
  margin: 0;
  box-sizing: border-box;
`

const StyledContent = styled.div`
  color: #FFFFFF;
  width: 480px;
  margin: 100px auto 140px;
  padding: 0 10px;
  box-sizing: border-box;
  position: relative;
  @media screen and (max-width: 500px) {
    width: 90%;
  }
  .title {
    font-size: 22px;
    font-weight: 500;
    color: #FFFFFF;
    padding: 0;
    margin: 10px 0 40px 0;
  }
  .ant-form-item-label > label {
    color: #FFFFFF;
  }
`
const StyledBackPage = styled(Link)`
    font-size: 14px;
    font-weight: 500;
    color: #6236FF;
    line-height: 22px;
    &:hover {
      text-decoration: underline;
    }
`

export default PublishType
