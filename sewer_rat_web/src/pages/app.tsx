import { Button } from '@geist-ui/react'
import Typed from 'react-typed'
import Link from 'next/link'

export default function IndexPage() {
    return (
        <div className="flex-1 flex bg-black items-center justify-center">
            {/* <div className="absolute inset-0 bg-black bg-opacity-60" /> */}

            <div className="relative max-w-3xl mx-auto font-mono text-white flex flex-col items-center space-y-4 p-6">
                <img className="block mx-auto w-60" src="/img/logo.png" alt="" />
                <div className="text-center h-28 flex items-center justify-center ">
                    <p>
                        <Typed strings={['Welcome to the Sewer Rat Social Club.', 'The Sewer Rat Social Club is the most elusive club on Ethereum.']} typeSpeed={40} loop />
                    </p>
                </div>

                <Link href="/mint">
                    <a>
                        <Button type="secondary">Join the Club, Mint a Rat</Button>
                    </a>
                </Link>
                <Link href="/claim">
                    <a href="">
                        <Button>Claim CHIZ</Button>
                    </a>
                </Link>
                <Link href="/shop">
                    <a href="">
                        <Button>CHIZ Shop</Button>
                    </a>
                </Link>
                <Link href="/search" passHref>
                    <a>
                        <Button>RatPages</Button>
                    </a>
                </Link>
                <a target="_blank" rel="noreferrer" href="https://discord.gg/TgVhvRH4SB">

                    <Button>Chat with Rats</Button>
                </a>
            </div>

            <div className="absolute bottom-0 p-6 text-white space-x-2 text-lg">
                <a className="opacity-25 hover:opacity-100 transition ease-in-out duration-150" href="https://twitter.com/SewerRats_NFT" target="_blank" rel="noreferrer">
                    <i className="fab fa-twitter" />
                </a>
                <a className="opacity-25 hover:opacity-100 transition ease-in-out duration-150" href="https://discord.gg/3z7zbrJY2W" target="_blank" rel="noreferrer">
                    <i className="fab fa-discord" />
                </a>
                {/* <img className="w-16" src="/img/srsc-key.png" alt="" /> */}
            </div>
        </div>
    )
}
