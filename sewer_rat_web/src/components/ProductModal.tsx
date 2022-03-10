import { useContext } from 'react'
import { Modal, Input, Button, Image, Text, useToasts } from '@geist-ui/react'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import { ShopContext } from '../pages/shop'
import chizShopAbi from '../data/chiz-shop-abi.json'
import useChizShop from '../hooks/useChizShop'
import { AppContext } from '../pages/_app'

export default function ProductModal({ open, data, hide }) {
    const wallet = useWallet()

    const { web3 } = useContext(AppContext)

    return (
        <Modal style={{ zIndex: 1000 }} width="900px" open={open} onClose={hide}>
            <Modal.Content>
                <div className="space-y-8 font-mono">
                    <div className="rounded-2xl overflow-hidden">
                        <img className="max-h-96 rounded-2xl mx-auto" src={data?.image} alt="" />
                    </div>
                    <div className="max-w-2xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1">
                            <p className="text-2xl font-extrabold">{data?.title}</p>
                            {data?.subtitle && <p className="opacity-50">{data?.subtitle}</p>}
                            {data?.description && <p className="opacity-50">{data?.description}</p>}
                        </div>
                        <p className="hidden">{JSON.stringify(data)}</p>
                        <div className="flex">
                            <Button
                                onClick={(e) => {
                                    e.preventDefault()
                                    data.buy()
                                }}
                                className="flex-1"
                            >
                                {wallet.account && data?.price ? `Buy Now ${web3.utils.fromWei(`${data?.price}`)}` : 'Connect Wallet'}
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal.Content>
        </Modal>
    )
}
