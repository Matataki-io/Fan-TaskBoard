import React, { useState } from 'react'
import styled from 'styled-components'
import { Input, AutoComplete, Avatar } from 'antd'
import { SelectProps } from 'antd/es/select';
import { isEmpty } from 'lodash';

import { getTokenList } from '../../../api/api';

interface SearchTokenProps {
  setSearchTokenFn: (tokenId: string|number) => void
}

const SearchToken: React.FC<SearchTokenProps> = ({ setSearchTokenFn }) => {
  const [tokenList, setTokenList] = useState<any[]>([])
  const [options, setOptions] = useState<SelectProps<object>['options']>([]);

  const searchTokenResult = async (query: string) => {

    // 没有 query 或者清除
    if (!query) {
      setOptions([])
      setSearchTokenFn('')
      return
    }

    // 获取token列表
    const getData = async () => {
      const res: any = await getTokenList(1, 5, query)
      if (res.code === 0) {
        return res.data.list
      }
      return []
    }

    const list: any = await getData()
    // console.log('list', list)
    setTokenList(list)
    const listOptions = list.map((item: any, idx: number) => {
        return {
          value: item.symbol,
          label: (
            <div
              style={{
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Avatar size={28} src={ item.logo ? process.env.REACT_APP_MTTK_IMG_CDN + item.logo : ''} />
              <span style={{ marginLeft: 6, fontSize: 14, color:'#333' }}>
                { item.name }
                <span style={{ color:'#949494' }}>({ item.symbol })</span>
              </span>
            </div>
          ),
        };
      });
      setOptions(listOptions)
  };

  // 搜索token
  const handleSearchToken = (value: string) => {
    searchTokenResult(value)
  };

  // 搜索token后选择结果
  const handleSearchTokenSelect = (value: string) => {
    const selectToken = tokenList.find((i: any) => i.symbol === value)
    // console.log('handleSearchTokenSelect', value, selectToken);
    if (!isEmpty(selectToken) && selectToken.id) {
      setSearchTokenFn(selectToken.id)
    }
  };

  return (
    <AutoComplete
    dropdownMatchSelectWidth={200}
    style={{ width: 200 }}
    options={options}
    onSelect={handleSearchTokenSelect}
    onSearch={handleSearchToken}
  >
    <Input.Search placeholder="搜索特定Fan票奖励下的任务" enterButton allowClear />
  </AutoComplete>
  )
}

export default SearchToken