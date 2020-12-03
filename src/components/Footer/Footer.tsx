import React from 'react'
import styled from 'styled-components'

// import Nav from './components/Nav'
import logo from "../../assets/img/logo.png";
import logoText from "../../assets/img/logo-text.png";

const Footer: React.FC = () => (
  <StyledFooter>
    {/* <StyledFooterInner>
      <Nav />
    </StyledFooterInner> */}

    <StyledFooterContainer>
      <div>
        <StyledFooterLogo>
          <img className="logo" src={logo} alt="logo" aria-label="logo" />
          <img className="logo-text" src={logoText} alt="logo" aria-label="logo" />
        </StyledFooterLogo>
        <StyledFooterCopyright>© 2020 MATATAKI QUEST All Rights Served </StyledFooterCopyright>
      </div>

      <StyledFooterUlContent>
        <StyledFooterUl>
          <li>
            <a href="https://github.com/Matataki-io/Matataki-NFT" rel="noopener noreferrer" target="_blank">Github</a>
          </li>
          <li>
            <a href="https://rinkeby.etherscan.io/address/0x97e895Faa51feaE17BBbBAb7eBA4248ACbf6F0Ae" rel="noopener noreferrer" target="_blank">Contract</a>
          </li>
        </StyledFooterUl>
      </StyledFooterUlContent>
    </StyledFooterContainer>
  </StyledFooter>
)

const StyledFooter = styled.footer`
  background-color: #333;
`
const StyledFooterContainer = styled.footer`
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-sizing: border-box;
  @media screen and (max-width: 576px) {
    padding-left: 10px;
    padding-right: 10px;
  }
`
// const StyledFooterInner = styled.div`
//   align-items: center;
//   display: flex;
//   justify-content: center;
//   height: ${props => props.theme.topBarSize}px;
//   max-width: ${props => props.theme.siteWidth}px;
//   width: 100%;
// `

const StyledFooterLogo = styled.div`
  display: flex;
  align-items: center;
  /* justify-content: center; */
  margin-bottom: 10px;
  .logo {
    height: 30px;
  }
  .logo-text {
    height: 18px;
    margin: 0 0 0 12px;
    @media screen and (max-width: 576px) {
      height: 10px;
      margin-left: 4px;
    }
  }
`
const StyledFooterCopyright = styled.p`
  font-size: 14px;
  font-weight: 500;
  color: #FFFFFF;
  line-height: 20px;
  padding: 0;
  margin: 0;
  @media screen and (max-width: 576px) {
    font-size: 12px;
  }
`
const StyledFooterUlContent = styled.div`
  display: flex;
`
const StyledFooterUl = styled.ul`
  padding: 0;
  margin: 0;
  list-style: none;
  li {
    font-size: 16px;
    font-weight: 500;
    color: #FFFFFF;
    line-height: 22px;
    margin: 16px 0;
    @media screen and (max-width: 576px) {
      font-size: 12px;
    }
    a {
      color: #FFFFFF;
      text-decoration: none;
    }
  }
`


export default Footer