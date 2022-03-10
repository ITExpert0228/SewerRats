import { Button, Input, useToasts } from '@geist-ui/react'
import classNames from 'classnames'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useDebounce } from 'use-debounce'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import CheezChart from '../components/CheezChart'
import CheezParticles from '../components/CheezParticles'
import Rat from '../components/Rat'
import abi from '../data/chiz-dispenser-abi.json'
import useContracts from '../hooks/useContracts'
import useRats from '../hooks/useRats'

export default function App() {
    const wallet = useWallet()

    const { rats, nextPage, previousPage, offset } = useRats(wallet.account)
    const { chizBalance: balance } = useContracts()
    const [, setToast] = useToasts()

    const [ratId, setRatId] = useState(0)
    const [status, setStatus] = useState('idle')

    const [ratLookup, setRatLookup] = useState(false)
    const [ratLookupDebounced] = useDebounce(ratLookup, 1000)

    const [isClaimed, setIsClaimed] = useState(false)

    // useEffect(() => setIsClaimed(false), [ratId])

    const getClaimStatus = async (tokenId) => {
        const web3 = new Web3(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL_ETH}`)
        const contract = await new web3.eth.Contract(abi as any, `${process.env.NEXT_PUBLIC_CHEEZ_DISPENSER_ADDRESS_ETH}`)
        const _isClaimed = await contract.methods.isClaimed(tokenId).call()
        return _isClaimed
    }

    useEffect(() => {
        if (!ratLookupDebounced) return
        const loadClaimStatus = async () => {
            const isSearchClaimed = await getClaimStatus(ratLookupDebounced)
            setIsClaimed(isSearchClaimed)
        }
        loadClaimStatus()
    }, [ratLookupDebounced])

    const [selectedRat, setSelectedRat] = useState([])

    const selectRatIds = selectedRat.map((rat) => rat.token_id)

    const addRat = (rat) => {
        setSelectedRat((_) => [..._, rat])
    }

    const removeRat = (rat) => {
        const filterOutRat = selectedRat.filter((ratInList) => ratInList.id !== rat.id)
        setSelectedRat(filterOutRat)
    }

    const toggleRat = (rat) => {
        const find = selectedRat.find((ratInList) => ratInList.id == rat.id)
        if (find) return removeRat(rat)
        addRat(rat)
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (ratId <= 3) {
                setRatId(ratId + 1)
            } else {
                setRatId(0)
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [ratId])

    const addTokenToMetaMask = async () => {
        const tokenAddress = process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS_ETH
        const tokenSymbol = 'CHIZ'
        const tokenDecimals = 18
        const tokenImage = 'http://app.sewerratsocial.club/img/cheez-token.png'

        try {
            // wasAdded is a boolean. Like any RPC method, an error may be thrown.
            const wasAdded = await ethereum.request({
                method: 'wallet_watchAsset',
                params: {
                    type: 'ERC20', // Initially only supports ERC20, but eventually more!
                    options: {
                        address: tokenAddress, // The address that the token is at.
                        symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
                        decimals: tokenDecimals, // The number of decimals in the token
                        image: tokenImage // A string url of the token logo
                    }
                }
            })

            if (wasAdded) {
                console.log('Thanks for your interest!')
            } else {
                console.log('Your loss!')
            }
        } catch (error) {
            console.log(error)
        }
    }

    const onSubmit = async () => {
        setStatus('loading')

        try {
            if (!wallet.account) {
                setStatus('idle')
                return wallet.connect()
            }
            const web3 = await new Web3(wallet.ethereum)
            web3.eth.handleRevert = true
            const contract = await new web3.eth.Contract(abi as any, `${process.env.NEXT_PUBLIC_CHEEZ_DISPENSER_ADDRESS_ETH}`)

            const gas = await contract.methods.multiClaimChiz(selectRatIds).estimateGas({ from: wallet.account })

            const claim = await contract.methods.multiClaimChiz(selectRatIds).send({ from: wallet.account })

            setStatus('complete')
        } catch (error) {
            console.log(error)
            setStatus('idle')
            setToast({ text: 'Error! Tokens may already be claimed for this rat(s).', type: 'error' })
        }
    }

    const megaClaimChiz = async () => {
        try {
            if (!wallet.account) {
                return wallet.connect()
            }
            const web3 = await new Web3(wallet.ethereum)
            web3.eth.handleRevert = true
            const contract = await new web3.eth.Contract(abi as any, `${process.env.NEXT_PUBLIC_CHEEZ_DISPENSER_ADDRESS_ETH}`)

            const gas = await contract.methods.megaClaimChiz().estimateGas({ from: wallet.account })

            const claim = await contract.methods.megaClaimChiz().send({ from: wallet.account })
        } catch (error) {
            console.log(error)
            setToast({ text: 'Error! Please try again in a few minutes. You may have already claimed all your rats.', type: 'error' })
        }
    }

    return (
        <>
            {status === 'complete' && (
                <div className="fixed bottom-0 z-10 w-full bg-cheese-rainbow ">
                    <div className="mx-auto font-mono max-w-5xl px-6 py-2 text-xs  md:text-base">
                        <p>Complete! You've claimed your tokens. {selectRatIds.length * 10000} CHIZ tokens will be sent to your address.</p>
                    </div>
                </div>
            )}
            <div className="fixed z-10 p-2">
                <Link href="/">
                    <a>
                        <img className="w-32" src="/img/logo.png" alt="" />
                    </a>
                </Link>
            </div>

            <div className="flex-1 bg-black flex justify-center">
                <div className="fixed inset-0 bg-center bg-cover " />
                {/* <div className="overlay bg-black bg-opacity-70 fixed inset-0" /> */}
                <CheezParticles />

                <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1] }} transition={{ delay: 1, duration: 1 }}>
                    <motion.div animate={{ y: ['0%', '1%', '0%'] }} transition={{ loop: Infinity, duration: 8 }} className="space-y-6 p-6 py-24 md:py-48">
                        <div className="flex justify-center">
                            <CheezChart />
                        </div>
                        <div className="max-w-5xl  w-full grid md:grid-cols-2 gap-6">
                            <div className="space-y-6">
                                <motion.div className="relative z-10 shadow-xl rounded-xl p-1 bg-cheese-rainbow">
                                    <div className="w-full bg-black text-white rounded-xl shadow-inner p-6 space-y-6">
                                        <Input value={ratLookup} onChange={(e) => setRatLookup(e.target.value)} label="Claim Checker" width="100%" placeholder="Enter a Rat ID" type="number" />
                                        {ratLookupDebounced && (
                                            <div>
                                                <p className="text-xs font-mono">
                                                    {isClaimed ? `CHIZ tokens have been claimed for Rat #${ratLookupDebounced}.` : `CHIZ tokens have not been claimed for Rat #${ratLookupDebounced}.`}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>

                                <motion.div className="relative z-10 shadow-xl rounded-xl p-1 bg-cheese-rainbow">
                                    <div className="w-full bg-black text-white rounded-xl shadow-inner p-6 space-y-6">
                                        <>
                                            <div className="flex">
                                                <Button auto onClick={megaClaimChiz} className="flex-1">
                                                    {wallet.account ? 'Claim All' : 'Connect Wallet'}
                                                </Button>
                                            </div>
                                            {!wallet.account && <p className="font-mono opacity-50 text-center">Connect your wallet to view your rats.</p>}
                                        </>
                                        {wallet.account && rats?.length <= 0 && <p className="font-mono opacity-50 text-center">No rats found.</p>}
                                        {rats?.length > 0 && (
                                            <div className="grid grid-cols-2 gap-6">
                                                {rats.map((rat, index) => (
                                                    <Rat rat={rat} toggleRat={toggleRat} selectRatIds={selectRatIds} getClaimStatus={getClaimStatus} />
                                                ))}
                                            </div>
                                        )}
                                        {wallet.account && (
                                            <div className="space-y-2">
                                                <div className="flex items-center justify-end space-x-2 text-xs font-mono">
                                                    {offset !== 0 && (
                                                        <Button onClick={() => previousPage()} size="mini">
                                                            Previous Page
                                                        </Button>
                                                    )}
                                                    <Button onClick={() => nextPage()} size="mini">
                                                        Next Page
                                                    </Button>
                                                </div>
                                                <div className="font-mono text-xs text-right">
                                                    {offset !== 0 && (
                                                        <p>
                                                            Showing {offset} - {offset + 50}
                                                        </p>
                                                    )}
                                                    {offset === 0 && <p>Showing 0 - 50</p>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            </div>
                            <div>
                                <motion.div className="relative z-10 shadow-xl rounded-xl p-1 bg-cheese-rainbow">
                                    <div className="w-full bg-black text-white rounded-xl shadow-inner p-6 space-y-6">
                                        <div className="bg-cheese-rainbow p-4 text-black rounded flex items-center space-x-4 font-mono text-xs">
                                            <p className="">CHIZ Token Balance</p>
                                            <div className="flex-1 block border border-black border-dotted" />
                                            <p>{balance}</p>
                                            <button type="button" onClick={() => addTokenToMetaMask()}>
                                                <img className="w-6 h-6" src="/img/metamask.svg" alt="" />
                                            </button>
                                        </div>
                                        <p className="font-mono">
                                            For every rat you own, you are entitled to claim 10,000 CHIZ tokens. CHIZ is the official currency of the Sewer Rat Social Club. It can be used for many things — from raffle
                                            tickets to exclusive NFTs.
                                        </p>

                                        <p className="block font-mono text-xs opacity-50">Once claimed, tokens for rats cannot be claimed again. You may see a ridiculously high gas fee on already claimed rats.</p>

                                        <div className="border-dotted border-2 rounded border-opacity-50">
                                            {selectedRat.length > 0 && (
                                                <>
                                                    <img className="block " src={selectedRat?.[0]?.image_url} alt="" />
                                                </>
                                            )}
                                            {selectedRat.length <= 0 && (
                                                <div className="h-32 grid place-items-center">
                                                    <p className="opacity-25 font-mono">Choose Rats</p>
                                                </div>
                                            )}
                                        </div>

                                        {selectRatIds.length >= 1 && <p className="block font-mono text-xs text-center">Claiming {selectRatIds.length * 10000} CHIZ.</p>}

                                        <div className="flex">
                                            <Button auto onClick={onSubmit} disabled={selectedRat.length <= 0} loading={status === 'loading'} className="flex-1" type="secondary">
                                                Claim Tokens
                                            </Button>
                                        </div>
                                        {status === 'loading' && <p className="opacity-50 font-mono text-xs">May take a while. You can close this page once submitted. You'll still get your CHIZ.</p>}
                                    </div>
                                </motion.div>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </>
    )
}
