import { Button, Loading, useToasts } from '@geist-ui/react'
import { useEffect, useState, useContext } from 'react'
import Web3 from 'web3'
import { useWallet } from 'use-wallet'
import Tilt from 'react-parallax-tilt'
import chizShopAbi from '../data/chiz-shop-abi.json'
import useChizShop from '../hooks/useChizShop'

import { ShopContext } from '../pages/shop'
import { AppContext } from '../pages/_app'
import ProductModal from './ProductModal'

export default function NFT({ product }) {

    if(!product.slug || product.slug == '') return null;

    const wallet = useWallet();
    const [showModal, setShowModal] = useState(false)
    const { web3 } = useContext(AppContext)
    const { status, data, buy, stock } = useChizShop(product.slug)
    
    const openProduct = () => {
        if (product.opensea) {
            window.location.href = product.opensea
        } else {
            setShowModal(true)
        }
    }

    return (
        <>
            <ProductModal open={showModal} hide={() => setShowModal(false)} data={{ ...data, ...product, buy }} />
            <Tilt perspective={2000} className="block shadow-lg flex flex-col rounded-xl overflow-hidden text-black">
                <div onClick={openProduct} className="relative cursor-pointer relative h-96 overflow-hidden bg-cover bg-center shadow-xl" style={{ backgroundImage: `url(${product.image})` }}>
                    {stock >= 1 && <p className="absolute top-4 right-4 bg-yellow-400 text-xs py-1 px-4 rounded shadow">Stock: {stock}</p>}
                    {stock == 0 && <p className="absolute top-4 right-4 bg-red-500 text-xs py-1 px-4 rounded shadow">Sold Out</p>}
                </div>
                <div onClick={openProduct} className="cursor-pointer p-6 flex-1 bg-yellow-500 shadow-xl flex items-center">
                    <div className="space-y-1">
                        <p className="text-2xl font-extrabold">{product.title}</p>
                        {product.subtitle && <p className="opacity-50">{product.subtitle}</p>}
                    </div>
                </div>
                <div className="flex items-center p-6 bg-yellow-600 shadow-xl">
                    <p className="flex-1">
                        <span className="text-lg font-bold align-middle">{data.price ? web3.utils.fromWei(data.price) : '???'} CHIZ</span>
                    </p>
                    {product.opensea && (
                        <a href={product.opensea} onClick={() => {}}>
                            <Button loading={status === 'loading'} auto size="mini" onClick={() => {}}>
                                View on OpenSea
                            </Button>
                        </a>
                    )}
                    {!product.opensea && (
                        <div onClick={() => {}}>
                            <Button
                                loading={status === 'loading'}
                                auto
                                size="mini"
                                onClick={(e) => {
                                    e.preventDefault()
                                    buy()
                                }}
                            >
                                {wallet.account ? 'Quick Buy' : 'Connect Wallet'}
                            </Button>
                        </div>
                    )}
                </div>
            </Tilt>
        </>
    )
}
