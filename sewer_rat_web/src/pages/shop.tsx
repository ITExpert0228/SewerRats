import { Button } from '@geist-ui/react'
import Link from 'next/link'
import { createContext, useState, useEffect } from 'react'
import { useWallet } from 'use-wallet'
import Web3 from 'web3'
import FixedLogo from '../components/FixedLogo'
import NFT from '../components/NFT'
// import Tilt from 'react-parallax-tilt'
// import ProductModal from '../components/ProductModal'
import products_eth from '../data/products_eth.json'
import products_polygon from '../data/products_polygon.json'

export const storeContext = createContext({})

export default function store() {
    const wallet = useWallet();
    const [product, setProduct] = useState();
    var products;

    console.log('chain:');
    console.log(wallet.chainId);

    if(wallet.chainId == process.env.NEXT_PUBLIC_NET_ID_ETH){
        products = products_eth;
    }

    if(wallet.chainId == process.env.NEXT_PUBLIC_NET_ID_POLYGON){
        console.log('polygon products');
        products = products_polygon;
    }

   

    if(!products) return null;

    return (
        <>
            <FixedLogo />
            <storeContext.Provider value={{ product, setProduct }}>
                {/* <ProductModal /> */}

                {/* <div className="max-w-7xl mx-auto p-12">
                <div className="flex items-center">
                    <div className="flex-1">
                        <img className="w-56" src="/img/scream-logotype.png" alt="" />
                    </div>
                    <div className="hidden sm:block">
                        <Button auto size="large" shadow type="secondary">
                            Connect Wallet
                        </Button>
                    </div>
                </div>
            </div> */}

                <div className="relative z-10 max-w-7xl w-full mx-auto p-6 py-24 md:p-12 md:py-24 space-y-12 md:space-y-24 font-mono">
                    <div className="max-w-3xl text-center mx-auto space-y-6">
                        <img className="w-96 mx-auto" src="/img/chiz-store.png" alt="" />
                        <h1 className="text-5xl md:text-7xl font-extrabold">Welcome to the CHIZ store.</h1>
                        <h2 className="text-3xl md:text-4xl">Exclusively Available to Sewer Rat Social Club Members.</h2>
                        {/* <div>
                        <Link href="#about">
                            <Button auto size="large" shadow type="secondary">
                                Read More &rarr;
                            </Button>
                        </Link>
                    </div> */}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                        {products.map((product, index) => (
                            <NFT key={index} product={product} />
                        ))}
                    </div>

                    <div className="max-w-3xl text-right ml-auto space-y-6">
                        <h1 className="text-5xl md:text-7xl font-extrabold">Haven't claimed your CHIZ?</h1>
                        <h2 className="text-3xl md:text-4xl">
                            Every single Sewer Rat Social Club member is entitled to 10,000 CHIZ — for each freshly minted Rat they own.{' '}
                            <Link href="/claim">
                                <a className="underline hover:no-underline">Claim yours.</a>
                            </Link>
                        </h2>

                        <Link href="/mint">
                            <Button auto size="large" shadow type="secondary">
                                Mint Rats &rarr;
                            </Button>
                        </Link>
                    </div>

                    {/* <div className="rounded-xl shadow-2xl bg-gradient-to-br from-yellow-500 via-yellow-600 to-yellow-400 p-6 text-black">
                    <p>123</p>
                </div> */}
                </div>
            </storeContext.Provider>
        </>
    )
}
