import React, { useCallback } from 'react'
import styled from 'styled-components'
import { useWallet } from 'use-wallet'
import useModal from '../../../hooks/useModal'
import Button from '../../Button'
import WalletProviderModal from '../../WalletProviderModal'
import AccountModal from './AccountModal'

interface AccountButtonProps {}

const AccountButton: React.FC<AccountButtonProps> = (props) => {
  const [onPresentAccountModal] = useModal(<AccountModal />)
  const [onPresentWalletProviderModal] = useModal(
    <WalletProviderModal />,
    'provider',
  )

  const { account } = useWallet()

  const handleUnlockClick = useCallback(() => {
    onPresentWalletProviderModal()
  }, [onPresentWalletProviderModal])

  return (
    <StyledAccountButton>
      {!account ? (
        <StyledButton onClick={handleUnlockClick}>Unlock Wallet</StyledButton>
      ) : (
        <StyledButton onClick={onPresentAccountModal}>My Wallet</StyledButton>
      )}
    </StyledAccountButton>
  )
}

const StyledAccountButton = styled.div``

const StyledButton = styled.button`
  outline: none;
  border-radius: 8px;
  border: 2px solid #FFFFFF;
  background-color: transparent;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  padding: 0 28px;
  box-sizing: border-box;
  height: 40px;
  cursor: pointer;
  white-space: nowrap;
  @media screen and (max-width: 576px) {
    padding: 0 10px;
  }
`

export default AccountButton
