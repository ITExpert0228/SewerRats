import { GeistProvider } from '@geist-ui/react'
import type { AppProps } from 'next/app'
import { UseWalletProvider } from 'use-wallet'
import Meta from '../components/Meta'
import '../styles/global.css'
import Head from 'next/head'
import Web3 from 'web3'
import { createContext, useState, useEffect } from 'react'

export const AppContext = createContext({})

export default function App({ Component, pageProps }: AppProps) {
    const web3 = new Web3(process.env.NEXT_PNEXT_PUBLIC_WEBSOCKET_URL)
    const [network, setNetwork] = useState(parseInt(process.env.NEXT_PUBLIC_NET_ID_ETH));
    const [pageUrl, setPageUrl] = useState('');

    useEffect(() => {
        
            setPageUrl(window.location.href);
            console.log('page url:');
            console.log(window.location.href);
        
        
    },[]);

    const changeNetwork = async (network) => {
        setNetwork(parseInt(network));
    }

    return (
        <>
            <Head>
                <link
                    rel="stylesheet"
                    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
                    integrity="sha512-iBBXm8fW90+nuLcSKlbmrPcLa0OT92xO1BIsZ+ywDWZCvqsWgccV3gFoRBv0z+8dLJgyAHIhR35VZc2oM/gI1w=="
                    crossOrigin="anonymous"
                />
                <script src="/js/three.min.js" />
                <script src="/js/p5.min.js" />
            </Head>

            <Meta />

            <AppContext.Provider value={{ web3 }}>
                <GeistProvider themeType="dark">
                    <UseWalletProvider chainId={network}>
                        
                        {pageUrl.includes('shop') &&
                            <div className="network-switch">
                                <a href="#" className={network == process.env.NEXT_PUBLIC_NET_ID_ETH ? 'active' : ''} onClick={() => changeNetwork(process.env.NEXT_PUBLIC_NET_ID_ETH)}>{process.env.NEXT_PUBLIC_NET_NAME_ETH}</a>
                                <a href="#" className={network == process.env.NEXT_PUBLIC_NET_ID_POLYGON ? 'active' : ''} onClick={() => changeNetwork(process.env.NEXT_PUBLIC_NET_ID_POLYGON)}>{process.env.NEXT_PUBLIC_NET_NAME_POLYGON}</a>
                            </div>
                        }

                        <div className="flex flex-col min-h-screen">
                            <Component {...pageProps} />
                        </div>
                    </UseWalletProvider>
                </GeistProvider>
            </AppContext.Provider>
        </>
    )
}

// :)
