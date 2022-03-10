import { Button, Input, useToasts } from '@geist-ui/react'
import { useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { motion } from 'framer-motion'
import Web3 from 'web3'
import Link from 'next/link'
import _abi from '../data/rat-abi.json'
import { contractAddress, web3 } from '../utils/web3'
import FixedLogo from '../components/FixedLogo'

export const abi = _abi as any

export default function App() {
    const wallet = useWallet()

    const [, setToast] = useToasts()
    const [ratId, setRatId] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [mint, setMint] = useState(null)
    const [status, setStatus] = useState('idle')

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

    const total = web3.utils.toWei((quantity * 0.05).toString())

    const onSubmit = async () => {
        setStatus('loading')
        try {
            if (!wallet.account) return wallet.connect()

            const web3 = await new Web3(wallet.ethereum)
            const contract = new web3.eth.Contract(abi, contractAddress)

            const encodedContractCall = await contract.methods.mintSewerRat(wallet.account, quantity).send({
                from: wallet.account,
                value: total
            })

            setToast({ text: 'Success! Your rat has been minted. Check Etherscan or OpenSea.' })
        } catch (error) {
            console.log(error)
            setToast({ text: 'Error! Did you deny the transaction?', type: 'error' })
        }
        setStatus('idle')
    }

    useEffect(() => {
        const loadData = async () => {
            const _web3 = await new Web3(`${process.env.NEXT_PUBLIC_WEBSOCKET_URL_ETH}`)
            const contract = new _web3.eth.Contract(abi, contractAddress)
            const totalySupply = await contract.methods.totalSupply().call()
            setMint(totalySupply)
        }
        loadData()
    }, [])

    return (
        <>
            <FixedLogo />

            <div className="bg-center bg-cover flex-1 flex items-center justify-center p-6 py-24 md:py-48" style={{ backgroundImage: 'url(/img/og-image.jpg)' }}>
                <div className="overlay bg-black bg-opacity-70 absolute inset-0" />
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: [0, 1] }} transition={{ delay: 1, duration: 1 }}>
                    <motion.div animate={{ y: ['0%', '1%', '0%'] }} transition={{ loop: Infinity, duration: 3 }} className="relative  shadow-xl rounded-xl p-1 bg-rainbow">
                        <div className="max-w-md w-full bg-black text-white rounded-xl shadow-inner p-6">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault()
                                    onSubmit()
                                }}
                                className="space-y-2"
                            >
                                <p className="text-3xl font-extrabold">Join the Rat Club. Mint a rat before they're gone.</p>
                                <div className="h-80 bg-bottom bg-cover" style={{ backgroundImage: `url(/img/rats/meme-${ratId}.png)` }} />
                                {/* <img className="w-full mx-auto" src={``} alt="" /> */}
                                <Input
                                    size="large"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value > 0 && e.target.value <= 15 ? e.target.value : 1)}
                                    width="100%"
                                    label="Quantity"
                                    placeholder="Enter a quantity"
                                    type="number"
                                />
                                <div className="flex">
                                    <Button auto htmlType="submit" size="large" className="flex-1">
                                        {wallet.account ? `Purchase ${quantity} Rats` : 'Connect Wallet'}
                                    </Button>
                                </div>
                                <p className="text-xs text-center opacity-25">
                                    remaining supply: {8888 - mint} / 8888 | total: {web3.utils.fromWei(total)} ETH
                                </p>
                            </form>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </>
    )
}
