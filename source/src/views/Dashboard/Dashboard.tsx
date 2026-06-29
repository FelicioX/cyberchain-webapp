import React, { FC, useState, useMemo, useCallback } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Farm } from '../../contexts/Farms'
import useAllStakedValue, { StakedValue } from '../../hooks/useAllStakedValue'
import useFarms from '../../hooks/useFarms'
import useSushi from '../../hooks/useSushi'
import { getEarned, getMasterChefContract } from '../../sushi/utils'
import { bnToDec } from '../../utils'
import useFarm from '../../hooks/useFarm'
import { provider } from 'web3-core'
import { getContract } from '../../utils/erc20'
import { getBalanceNumber } from '../../utils/formatBalance'
import useEarnings from '../../hooks/useEarnings'
import useStakedBalance from '../../hooks/useStakedBalance'
import useAllowance from '../../hooks/useAllowance'
import useApprove from '../../hooks/useApprove'
import useModal from '../../hooks/useModal'
import useTokenBalance from '../../hooks/useTokenBalance'
import useUnstake from '../../hooks/useUnstake'
import DepositModal from '../Farm/components/DepositModal'
import WithdrawModal from '../Farm/components/WithdrawModal'
import useStake from '../../hooks/useStake'
import useReward from '../../hooks/useReward'
import { getFullDisplayBalance } from '../../utils/formatBalance'
import WalletProviderModal from '../../components/WalletProviderModal'
import { getSushiAddress } from '../../sushi/utils'

