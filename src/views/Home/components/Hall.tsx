import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'
import { useHistory } from 'react-router-dom'

import { SystemIcon, CreateIcon } from '../../../components/IconAnt'
import { getCookie } from '../../../utils/cookie'
import { getAccountList } from '../../../api/api'

const Hall: React.FC = () => {
  const [bindTwitter, setBindTwitter] = useState<boolean>(false)
  const [showHallSystem, setShowHallSystem] = useState<boolean>(false)
  const history = useHistory();

  useEffect(() => {
    // 获取用户的绑定信息
    const getAccountBind = async () => {
    if (!getCookie("x-access-token")) return

      try {
        const result: any = await getAccountList()
        if (result.code === 0) {
          // console.log('res', result)
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

  return (
    <StyledHall>
      <StyledHallSystem active={ showHallSystem }>
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

        <StyledHallSystemMini onClick={ () => setShowHallSystem(!showHallSystem) }>
          <SystemIcon className="icon"></SystemIcon>
        </StyledHallSystemMini>

      </StyledHallSystem>
      <StyledHallCreate>
        <div className="head">
          <CreateIcon className="head-icon"></CreateIcon>
          <span className="head-title">创建任务</span>
        </div>
        <StyledButton onClick={ () => history.push('/publish') }>创建任务</StyledButton>
      </StyledHallCreate>
    </StyledHall>
  )
}

export default Hall


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

const StyledHall = styled.div`
  @media screen and (min-width: 1400px) {
    position: fixed;
    margin: 40px 0 0 860px;
    width: 256px;
  }

  .head {
    display: flex;
    align-items: center;
    &-icon {
      margin-right: 7px;
      color: #fff;
    }
    &-title {
      font-size: 16px;
      font-weight: 600;
      color: #fff;
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


const StyledHallSystem = styled.div<{ active: boolean }>`
  width: 100%;
  background: #132D5E;
  border-radius: 8px;
  position: relative;

  @media screen and (max-width: 1400px) {
    position: fixed;
    right: 0;
    top: 80px;
    width: 256px;
    transform: ${({ active }) => active ? 'translateX(0)' : 'translateX(256px)'};
    transition: transform .3s;
  }

  .item {
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      font-size: 14px;
      font-weight: 400;
      color: #fff;
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
const StyledHallSystemMini = styled.div`
  position: absolute;
  left: -44px;
  top: 0;
  width: 40px;
  height: 40px;
  background: #132d5e;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 3px;
  cursor: pointer;
  z-index: 10;
  .icon {
    color: #fff;
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

  @media screen and (max-width: 1400px) {
    display: none;
  }
`
const StyledListItemInfo = styled.div`
  padding: 24px;
`