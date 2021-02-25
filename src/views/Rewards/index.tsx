import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components'
import { Avatar, Table } from 'antd'
import { Link } from 'react-router-dom'
import { isMobile } from "react-device-detect";
import { pendingRewards } from '../../api/api';


const StyledContainer = styled.div`
  max-width: 800px;
  margin: 20px auto 0;
`

const Rewards = () => {
  const [rewardsLoading, setRewardsLoading] = useState<boolean>(false)
  const [rewardsList, setRewardsList] = useState<Array<any>>([])
  const [rewardsCount, setRewardsCount] = useState<number>(0)

  const columns = [
    {
      title: '用户',
      dataIndex: 'username',
      key: 'username',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <a href={ `${process.env.REACT_APP_MATATAKI}/user/${record.to_id}` } target="_blank" rel="noopener noreferrer">
            {
              (!isMobile) && <Avatar src={`${process.env.REACT_APP_MTTK_IMG_CDN}/${record.avatar}`}></Avatar>
            }
            <span style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.85)' }}>{text}</span>
          </a>
        )
      }
    },
    {
      title: 'Token',
      dataIndex: 'token_id',
      key: 'token_id',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <a href={ `${process.env.REACT_APP_MATATAKI}/token/${record.token_id}` } target="_blank" rel="noopener noreferrer" style={{color: 'rgba(0, 0, 0, 0.85)' }}>
            {
              (!isMobile) && <Avatar src={`${process.env.REACT_APP_MTTK_IMG_CDN}/${record.logo}`}></Avatar>
            }
            <span style={{ marginLeft: 8, color: 'rgba(0, 0, 0, 0.85)' }}>{record.symbol}({ record.name })</span>
          </a>
        )
      }
    },
    {
      title: '数量',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '任务',
      dataIndex: 'qid',
      key: 'qid',
      render: (text: string, record: any) => {
        // console.log('text', text, record)
        return (
          <Link to={ `/${text}` } style={{color: 'rgba(0, 0, 0, 0.85)' }} target="_blank">
            { isMobile ? '查看' : '查看任务' }
          </Link>
        )
      }
    },
  ];

  useEffect(() => {
    // 获取任务列表
    const getData = async () => {
      try {
        setRewardsLoading(true)
        const result: any = await pendingRewards()
        setRewardsLoading(false)
        if (result.code === 0) {
          setRewardsList(result.data.list)
          setRewardsCount(result.data.count)
        }
      } catch (error) {
        setRewardsLoading(false)
        console.log('error', error)
      }
    }

    getData()
  }, [])

  const tableSize: any = useMemo(() => {
    return isMobile ? 'small' : 'default'
  }, [])

  return (
    <StyledContainer>
      <Table
        loading={rewardsLoading}
        dataSource={rewardsList}
        columns={columns}
        pagination={ false }
        size={ tableSize }
      />;
    </StyledContainer>
  )
}

export default Rewards