interface FarmWithStakedValue extends Farm, StakedValue {
  apy: BigNumber
}
const Dashboard: FC = () => {
  const [farms] = useFarms()
  const { account } = useWallet()
  const stakedValue = useAllStakedValue()
  const [inputval, setInputVal] = useState('0.0000')
  const [onPresentWalletProviderModal] = useModal(<WalletProviderModal />)

  const sushiIndex = farms.findIndex(
    ({ tokenSymbol }) => tokenSymbol === 'SUSHI',
  )

  const sushiPrice =
    sushiIndex >= 0 && stakedValue[sushiIndex]
      ? stakedValue[sushiIndex].tokenPriceInWeth
      : new BigNumber(0)

  const BLOCKS_PER_YEAR = new BigNumber(2336000)
  const SUSHI_PER_BLOCK = new BigNumber(1000)

  const rows = farms.reduce<FarmWithStakedValue[][]>(
    (farmRows, farm, i) => {
      const farmWithStakedValue = {
        ...farm,
        ...stakedValue[i],
        apy: stakedValue[i]
          ? sushiPrice
              .times(SUSHI_PER_BLOCK)
              .times(BLOCKS_PER_YEAR)
              .times(stakedValue[i].poolWeight)
              .div(stakedValue[i].totalWethValue)
          : null,
      }
      const newFarmRows = [...farmRows]
      if (newFarmRows[newFarmRows.length - 1].length === 3) {
        newFarmRows.push([farmWithStakedValue])
      } else {
        newFarmRows[newFarmRows.length - 1].push(farmWithStakedValue)
      }
      return newFarmRows
    },
    [[]],
  )
  //APY start
  const getAPY: any = () => {
    let data: Array<any> = []
    if (rows[0].length) {
      rows.map((farmRow, i) => {
        farmRow.map((farm, j) => {
          data.push(
            // <span>
            //   {farm.apy
            //     ? `${farm.apy
            //         .times(new BigNumber(100))
            //         .toNumber()
            //         .toLocaleString('en-US')
            //         .slice(0, -1)}%`
            //     : 'Loading ...'}
            // </span>,
            <span>{farm.apy ? `15,000%` : 'Loading ...'}</span>,
          )
        })
      })
      return data
    }
  }
  //APY ends

  //Claim reward start
  interface RewardCardProps {
    farm: any
  }
  const RewardCard: React.FC<RewardCardProps> = ({ farm }) => {
    const { pid } = useFarm(farm.id) || {
      pid: 0,
      lpToken: '',
      lpTokenAddress: '',
      tokenAddress: '',
      earnToken: '',
      name: '',
      icon: '',
    }
    const [pendingTx, setPendingTx] = useState(false)
    const { onReward } = useReward(pid)
    const earnings = useEarnings(pid)
    return (
      <MainBodyDiv className="large col-w1">
        <MainBodyTitle>
          Reward <br /> {getBalanceNumber(earnings).toFixed(4)}
        </MainBodyTitle>
        <FlexCenter>
          <MainBodyButton
            onClick={async () => {
              setPendingTx(true)
              await onReward()
              setPendingTx(false)
            }}
            // disabled={!earnings.toNumber() || pendingTx}
          >
            Claim
          </MainBodyButton>
        </FlexCenter>
      </MainBodyDiv>
    )
  }
  const renderRewardCard: any = () => {
    let grid: Array<any> = []
    if (rows[0].length) {
      rows.map((farmRow, i) => {
        farmRow.map((farm, j) => {
          grid.push(<RewardCard farm={farm} />)
        })
      })
      return grid
    }
  }
  //Claim reward end

  //Approve start
  interface ApproveProps {
    farm: any
  }
  const ApproveButton: React.FC<ApproveProps> = ({ farm }) => {
    const { pid, lpToken, lpTokenAddress } = useFarm(farm.id) || {
      pid: 0,
      lpToken: '',
      lpTokenAddress: '',
      tokenAddress: '',
      earnToken: '',
      name: '',
      icon: '',
    }
    const { ethereum } = useWallet()
    const stakedBalance = useStakedBalance(pid)

    const lpContract = useMemo(() => {
      return getContract(ethereum as provider, lpTokenAddress)
    }, [ethereum, lpTokenAddress])

    const [requestedApproval, setRequestedApproval] = useState(false)

    const allowance = useAllowance(lpContract)
    const { onApprove } = useApprove(lpContract)

    const { onUnstake } = useUnstake(pid)

    const [onPresentWithdraw] = useModal(
      <WithdrawModal
        max={stakedBalance}
        onConfirm={onUnstake}
        tokenName={lpToken.toUpperCase()}
      />,
    )

    const handleApprove = useCallback(async () => {
      try {
        setRequestedApproval(true)
        const txHash = await onApprove()
        // user rejected tx or didn't go thru
        if (!txHash) {
          setRequestedApproval(false)
        }
      } catch (e) {
        console.log(e)
      }
    }, [onApprove, setRequestedApproval])
    return (
      <MainBodyButton
        style={{ marginBottom: 50 }}
        // disabled={requestedApproval}
        onClick={handleApprove}
      >
        Approve
      </MainBodyButton>
      // <div className="column">
      //   <a href="#" className="text">
      //     {getBalanceNumber(stakedBalance).toFixed(4)}
      //   </a>
      //   <div className="bottom">
      //     {!allowance.toNumber() ? (
      //       <button
      //         className="btn1"
      //         disabled={requestedApproval}
      //         onClick={handleApprove}
      //         style={{
      //           fontWeight: 'bold',
      //         }}
      //       >
      //         APPROVE
      //       </button>
      //     ) : (
      //       <>
      //          <button
      //           className="btn1"
      //           disabled={stakedBalance.eq(new BigNumber(0))}
      //           onClick={onPresentWithdraw}
      //           style={{
      //             fontWeight: 'bold',
      //           }}
      //         >
      //           UNSTAKE
      //         </button>
      //       </>
      //     )}
      //   </div>
      // </div>
    )
  }
  const renderApproveButton: any = () => {
    let data: Array<any> = []
    if (rows[0].length) {
      rows.map((farmRow, i) => {
        farmRow.map((farm, j) => {
          data.push(<ApproveButton farm={farm} />)
        })
      })
      return data
    }
  }
  //Approve end

  //Max Button start
  interface MaxButtonProps {}
  const MaxButton: React.FC<MaxButtonProps> = () => {
    const { pid, lpToken, lpTokenAddress } = useFarm(
      'FUTURAMA-ETH UNI-V2 LP',
    ) || {
      pid: 0,
      lpToken: '',
      lpTokenAddress: '',
      tokenAddress: '',
      earnToken: '',
      name: '',
      icon: '',
    }
    const { ethereum } = useWallet()
    const lpContract = useMemo(() => {
      return getContract(ethereum as provider, lpTokenAddress)
    }, [ethereum, lpTokenAddress])
    const tokenBalance = useTokenBalance(lpContract.options.address)
    const fullBalance = useMemo(() => {
      return getFullDisplayBalance(tokenBalance)
    }, [tokenBalance])
    const handleSelectMax = useCallback(() => {
      setInputVal(fullBalance)
    }, [fullBalance, setInputVal])
    return (
      <MainBodyButton onClick={() => handleSelectMax()}>Max</MainBodyButton>
    )
  }
  //Max Button end

  //Stake Button start
  interface StakeButtonProps {}
  const StakeButton: React.FC<StakeButtonProps> = () => {
    const { pid, lpToken, lpTokenAddress } = useFarm(
      'FUTURAMA-ETH UNI-V2 LP',
    ) || {
      pid: 0,
      lpToken: '',
      lpTokenAddress: '',
      tokenAddress: '',
      earnToken: '',
      name: '',
      icon: '',
    }
    const { ethereum } = useWallet()
    const lpContract = useMemo(() => {
      return getContract(ethereum as provider, lpTokenAddress)
    }, [ethereum, lpTokenAddress])
    const [pendingTx, setPendingTx] = useState(false)
    const { onStake } = useStake(pid)
    const tokenBalance = useTokenBalance(lpContract.options.address)
    const fullBalance = useMemo(() => {
      return getFullDisplayBalance(tokenBalance)
    }, [tokenBalance])
    const handleSelectMax = useCallback(() => {
      setInputVal(fullBalance)
    }, [fullBalance, setInputVal])
    return (
      <MainBodyButton  disabled={pendingTx}
      onClick={async () => {
        setPendingTx(true)
        await onStake(inputval)
        setPendingTx(false)
      }}>Stake</MainBodyButton>
    )
  }
  //Stake Button end

  //Stake number start
  interface StakeNumberProps {
    farm: any
  }
  const StakeNumber: React.FC<StakeNumberProps> = ({ farm }) => {
    const { pid } = useFarm(farm.id) || {
      pid: 0,
      lpToken: '',
      lpTokenAddress: '',
      tokenAddress: '',
      earnToken: '',
      name: '',
      icon: '',
    }
    const earnings = useEarnings(pid)
    return (
        <span>
        {getBalanceNumber(earnings).toFixed(4)}
        </span>
    )
  }
  const renderStakeNumber: any = () => {
    let grid: Array<any> = []
    if (rows[0].length) {
      rows.map((farmRow, i) => {
        farmRow.map((farm, j) => {
          grid.push(<StakeNumber farm={farm} />)
        })
      })
      return grid
    }
  }
  //Stake number end
  const sushi = useSushi()
  const sushiBalance = useTokenBalance(getSushiAddress(sushi))
  return (
    <Wrapper>
      <InnerWrapper>
        <Sidebar>
          <LogoWrapper>
            <Logo src="/logo.png" />
          </LogoWrapper>
          <MenuWrapper>
            <SidebarButtons to="">
              <SidebarButtonsImg src="/twitter.png" /> Farm
            </SidebarButtons>
            <SidebarButtons to="">
              <SidebarButtonsImg src="/twitter.png" /> Buy Now
            </SidebarButtons>
            <SidebarButtons to="">
              <SidebarButtonsImg src="/twitter.png" /> Twitter
            </SidebarButtons>
            <SidebarButtons to="">
              <SidebarButtonsImg src="/twitter.png" /> Telegram
            </SidebarButtons>
          </MenuWrapper>
          <BottomWrapper>
            <SidebarButtonsLink to="">cyberchain.finance</SidebarButtonsLink>
          </BottomWrapper>
        </Sidebar>
        <MainBody>
          <FlexRow>
            <MainBodyDiv>
              <MainBodyTitle>Balance <br /> {getBalanceNumber(sushiBalance).toFixed(4)}</MainBodyTitle>
            </MainBodyDiv>
            <MainBodyDiv>
              <MainBodyTitle>
                APY <br />
                {getAPY()}
              </MainBodyTitle>
            </MainBodyDiv>
            <MainBodyDiv>
              <MainBodyTitle>
                Animated <br /> version
              </MainBodyTitle>
            </MainBodyDiv>
          </FlexRow>
          <FlexRow>
            {renderRewardCard()}
            <MainBodyDiv className="large col-w2">
              <MainBodyTitle>
                {renderStakeNumber()}
              </MainBodyTitle>
              <FlexSpaced>
                <MaxButton />
                {renderApproveButton()}
                <StakeButton />
              </FlexSpaced>
            </MainBodyDiv>
          </FlexRow>
        </MainBody>
      </InnerWrapper>
    </Wrapper>
  )
}

