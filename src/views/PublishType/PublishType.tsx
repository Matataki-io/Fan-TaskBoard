import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import { Link, useParams, useHistory } from 'react-router-dom'
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Radio, Form, message, Spin, Pagination } from 'antd'
import ReactMarkdown from 'react-markdown'
import { debounce } from 'lodash';
import random from 'string-random';

import { selectUser } from '../../store/userSlice';
import {
  questInterface, createQuest, getQuestDetail, updateQuest,
  UpdateQuestProps
} from '../../api/api'

import Page from '../../components/Page'
import TwitterUserSearch from './components/TwitterUserSearch'
import TokenSearch from './components/TokenSearch'
import publish1 from '../../assets/img/publish-1.png'
import publish2 from '../../assets/img/publish-2.png'
import publish3 from '../../assets/img/publish-3.png'
import publishDecrypt from '../../assets/img/publish-decrypt.png'

const PublishType: React.FC = () => {
  const { type, id }: { type: string, id: string } = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [questCreateLoading, setQuestCreateLoading] = useState<boolean>(false)
  const user: any = useSelector(selectUser)
  const [mdContent, setMdContent] = useState<string>('')
  const [radioKey, setRadioKey] = React.useState('default'); // 单选
  const [keyVal, setKeyVal] = React.useState(''); // 自定义口令value
  const [questDetail, setQuestDetail] = useState<any>({})

  // 判断任务类型
  useEffect(() => {

    let list = ['twitter', 'customtask', 'key']
    if (!list.includes(type)) {
      history.go(-1)
    }
  }, [history, type])

  const memoDisabled = useMemo(() => !!id, [id])

  // 设置默认单选
  useEffect(() => {
    // 发布情况下
    if (type && !id) {
      form.setFieldsValue({
        keyModel: 'default'
      })
    }
  }, [form, id, type])

  useEffect(() => {
    // 获取任务信息
    const getData = async () => {
      const result: any = await getQuestDetail(id)
      console.log('result', result)
      if (result.code === 0) {
        const data = result.data

        // 不是自己发布的
        if (String(data.uid) !== String(user.id)) {
          history.push('/')
        }

        setQuestDetail(data)

        if (data.key) {
          setRadioKey('custom')
          setKeyVal(data.key)
        }

        form.setFieldsValue({
          title: data.title,
          content: data.content,
          keyModel: data.key ? "custom" : 'default',
          token: data.token_id,
          rewardPeople: data.reward_people,
          rewardPrice: data.reward_price,
        })
      }
    }

    if (id && user.id) {
      getData()
    }
  }, [form, history, id, memoDisabled, user.id])

  // 发布任务
  const publishQuestFinsh = (value: any) => {
    const createQuestFn = async (data: questInterface) => {
      setQuestCreateLoading(true)
      try {
      message.info('正在支付并且创建任务，请耐心等待...')
      const result: any = await createQuest(data)
      if (result.code === 0) {
        message.info('创建成功，可返回首页查询任务')
        form.resetFields()
        history.push(`/publish/done?${process.env.REACT_APP_FE}/${result.data}`)
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

    let data: any = {}

    if (type === 'twitter') {
      data = {
        type: 0,
        twitter_id: value.account ? value.account.value : '',
        token_id: value.token,
        reward_people: value.rewardPeople,
        reward_price: value.rewardPrice
      }
    } else if (type === 'customtask') {
      data = {
        type: 1,
        title: value.title,
        content: value.content,
        token_id: value.token,
        reward_people: value.rewardPeople,
        reward_price: value.rewardPrice
      }
    } else if (type === 'key') {
      data = {
        type: 2,
        title: value.title,
        content: value.content,
        key: radioKey === 'custom' ? keyVal : '',
        token_id: value.token,
        reward_people: value.rewardPeople,
        reward_price: value.rewardPrice
      }
    } else {
      message.info(`任务类型错误`)
      return
    }

    let typeList = [0, 1, 2]
    if (!typeList.includes(data.type)) {
      message.info(`请选择任务类型`)
      return
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
  }

  // 更新任务
  const updateQuestFinsh = (value: any) => {
    const updateQuestFn = async (data: UpdateQuestProps) => {
      setQuestCreateLoading(true)
      try {
      const result: any = await updateQuest(id, data)
      if (result.code === 0) {
        message.info('更新成功')
        form.resetFields()
        history.push(`/${id}`)
      } else {
        message.error('更新失败')
        console.log(result)
      }
      } catch (error) {
        console.log('updateQuestFn error', error)
      } finally {
        setQuestCreateLoading(false)
      }
    }

    let data: UpdateQuestProps = Object.create(null)
    if(String(questDetail.type) === '0' || String(questDetail.type) === '1') {
      data = {
        type: questDetail.type,
        title: value.title,
        content: value.content,
      }
    } else if (String(questDetail.type) === '2' ) {
      data = {
        type: questDetail.type,
        title: value.title,
        content: value.content,
        key: keyVal
      }
    } else {
      console.log('其他类型')
      return
    }
    updateQuestFn(data)
  }

  // 完成表单
  const onFinish = (value: any) => {
    console.log(value);
    if (!user.id) {
      message.info('请登陆')
      return
    }

    if (id) {
      updateQuestFinsh(value)
    } else {
      publishQuestFinsh(value)
    }
  };

  const handleContent = () => {
    const val = form.getFieldsValue()
    setMdContent(val.content)
  }
  const debounceHandleContent = debounce(handleContent, 300)

  // key model input handle change
  const handleKeyModelChange = (e: any) => {
    setRadioKey(e.target.value);
  };
  const handleKeyModelInputChange = (e: any) => {
    setKeyVal(e.target.value);
  };

  const randomKey = () => {
    const _key = random(32, { numbers: false });
    setKeyVal(_key);
  }

  return (
    <Page>
      <StyledContent>
        <StyledBackPage to="/publish"> { '<' } 返回选择创建任务类型</StyledBackPage>
        <StyledCover src={
          type === 'twitter' ?
          publish1 :
          type === 'key' ?
          publishDecrypt :
          type === 'customtask' ?
          publish3 : ''
        } alt="logo"/>

        <p className="title">
          {
            type === 'twitter' ?
            '创建Twitter关注任务' :
            type === 'key' ?
            '解谜任务' :
            type === 'customtask' ?
            '创建自定义任务' : ''
          }
        </p>
        <p className="description">只要1分钟即可发布属于你的有奖任务</p>

        <Form
          className="hall-create"
          layout="vertical"
          form={form}
          onFinish={onFinish}
        >
          {
            type === 'twitter' ?
            (
              <Form.Item label="关注账户" name="account" rules={[{ required: true, message: '请输入关注账户!' }]}>
                <TwitterUserSearch />
              </Form.Item>
            ) :
            type === 'customtask' || type === 'key' ?
            (
              <>
                <Form.Item label="任务标题" name="title" rules={[{ required: true, message: '请输入任务标题!' }]}>
                  <Input size="large" placeholder="请输入任务标题" maxLength={20} />
                </Form.Item>
                <Form.Item label="任务介绍（支持markdown）" name="content" rules={[{ required: true, message: '请输入任务介绍!' }]}>
                  <Input.TextArea className="textarea-content" rows={6} size="large" placeholder="请输入任务介绍" onChange={ debounceHandleContent } showCount maxLength={1000} />
                </Form.Item>
                {
                  mdContent ?
                  (
                    <StyledMDContent>
                      <h3 className="preview-title">Preview</h3>
                      <ReactMarkdown className="markdown-body">
                        { mdContent }
                      </ReactMarkdown>
                    </StyledMDContent>
                  ) : null
                }
              </>
            ) : ''
          }
          {
            type === 'key' ?
            (
              <Form.Item label="口令模式" name="keyModel" rules={[{ required: true, message: '请输入口令!' }]} className="radio-keymodel">
                <Radio.Group defaultValue={radioKey} onChange={handleKeyModelChange}>
                  <Radio value={'default'}>
                    <span className="text">默认</span></Radio>
                  <Radio value={'custom'}>
                    <span className="text">自定义</span>
                    {
                      radioKey === 'custom' ?
                      <>
                        <StyledKeyInput
                          onChange={handleKeyModelInputChange}
                          placeholder="请输入自定义口令"
                          maxLength={32}
                          value={keyVal}
                          />
                        <Button onClick={ () => randomKey() } style={{ marginLeft: 10 }}>随机</Button>
                      </> : null
                    }
                  </Radio>
                </Radio.Group>
              </Form.Item>
            ) : ''
          }
          <Form.Item label="奖励Fan票类型" name="token" rules={[{ required: true, message: '请选择奖励Fan票类型!' }]}>
            <TokenSearch token={ questDetail.token_id } />
          </Form.Item>
          <Form.Item label="奖励人数" name="rewardPeople" rules={[{ required: true, message: '请输入奖励人数!' }]}>
            <Input disabled={memoDisabled} size="large" placeholder="奖励人数" />
          </Form.Item>
          <Form.Item label="奖励总金额" name="rewardPrice" rules={[{ required: true, message: '请输入奖励总金额!' }]}>
            <Input disabled={memoDisabled} size="large" placeholder="奖励总金额" />
          </Form.Item>
          <Form.Item>
            <StyledButtonAntd loading={questCreateLoading} type="primary" htmlType="submit">
              { memoDisabled ? '更新' : '支付并创建' }
            </StyledButtonAntd>
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
  margin: 20px 0 0 0;
  box-sizing: border-box;
`

const StyledContent = styled.div`
  color: #FFFFFF;
  width: 480px;
  margin: 48px auto 140px;
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
    margin: 0;
  }
  .ant-form-item-label > label {
    color: #FFFFFF;
  }
  .description {
    font-size: 14px;
    font-weight: 400;
    color: #B2B2B2;
    line-height: 20px;
    padding: 0;
    margin: 8px 0 24px 0;
  }
  .hall-create {
    .ant-input-textarea-show-count::after {
      color: #FFFFFF;
    }
  }
  .radio-keymodel {
    .ant-radio-wrapper .text {
      color: #FFFFFF;
    }
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
const StyledCover = styled.img`
  display: block;
  height: 128px;
  margin: 24px 0 0 0;
`
const StyledMDContent = styled.div`
  margin: 40px 0;
  .preview-title {
    font-size: 22px;
    font-weight: bold;
    padding: 0;
    margin: 0 0 20px 0;
    color: #fff;
  }
  * {
    max-width: 100%;
  }
  .markdown-body {
    padding: 20px 10px;
    background: #fff;
  }
`

const StyledKeyInput = styled(Input)`
  margin-left: 10px;
  max-width: 240px;
  @media screen and (max-width: 768px) {
    max-width: 168px;
  }
`

export default PublishType
