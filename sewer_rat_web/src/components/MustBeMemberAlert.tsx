import { useEffect, useState } from 'react'
import { Modal } from '@geist-ui/react'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import abi from '../data/rat-abi.json'

export default function MustBeMemberAlert() {
    const wallet = useWallet()

    const [status, setStatus] = useState<'unknown' | 'confirmed' | 'denied'>('unknown')

    useEffect(() => {
        const loadData = async () => {
            if (!wallet.account || status !== 'unknown') return
            const web3 = await new Web3(wallet.ethereum)
            const contract = await new web3.eth.Contract(abi as any, process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS_ETH)
            const balance = await contract.methods.balanceOf(wallet.account).call()

            if (balance >= 1) return setStatus('confirmed')
            return setStatus('denied')
        }
        loadData()
    }, [wallet, status])

    return (
        <Modal open={status === 'denied'}>
            <Modal.Content>
                <div className="space-y-2">
                    <p className="text-4xl font-extrabold">You are not a Sewer Rat Social Club member.</p>
                    <p className="font-mono">We're sorry, but this store is availalbe exclusively to Sewer Rat Social Club members.</p>
                    <p className="font-mono">To join the club, you'll need to mint a rat.</p>
                </div>
            </Modal.Content>
        </Modal>
    )
}
