import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components'
import { Table, Button, Popconfirm, message } from 'antd'
import { Link } from 'react-router-dom'
import { isMobile } from "react-device-detect";
import { questAll, questEnd } from '../../api/api';
import moment from 'moment'


const StyledContainer = styled.div`
  max-width: 800px;
  margin: 20px auto 0;
`

const Rewards = () => {
  const [rewardsLoading, setRewardsLoading] = useState<boolean>(false)
  const [rewardsList, setRewardsList] = useState<Array<any>>([])
  const [rewardsCount, setRewardsCount] = useState<number>(0)
  const [reload, setReload] = useState<number>(0)

  const questEndFn = async (qid: string) => {
    try {
      const res: any = await questEnd({
        qid: qid
      })
      if (res.code === 0) {
        message.info(res.message)
        setReload(Date.now())
      } else {
        message.error(res.message)
      }
    } catch (e) {
      message.error('e', e)
    }
  }

  // 任务结束 confirm fn
  const messageText = '你确定结束任务？'
  function confirmQuestEnd(qid: string) {
    questEndFn(qid)
  }

  const columns = [
    {
      title: '任务ID',
      dataIndex: 'id',
      key: 'id',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <Link to={ `/${text}` } style={{color: 'rgba(0, 0, 0, 0.85)' }} target="_blank" title="查看任务">
            { text }
          </Link>
        )
      }
    },
    {
      title: '任务类型',
      dataIndex: 'type',
      key: 'type',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <Link to={ `/${record.id}` } style={{color: 'rgba(0, 0, 0, 0.85)' }} target="_blank" title="查看任务">
            {
              Number(text) === 0 ? 'Twitter关注任务' :
              Number(text) === 1 ? '自定义任务' :
              Number(text) === 2 ? '解谜任务' :
              Number(text) === 3 ? 'Twitter转推任务' : ''
            }
          </Link>
        )
      }
    },
    {
      title: '任务状态',
      dataIndex: 'end',
      key: 'end',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <span>
            {
              Number(text) === 0 ? '🔥 进行中' :
              Number(text) === 1 ? '🔚 已结束' : ''
            }
          </span>
        )
      }
    },
    {
      title: '创建时间',
      dataIndex: 'create_time',
      key: 'create_time',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <span>
            { moment(text).format('YYYY-MM-DD HH:mm:ss')}
          </span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: '',
      key: '',
      width: '90px',
      render: (text: string, record: any) => {
        console.log('text', text, record)
        return (
          Number(record.end) === 0 ?
          (<Popconfirm placement="top" title={messageText} onConfirm={ () => confirmQuestEnd(record.id) } okText="Yes" cancelText="No">
            <Button type="primary" danger size={ buttonSize }>结束任务</Button>
          </Popconfirm>) : <Button disabled size={ buttonSize }>已经结束</Button>
        )
      }
    },
  ];

  useEffect(() => {
    // 获取任务列表
    const getData = async () => {
      try {
        setRewardsLoading(true)
        const result: any = await questAll()
        setRewardsLoading(false)
        if (result.code === 0) {
          setRewardsList(result.data.list)
          setRewardsCount(result.data.count)
        }
      } catch (e) {
        setRewardsLoading(false)
        console.log('e', e)
      }
    }

    getData()
  }, [ reload ])

  const tableSize: any = useMemo(() => {
    return isMobile ? 'small' : 'default'
  }, [])

  const buttonSize: any = useMemo(() => {
    return isMobile ? 'small' : 'middle'
  }, [])

  return (
    <StyledContainer>
      <Table
        loading={rewardsLoading}
        dataSource={rewardsList}
        columns={columns}
        pagination={ false }
        size={ tableSize }
        scroll={{ x: 800 }}
      />;
    </StyledContainer>
  )
}

export default Rewards