import { useWallet } from 'use-wallet'
import { motion } from 'framer-motion'
import NumberSuffix from 'number-suffix'
import { useEffect, useState } from 'react'
import useContracts from '../hooks/useContracts'

export default function ChizBox() {
    const wallet = useWallet()

    const [status, setStatus] = useState('idle')
    const [statusMessage, setStatusMessage] = useState('')

    const {
        dispenserContract,
        chizBalance,
        ratBalance,
        cheddazBalance,
        claimableRewards,
        dailyEarn,
        dispenserAmountClaimed,
        rewardPercentage
    } = useContracts()


    // const totalAirdrop = rewardPerRat * ratBalance - dispenserAmountClaimed
    // let totalAirdropWithBonus = totalAirdrop + (totalAirdrop * rewardPercentage) / 100
    // if (totalAirdropWithBonus < 0) totalAirdropWithBonus = 0
    // const yourAirdrop = totalAirdropWithBonus

    const claim = async () => {
        try {
            if (!wallet.account) return wallet.connect()
            setStatus('idle')
            await dispenserContract.methods.claimChizExt().estimateGas({ from: wallet.account })
            await dispenserContract.methods.claimChizExt().send({ from: wallet.account })
            setStatus('complete')
        } catch (error) {
            setStatus('error')
            setStatusMessage(error.message)
        }
    }

    return (
        <div className="flex-1 flex items-center justify-center bg-yellow-400 text-yellow-900 font-mono p-6">
            <div className="max-w-md w-full space-y-2">
                <motion.div initial={{ y: '-100%' }} animate={{ y: '0%' }} transition={{ type: 'tween', duration: 0.3 }} className="flex space-x-2">
                    <a href="/" className="border-emboss px-4 py-2 text-xs font-extrabold">
                        &larr; {wallet.account ? 'Logout' : 'Home'}
                    </a>
                    <p className="border-emboss px-4 py-2 text-xs font-extrabold flex-1 text-center bg-yellow-500">CHIZ WORLD BANK</p>
                </motion.div>

                <motion.div initial={{ y: '100%' }} animate={{ y: '0%' }} transition={{ type: 'tween', duration: 0.3 }} className="border-emboss bg-yellow-500 p-6 space-y-6">
                    <div className="grid">
                        <div className="text-xs">Welcome Back...</div>
                        {/* <p className="truncate">{wallet.account ? wallet.account : '#&$@%#@$&@#$&@'}</p> */}
                        <p className="truncate">{wallet.account ? wallet.account : 'Please connect your wallet to check balance'}</p>
                    </div>

                    <div className="space-y-2">
                        <p className="text-xs">Your Balances</p>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            <div className="border-deboss bg-black text-white p-2">
                                <p className="text-2xl">{ratBalance || '??'}</p>
                                <p className="text-xs">Rats</p>
                            </div>
                            <div className="border-deboss bg-black text-white p-2">
                                <p className="text-2xl">{rewardPercentage || '??'}%</p>
                                <p className="text-xs">Cheddaz bonus</p>
                            </div>
                            <div className="hidden sm:block border-deboss bg-black text-white p-2">
                                <p className="text-2xl">{dailyEarn ? `${Number(dailyEarn).toFixed(2)} CHIZ` : '??'}</p>
                                <p className="text-xs">Daily earn</p>
                            </div>
                        </div>
                    </div>
                    {
                        wallet.account && (
                            <div className="relative border-deboss bg-yellow-900 p-4 text-white">
                                {/* <div className="absolute right-0 top-0 transform -translate-x-2 -translate-y-1/2 bg-yellow-700 border-emboss text-xs animate-pulse">Updates weekly</div> */}

                                {/* <div className="mb-4">
                                    <p className="font-extrabold text-center">Claimable Rewards</p>
                                    <p className="text-xl">{rewardPerRat} CHIZ tokens per Rat</p>
                                    <p className="text-sm">+ bonus based on Cheddaz holding</p>
                                    <p className="text-xs">1 = 1%, 5 = 5%, 10 = 10%</p>
                                </div>

                                <div className="border-emboss p-2 bg-yellow-500 text-yellow-900 text-center mb-2">
                                    <p>Your Airdrop: {yourAirdrop} CHIZ</p>
                                </div> */}
                                <div className="mb-4">
                                    <p className="font-extrabold text-center">Claimable Rewards</p>
                                </div>
                                <div className="p-2 bg-yellow-800 text-white-900 text-center mb-2">
                                    <p>{claimableRewards} CHIZ</p>
                                </div>
                                <div className="flex">
                                    <div className="text-left">
                                        Claimed CHIZ for all time:
                                    </div>
                                    <div className="text-right flex-1">
                                    {dispenserAmountClaimed} CHIZ
                                    </div>
                                </div>
                                {/* {dispenserAmountClaimed != 0 && <p className="text-xs">CHIZ has already been claimed from {dispenserAmountClaimed} Rats in your wallet. You'll only recieve the difference of unclaimed CHIZ.</p>} */}
                            </div>
                        )
                    }
                    {status === 'error' && (
                        <div className="relative border-deboss bg-red-500 p-4 text-white overflow-scroll">
                            <p className="text-xs">{statusMessage}</p>
                        </div>
                    )}

                    <button className="p-2 text-xl w-full border-emboss uppercase font-extrabold bg-yellow-600" type="button" onClick={() => claim()}>
                        {wallet.account ? 'Claim Chiz' : 'Connect Wallet'}
                    </button>
                </motion.div>
            </div>
        </div>
        
    )
}
