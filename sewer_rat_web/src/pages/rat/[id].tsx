import { Button } from '@geist-ui/react'
import axios from 'axios'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Typed from 'react-typed'
import { useWallet } from 'use-wallet'
import { toChecksumAddress } from 'web3-utils'
import Web3 from 'web3'
import { useRouter } from 'next/dist/client/router'
import ratPagesAbi from '../../data/rat-pages-abi.json'
import chizAbi from '../../data/chiz-token-abi.json'

export async function getServerSideProps(context) {
    const { id } = context.query
    const { data: nft } = await axios.get(`https://api.opensea.io/api/v1/asset/0xd21a23606d2746f086f6528cd6873bad3307b903/${id}/`)

    const web3 = new Web3(process.env.NEXT_PUBLIC_WEBSOCKET_URL_ETH)
    const contract = new web3.eth.Contract(ratPagesAbi as any, `${process.env.NEXT_PUBLIC_RAT_PAGES_CONTRACT_ETH}`)
    const page = await contract.methods.Pages(id).call()

    return { props: { nft: { ...nft, ...page } } }
}

export default function RatPage({ nft }) {
    const wallet = useWallet()
    const router = useRouter()
    const { id } = router.query

    const page = JSON?.parse(nft.data || '{}')

    const [story, setStory] = useState(page?.story)
    const [name, setName] = useState(page?.name)
    const [editMode, setEditMode] = useState(false)

    const data = JSON.stringify({ story, name })
    const basePrice = 10000
    const price = basePrice * Number(nft?.timesUpdated) + basePrice

    const disabled = !story || !name

    useEffect(() => {
        setEditMode(false)
        setStory(page?.story)
        setName(page?.name)
    }, [id])

    const isOwner = wallet.account ? toChecksumAddress(wallet.account) === toChecksumAddress(nft.owner.address) : false

    const onSubmitStory = async () => {
        try {
            const web3 = new Web3(wallet.ethereum)

            const contract = new web3.eth.Contract(ratPagesAbi as any, `${process.env.NEXT_PUBLIC_RAT_PAGES_CONTRACT_ETH}`)

            const chizContract = new web3.eth.Contract(chizAbi as any, `${process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS_ETH}`)

            const allowance = await chizContract.methods.allowance(wallet.account, process.env.NEXT_PUBLIC_RAT_PAGES_CONTRACT_ETH).call()

            console.log(allowance)
            // console.log(typeof allowance)

            if (allowance == '0') {
                await chizContract.methods.approve(process.env.NEXT_PUBLIC_RAT_PAGES_CONTRACT_ETH, web3.utils.toWei('999999999999')).send({ from: wallet.account })
            }

            console.log('Updating...')

            await contract.methods.updatePage(nft.token_id, data).send({ from: wallet.account })
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <div className="max-w-7xl w-full mx-auto p-6 py-12 md:p-12 md:py-24  font-mono space-y-12">
            <div className="flex justify-end space-x-4 items-center">
                <Link href="/search">
                    <a className="text-xs opacity-50">&larr; Search</a>
                </Link>
                <div className="flex-1" />
                {isOwner && (
                    <>
                        <p className="text-green-400 text-xs">You own this rat.</p>
                        <Button onClick={() => setEditMode((_) => !_)} size="mini" auto>
                            <i className="fas fa-edit" />
                            {/* {story ? 'Edit Story' : 'Add Story'} */}
                        </Button>
                    </>
                )}
                <Button onClick={() => wallet.connect()} auto size="mini">
                    {wallet.account ? `${wallet.account.slice(0, 6)}...${wallet.account.slice(-6)}` : 'Connect Wallet'}
                </Button>
            </div>

            {/* {data} */}

            <div className="flex-1 flex-col md:flex-row flex flex-gap-12">
                <div className="flex-shrink-0 space-y-6 md:max-w-md">
                    <img src={nft.image_url} className="rounded-2xl" alt="" />
                    {!editMode && (
                        <div>
                            {!story && <p className="opacity-50">This rat does not have a name yet.</p>}
                            {story && <p className="text-3xl">{name}</p>}
                        </div>
                    )}

                    {editMode && (
                        <div>
                            <Typed strings={['Enter a New Name for your Rat']} typeSpeed={40} backSpeed={50} attr="placeholder" showCursor={false}>
                                <input value={name} onChange={(e) => setName(e.target.value)} className="bg-opacity-5 bg-white p-2 w-full" />
                            </Typed>
                        </div>
                    )}

                    <div className="flex flex-wrap flex-gap-6">
                        {nft.traits
                            .sort((a, b) => b.value.length - a.value.length)
                            .map((trait, i) => (
                                <div key={i} className="">
                                    <p className="text-xs opacity-50">{trait.trait_type}</p>
                                    <p className="text-xl">{trait.value}</p>
                                    <p className="text-xs opacity-75">
                                        {((trait.trait_count / 8888) * 100).toFixed(2)}
                                        %
                                    </p>
                                </div>
                            ))}
                    </div>
                </div>
                <div className="flex-1 space-y-6">
                    <p className="text-7xl font-extrabold">
                        Rat #
                        {nft.token_id}
                    </p>
                    <p>
                        <a className="underline hover:no-underline" href={nft.permalink} target="_blank" rel="noreferrer">
                            View on OpenSea
                        </a>
                        &nbsp;
                        <a href={`https://opensea.io/${nft.owner.address}`} target="_blank" rel="noreferrer" className="group">
                            <span className="opacity-50">
                                Owned by
                                {' '}
                                {nft.owner.address.slice(0, 6)}
                                ...
                                {nft.owner.address.slice(-6)}
                            </span>
                            &nbsp;
                            {nft.owner?.user?.username && (
                                <span className="underline group-hover:no-underline">
                                    (
                                    {nft.owner?.user?.username}
                                    )
                                </span>
                            )}
                        </a>
                    </p>
                    {editMode && (
                        <div>
                            <Typed
                                strings={['Write a Social Club fairytale.', 'Enter a note for your rat.', 'Tell their story to world.', 'Their story shall never be forgetten.']}
                                typeSpeed={40}
                                backSpeed={50}
                                attr="placeholder"
                                showCursor={false}
                                loop
                            >
                                <textarea value={story} onChange={(e) => setStory(e.target.value)} autoFocus className="bg-opacity-5 bg-white p-6 w-full" />
                            </Typed>
                        </div>
                    )}

                    {!editMode && (
                        <div className="text-xl">
                            {!story && <p className="opacity-50">This rat does not have story yet.</p>}
                            {story && (
                                <p>
                                    <Typed strings={[story]} typeSpeed={10} backSpeed={50} />
                                </p>
                            )}
                        </div>
                    )}

                    {isOwner && (
                        <div className="flex">
                            <Button onClick={() => setEditMode((_) => !_)} size="mini">
                                {story ? 'Edit Story' : 'Add Story'}
                            </Button>
                            <div className="flex-1" />

                            {editMode && (
                                <div className="space-y-2 text-right">
                                    <Button onClick={onSubmitStory} type="secondary" disabled={disabled} size="mini">
                                        Update Story
                                    </Button>
                                    <p className="text-xs opacity-50">
                                        Cost:
                                        {' '}
                                        {price}
                                        {' '}
                                        CHIZ
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex">
                {nft.token_id !== '0' && (
                    <Link href={`/rat/${parseInt(nft.token_id) - 1}`}>
                        <a>&larr; Previous Rat</a>
                    </Link>
                )}
                <div className="flex-1" />
                {nft.token_id !== '8887' && (
                    <Link href={`/rat/${parseInt(nft.token_id) + 1}`}>
                        <a>Next Rat &rarr;</a>
                    </Link>
                )}
            </div>
        </div>
    )
}
