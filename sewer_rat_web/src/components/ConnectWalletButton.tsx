import { Button, useToasts } from '@geist-ui/react'
import { useEffect } from 'react'
import { useWallet } from 'use-wallet'

export default function ConnectWalletButton() {
    const wallet = useWallet()

    const [, setToasts] = useToasts()

    const shortAddress = wallet.account ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-6)}` : null

    useEffect(() => {
        if (wallet.status === 'error') setToasts({ text: 'There was error while connecting to your wallet. Are you connected to the Fantom Chain?', type: 'error' })
    }, [wallet])

    return (
        <div>
            <Button onClick={() => wallet.connect()} auto size="small" type={wallet.status === 'error' ? 'error' : 'default'}>
                {shortAddress || 'Connect Wallet'}
            </Button>
        </div>
    )
}
