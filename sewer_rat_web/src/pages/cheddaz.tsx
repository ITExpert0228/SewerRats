import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import Typed from 'react-typed'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { useDebounce } from 'use-debounce'
import cheddazAbi from '../data/cheddaz-abi.json'
import ratAbi from '../data/rat-abi.json'

export default function Cheddaz() {
    const wallet = useWallet()
    const web3 = new Web3(wallet.ethereum)
    const contract = new web3.eth.Contract(cheddazAbi as any, '0xB796485fE35C926328914cD4CD9447D095d41F7f')
    const ratContract = new web3.eth.Contract(ratAbi as any, `${process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS_ETH}`)

    const [status, setStatus] = useState('idle')
    const [tab, setTab] = useState<'chiz' | 'claim' | 'check'>('claim')

    const [amount, setAmount] = useState(0)
    const [checkInput, setCheckInput] = useState(null)
    const [check] = useDebounce(checkInput, 1000)
    const [claimed, setClaimed] = useState(null)
    const [chizClaimed, setChizClaimed] = useState(null)

    useEffect(() => {
        const onRun = async () => {
            try {
                if (!check) return
                const isMinted = await contract.methods.isMinted(Number(check)).call()
                setClaimed(isMinted)
            } catch (error) {
                console.log(error)
            }
        }
        onRun()
    }, [check])

    const claim = async () => {
        setStatus('loading')
        try {
            if (!wallet.account) {
                setStatus('idle')
                return wallet.connect()
            }

            const ratBalance = await ratContract.methods.balanceOf(wallet.account).call()

            const total = amount || ratBalance
            await contract.methods.mintCheddaz(0, total).estimateGas({ from: wallet.account })
            await contract.methods.mintCheddaz(0, total).send({ from: wallet.account })
            setStatus('idle')
        } catch (error) {
            setStatus('error')
            console.log(error)
        }
    }

    return (
        <>
            <div className="fixed inset-0 overflow-hidden">
                <video autoPlay loop muted playsInline className="object-cover h-screen w-screen fixed top-0 left-0" poster="/img/cheddazz.png">
                    <source src="/img/gas-station.MP4" type="video/mp4" />
                </video>
            </div>

            <div className="relative flex-1 flex p-6 transition ease-in-out duration-150 justify-end items-end overflow-hidden">
                <motion.div initial={{ x: '100%' }} animate={{ x: '0%' }} className="border-emboss max-w-md w-full bg-yellow-400 text-black p-6 font-mono">
                    <div className="space-y-4">
                        <div className="flex space-x-4 text-xs">
                            <p className="font-bold">Cheddaz Tool</p>
                            <div className="flex-1" />
                            {/* <button type="button" onClick={() => setTab('chiz')} className={tab === 'chiz' && 'underline'}>
                                Chiz
                            </button> */}
                            <button
                                type="button"
                                onClick={() => {
                                    setTab('claim')
                                    setCheckInput(0)
                                }}
                                className={tab === 'claim' && 'underline'}
                            >
                                Claimer
                            </button>
                            <button type="button" onClick={() => setTab('check')} className={tab === 'check' && 'underline'}>
                                Checker
                            </button>
                        </div>

                        {tab === 'chiz' && (
                            <>
                                <button className="p-2 text-xl w-full border-emboss uppercase font-extrabold bg-yellow-600" type="button" onClick={() => claim()}>
                                    {wallet.account ? 'Claim Chiz' : 'Connect Wallet'}
                                </button>

                                <p className="text-xs font-bold">
                                    Each Cheddaz you hold entitles you to XXX Chiz. Use the button above to claim it! You can check if the Chiz for a specific Cheddaz has been claimed below.
                                </p>

                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <input type="number" className="w-8 md:w-20 border-deboss bg-white p-1 px-2" value={checkInput} onChange={(e) => setCheckInput(e.target.value)} />
                                    </div>
                                    <div className="p-2 text-xl w-full border-deboss uppercase font-extrabold bg-yellow-500">???</div>
                                </div>
                            </>
                        )}

                        {tab === 'claim' && (
                            <>
                                <div className="flex space-x-4">
                                    <div className="flex items-center">
                                        <p className="whitespace-nowrap">0 -&nbsp;</p>
                                        <input type="number" className="w-8 md:w-20 border-deboss bg-white p-1 px-2" value={amount} onChange={(e) => setAmount(e.target.value)} />
                                    </div>
                                    <button className="p-2 text-xl w-full border-emboss uppercase font-extrabold bg-yellow-600" type="button" onClick={() => claim()}>
                                        {wallet.account ? `Claim ${amount === '0' || !amount ? 'All' : `0-${amount}`}` : 'Connect Wallet'}
                                    </button>
                                </div>

                                <p className="text-xs font-bold">Cheedaz are available for free (0 ETH + gas fees) for members of the Sewer Rat Social Club to claim. Each Rat parent needs a Rat companion.</p>

                                {status === 'idle' && (
                                    <p className="text-xs opacity-50">
                                        Enter 0 to claim all rats at once. If you've already claimed some rats, be sure to enter a number higher than your first claimed amount or you could lose gas. May take a while to
                                        confirm. Please be patient.
                                    </p>
                                )}

                                {status === 'loading' && (
                                    <p className="text-xs opacity-50">
                                        <Typed strings={['Loading...']} loop typeSpeed={40} />
                                    </p>
                                )}

                                {status === 'error' && <p className="text-xs  text-red-500">An erorr occurred! Make sure you are connected to Ethereum Mainnet using an account that holds rats.</p>}

                                {status === 'complete' && <p className="text-xs  text-green-800">Hooray! Your Cheddaz(s) have been sent to you!</p>}
                            </>
                        )}

                        {tab === 'check' && (
                            <>
                                {!wallet.account && (
                                    <button className="p-2 text-xl w-full border-emboss uppercase font-extrabold bg-yellow-600" type="button" onClick={() => wallet.connect()}>
                                        Connect Wallet
                                    </button>
                                )}

                                {wallet.account && <input placeholder="0-8887" type="number" className="w-full border-deboss bg-white p-1 px-2" value={checkInput} onChange={(e) => setCheckInput(e.target.value)} />}

                                {claimed === false && (
                                    <>
                                        <p className="text-xs font-bold">The Chedda companion for this rat has NOT been claimed. You can claim it if you own Rat #{check}.</p>

                                        {/* <button className="p-2 text-xl w-full border-emboss uppercase font-extrabold bg-yellow-600" type="button" onClick={() => claim()}>
                                            Claim Rat #{check}
                                        </button> */}
                                    </>
                                )}

                                {claimed === true && <p className="text-xs font-bold">The Chedda companion for Rat #{check} has been claimed.</p>}

                                {claimed === null && (
                                    <p className="text-xs font-bold">Check if the companion Cheedaz to any specific Rat has been minted. If it hasn't been minted, and you own the Rat, you can claim it.</p>
                                )}
                            </>
                        )}
                    </div>
                </motion.div>
            </div>
        </>
    )
}
