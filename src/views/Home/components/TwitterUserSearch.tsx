import React, { useState } from 'react'
import styled from 'styled-components'

import { twitterUsersSearch } from '../../../api/api'

import { Select, Spin, Avatar } from 'antd';

import debounce from 'lodash/debounce'

const { Option } = Select;


const Home: React.FC = ({ value = {}, onChange }: any) => {

  // 推特用户搜索框相关变量
  const [searchData, setSearchData] = useState<any[]>([])
  const [searchFetching, setSearchFetching] = useState<boolean>(false)
  const [searchValue, setSearchValue] = useState<any>(undefined)
  let userSearchStr = ''

  /** 搜索推特用户 */
  const fetchUser = (localValue: any) => {
    setSearchData([])
    setSearchFetching(true)
    userSearchStr = localValue
    const thisUserSearchStr = userSearchStr

    ;(async function () {
      const res: any = await twitterUsersSearch(localValue)
      if (thisUserSearchStr !== userSearchStr) return
      if (res && !res.code) {
        const resDara = res.data.map((user: any) => ({
          value: user.screen_name,
          user
        }))
        setSearchData(resDara)
        setSearchFetching(false)
      } else {
        console.warn('[搜索失败]:', res.message)
        setSearchFetching(false)
        setSearchData([])
      }
    }())
  }

  /** 防抖的 */
  const debounceFetchUser = debounce(fetchUser, 800)

  /** 推特用户选择事件 */
  const handleUserSearchChange = (localValue: any) => {
    setSearchValue(localValue)
    setSearchData([])
    setSearchFetching(false)
    value = localValue
    onChange(localValue)
  }

  /** 推特用户搜索框用到的展示卡片 */
  function TwitterUserCard (props: any) {
    const { card } = props
    return (
      <StyledTwitterUserCard>
        <div className="twitter-avatar">
          <Avatar size={36} src={card.profile_image_url_https} />
        </div>
        <div className="twitter-main">
          <h4>
            { card.name }
          </h4>
          <p>
            @{ card.screen_name }
          </p>
        </div>
      </StyledTwitterUserCard>
    )
  }

  return (
    <Select
      size="large"
      labelInValue
      showSearch
      value={searchValue}
      placeholder="关注账户"
      notFoundContent={searchFetching ? <Spin size="small" /> : '没有此关键词的结果'}
      filterOption={false}
      onSearch={debounceFetchUser}
      onChange={handleUserSearchChange}
      style={{ width: '100%' }}
    >
      {searchData.map(d => (
        <Option key={d.value} value={undefined}>
          <TwitterUserCard card={d.user} />
        </Option>
      ))}
    </Select>
  )
}

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
