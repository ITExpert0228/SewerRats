import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import NumberSuffix from 'number-suffix'
import erc20 from '../data/rinkeby/erc20-abi.json'
import erc721 from '../data/rinkeby/erc721-abi.json'
import dispenserAbi from '../data/rinkeby/chiz-dispenser-v4-abi.json'

export default function useContracts() {
    const wallet = useWallet()
    const web3 = new Web3(wallet.account ? wallet.ethereum : process.env.NEXT_PUBLIC_WEBSOCKET_URL_ETH)

    const chizContract = new web3.eth.Contract(erc20 as any, `${process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS_ETH}`)

    const ratContract = new web3.eth.Contract(erc721 as any, `${process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS_ETH}`)

    const cheddazContract = new web3.eth.Contract(erc721 as any, `${process.env.NEXT_PUBLIC_CHEDDAZ_CONTRACT_ETH}`)

    const dispenserContract = new web3.eth.Contract(dispenserAbi as any, `${process.env.NEXT_PUBLIC_CHIZ_DISPENSER_V3_ADDRESS_ETH}`)

    const [chizBalance, setChizBalance] = useState(0)
    const [ratBalance, setRatBalance] = useState(0)
    const [cheddazBalance, setCheddazBalance] = useState(0)
    const [claimableRewards, setClaimableRewards] = useState(0)
    const [dailyEarn, setDailyEarn] = useState(0)
    const [dispenserAmountClaimed, setDispenserAmountClaimed] = useState(0)
    const [rewardPercentage, setRewardPercentage] = useState(0)

    useEffect(() => {
        const loadData = async () => {
            if (!wallet.account) return

            const chizBalanceFromWeb3 = await chizContract.methods.balanceOf(wallet.account).call({ xfrom: wallet.account })
            setChizBalance(web3.utils.fromWei(chizBalanceFromWeb3))

            const ratBalanceFromWeb3 = await ratContract.methods.balanceOf(wallet.account).call()
            setRatBalance(ratBalanceFromWeb3)

            const cheddazBalanceFromWeb3 = await cheddazContract.methods.balanceOf(wallet.account).call()
            setCheddazBalance(cheddazBalanceFromWeb3)

            //Interacts with dispenserContract
            const userClaimedERC20AmountFromWeb3 = await dispenserContract.methods.userClaimedERC20Amount(wallet.account).call()
            const dailyEarnfromWeb3  =  await dispenserContract.methods.dailyEarn(wallet.account).call()
            const claimableRewardsfromWeb3 = await dispenserContract.methods.claimableRewards(wallet.account).call()
            const rewardPercentagefromWeb3 = await dispenserContract.methods.rewardPercentage(wallet.account).call()
            
            setDispenserAmountClaimed(web3.utils.fromWei(userClaimedERC20AmountFromWeb3))
            setClaimableRewards(web3.utils.fromWei(claimableRewardsfromWeb3))
            setDailyEarn(web3.utils.fromWei(dailyEarnfromWeb3))
            setRewardPercentage(rewardPercentagefromWeb3)
        }

        loadData()
    }, [wallet, ratBalance])

    return {
        chizContract,
        ratContract,
        cheddazContract,
        dispenserContract,
        chizBalance,
        ratBalance,
        cheddazBalance,
        claimableRewards,
        dailyEarn,
        dispenserAmountClaimed,
        rewardPercentage
    }
}
