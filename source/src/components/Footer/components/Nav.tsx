import React from 'react'
import styled from 'styled-components'

const Nav: React.FC = () => {
  return (
    <StyledNav>
    <StyledLink
        target="_blank"
        href="https://etherscan.io/token/0xd413a77ea07747fa9ea7bcc1888edd51815eade4"
    >
        CYBER Contract
    </StyledLink>
      <StyledLink
        target="_blank"
        href="https://etherscan.io/address/0x65b9dd8073bc7d0fddaac6631520078c51d0c0be#code"
      >
        MasterChef Contract
      </StyledLink>
      <StyledLink
        target="_blank"
        href="https://uniswap.info/pair/0x08FA2C5a034AfC118C4E6448902c6e29526B9ad6"
      >
        Uniswap CYBER-ETH
      </StyledLink>
    </StyledNav>
  )
}

const StyledNav = styled.nav`
  align-items: center;
  display: flex;
`

const StyledLink = styled.a`
  color: ${(props) => props.theme.color.grey[400]};
  padding-left: ${(props) => props.theme.spacing[3]}px;
  padding-right: ${(props) => props.theme.spacing[3]}px;
  text-decoration: none;
  &:hover {
    color: ${(props) => props.theme.color.grey[500]};
  }
`

export default Nav