export default Dashboard

// wrapppers
const Wrapper = styled.div`
  background-color: #0f0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  overflow: hidden;
`
const InnerWrapper = styled.div`
  background-color: #f00;
  width: 100%;
  height: 100%;
  margin-top: 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
`

// Sidebar
const Sidebar = styled.div`
  width: 300px;
  height: 100%;
  background-color: #fff;
  background-image: linear-gradient(to right, #58dcf3, #608ddd);
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  flex-direction: column;
`
const LogoWrapper = styled.div`
  padding: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 1px solid #70f2f2;
  width: 230px;
`
const Logo = styled.img`
  width: 130px;
  height: 130px;
`
const MenuWrapper = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: cneter;
  padding: 15px 0px;
  width: 100%;
`

const SidebarButtons = styled(Link)`
  height: 50px;
  background-color: #000;
  margin: 10px 0px 10px 15px;
  border-radius: 10px 0 0px 10px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  padding: 5px 15px;
  text-decoration: none;
  color: #5a0061;
  text-transform: uppercase;
  font-weight: 700;
  font-size: 18px;
  background-image: linear-gradient(to right, #58dcf3, #608ddd);
  box-shadow: 3px 0px 15px 0px #5a086755;
  width: 100%;
`

const SidebarButtonsImg = styled.img`
  width: 45px;
  height: 45px;
  margin-right: 10px;
`

const BottomWrapper = styled.div`
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #70f2f2;
  width: 260px;
`

const SidebarButtonsLink = styled(Link)`
  color: #5a0061;
  font-weight: 700;
  font-size: 18px;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  width: 100%;
`

// Mainbody
const MainBody = styled.div`
  flex: 1;
  height: 100%;
  background-color: #000;
  background-image: linear-gradient(to bottom right, #406a87, #322574);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding: 50px;
`

const FlexRow = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  width: 100%;
`
const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
`
const FlexSpaced = styled.div`
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  width: 100%;
`

const MainBodyDiv = styled.div`
  flex: 1;
  margin: 30px;
  height: 15vh;
  background-color: #000;
  border-radius: 10px;
  border: 3px solid #99e9ff;
  background-image: linear-gradient(to right, #58dcf3, #608ddd);
  box-shadow: 0px 0px 11px 0px #0004;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
  padding: 15px;

  &.large {
    height: 50vh;
    justify-content: space-between;
  }

  &.col-w2 {
    flex: 2;
  }
`

const MainBodyTitle = styled.h1`
  color: #5a0061;
  font-weight: 700;
  font-size: 30px;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  width: 100%;
`
const MainBodyButton = styled.button`
  color: #5a0061;
  font-weight: 700;
  font-size: 25px;
  text-transform: uppercase;
  text-decoration: none;
  text-align: center;
  border: 3px solid #99e9ff;
  background-image: linear-gradient(to right, #58dcf3, #608ddd);
  box-shadow: 0px 0px 11px 0px #0004;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 5px 15px;
  height: 60px;
  margin: 10px 15px;
  border-radius: 5px;
  width: 150px;
  cursor: pointer;
`
