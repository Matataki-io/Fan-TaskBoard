import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import SearchToken from './SearchToken'

interface MenuProps {
  count: { [key: string]: any }
  user: { [key: string]: any }
  questType: string
  questFilter: string
  toggleType: (e: any, value: string) => void
  toggleFilter: (e: any, value: string) => void
  setSearchTokenFn: (tokenId: string | number) => void
}

const Menu: React.FC<MenuProps> = ({ count, user, questType, questFilter, toggleType, toggleFilter, setSearchTokenFn }) => {
  return (
    <StyledMenu>
      <SearchToken setSearchTokenFn={ setSearchTokenFn }></SearchToken>
      <ul>
        <li><h3>任务分类</h3></li>
        <li>
          <StyledMenuLink active={ questType === 'all' } href="/" onClick={ e => toggleType(e, 'all') }>所有任务（{ count.type_all }）</StyledMenuLink>
        </li>
        <li>
          <StyledMenuLink active={ questType === 'twitter' } href="/" onClick={ e => toggleType(e, 'twitter') }>Twitter关注（{ count.type_twitter }）</StyledMenuLink>
        </li>
        <li>
          <StyledMenuLink active={ questType === 'customtask' } href="/" onClick={ e => toggleType(e, 'customtask') }>自定义任务（{ count.type_customtask }）</StyledMenuLink>
        </li>
        <li>
          <StyledMenuLink active={ questType === 'key' } href="/" onClick={ e => toggleType(e, 'key') }>口令任务（{ count.type_key }）</StyledMenuLink>
        </li>
      </ul>

      <ul>
        <li><h3>筛选</h3></li>
        <li>
          <StyledMenuLink active={ questFilter === 'all' } href="/" onClick={ e => toggleFilter(e, 'all') }>全部（{ count.all }）</StyledMenuLink>
        </li>
        <li>
          <StyledMenuLink active={ questFilter === 'undone' } href="/" onClick={ e => toggleFilter(e, 'undone') }>待完成（{count.undone}）</StyledMenuLink>
        </li>
        <li>
          <StyledMenuLink active={ questFilter === 'completed' } href="/" onClick={ e => toggleFilter(e, 'completed') }>领取完毕（{count.completed}）</StyledMenuLink>
        </li>
        {
          (user.id) ?
            (<>
              <li>
                <StyledMenuLink active={ questFilter === 'received' } href="/" onClick={ e => toggleFilter(e, 'received') }>我已领取（{count.received}）</StyledMenuLink>
              </li>
              <li>
                <StyledMenuLink active={ questFilter === 'created' } href="/" onClick={ e => toggleFilter(e, 'created') }>我创建的（{count.created}）</StyledMenuLink>
              </li>
            </>) : ''
        }
      </ul>
    </StyledMenu>
  )
}

export default Menu

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
    }
  }
`
const StyledMenuLink = styled.a<{ active: boolean }>`
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-decoration: none;
  color: ${({active}) => active ? '#6236FF' : '#fff'}
`