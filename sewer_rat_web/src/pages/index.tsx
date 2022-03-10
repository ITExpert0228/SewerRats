import { Button, Collapse } from '@geist-ui/react'
import { motion } from 'framer-motion'
import styled, { keyframes } from "styled-components";
import {flash} from "react-animations";
const FlashAnimation = keyframes`${flash}`;
const EarnFlashDiv = styled.div`
  animation: 2 1s ${props => props.animation === 'flash' ? FlashAnimation : ''};
`;
const SpentFlashDiv = styled.div`
  animation: 2 1s ${props => props.animation === 'flash' ? FlashAnimation : ''};
`;
import Link from 'next/link'
import { useEffect, useState } from 'react'
import Typist from 'react-typist'
import Web3 from 'web3'
import CheezParticles from '../components/CheezParticles'
import Loader from '../components/Loader'
import Modal from 'react-modal'
import ReactPlayer from "react-player";
import VideoModal from "react-responsive-modal";
import TopMenu from '../components/TopMenu'
import TabContent from '../components/TabContent'
import ModalVideo from 'react-modal-video'
import ReactTooltip from 'react-tooltip'
import abi from '../data/rat-abi.json'
import { contractAddress, web3 } from '../utils/web3'

export default function IndexPage() {
    const [earnAnimation, setEarnAnimation] = useState(null);
    const [spentAnimation, setSpentAnimation] = useState(null);

    /*const [highlightedBox, setHighlightedBox] = useState(null)*/

    const [mint, setMint] = useState(null)
    const [isTooltipVisible, setTooltipVisibility] = useState(false)

    const [modalWorldBankIsOpen, setWorldBankIsOpen] = useState(false)
    const [modalCHIZIsOpen, setCHIZIsOpen] = useState(false)
    const [modalVideoOpen, setVideoOpen] = useState(false)
    const [modalSewerLabOpen, setSewerLabOpen] = useState(false)
    const [modalBuyOpenseaOpen, setBuyOpenseaOpen] = useState(false)

    useEffect(() => {
        setTooltipVisibility(true)
    }, [])

    useEffect(() => {
        const loadData = async () => {
            const contract = new web3.eth.Contract(abi as any, contractAddress)
            const totalySupply = await contract.methods.totalSupply().call()
            setMint(totalySupply)
        }
        loadData()
    }, [])

    const toggleWorldBank = () => setWorldBankIsOpen(modalWorldBankIsOpen => !modalWorldBankIsOpen)
    const toggleCHIZ = () => setCHIZIsOpen(modalCHIZIsOpen => !modalCHIZIsOpen)
    const toggleVideo = () => setVideoOpen(modalVideoOpen => !modalVideoOpen)
    const toggleSewerLab = () => setSewerLabOpen( modalSewerLab => !modalSewerLab )
    const toggleBuyOpensea = () => setBuyOpenseaOpen(modalBuyOpenseaOpen => !modalBuyOpenseaOpen )
    /*const clickHighlightedBox = (target) => {
        const spentForm = document.getElementById('desktop_spent_form')
        const mobileSpentForm = document.getElementById('mobile_spent_form')
        setHighlightedBox(target)
        spentForm.scrollIntoView()
        mobileSpentForm.scrollIntoView()
    }*/

    useEffect(() => {
        if(!earnAnimation) {
            setEarnAnimation('flash')
        }
        if(!spentAnimation) {
            setSpentAnimation('flash')
        }
    }, [earnAnimation, spentAnimation])

    // @ts-ignore
    return (
        <>
            <Loader />
            <div className='relative '>
                <CheezParticles />
                <TopMenu setEarnAnimation={setEarnAnimation} setSpentAnimation={setSpentAnimation} />
                <div className='h-32 block sm:hidden' />
                <div className='p-12 py-24 md:py-48 text max-w-4xl mx-auto space-y-8 text-center'>
                    <img className='w-24 mx-auto' src='/img/srsc-key.png' alt='' />
                    <div className='font-sedgwick'>
                        <Typist cursor={{ show: false }}>
                            <Typist.Delay ms={2500} />
                            <p className='text-4xl md:text-6xl'>Sewer Rat Social Club</p>
                        </Typist>
                    </div>
                    <div className='text-xs max-w-xs mx-auto opacity-50'>
                        <p className='font-mono'>
                            Sewer Rats are digital collectibles living on the Ethereum Blockchain... each randomly
                            generated from 188 unique hand-drawn properties. A smart contract ensures no more than 8888
                            rats will ever exist. Rats are minted as ERC-721 tokens and their metadata is stored on
                            IPFS. Each of
                            these bastards costs 0.05 ETH to mint.
                        </p>
                    </div>
                    <div>
                        <Link href='https://opensea.io/collection/srsc'>
                            <a href='https://opensea.io/collection/srsc'>
                                <button
                                    type='button'
                                    className='text-3xl font-sedgwick bg-white rounded-2xl px-8 pt-4 pb-3 text-black animate-pulse hover:text-white hover:bg-black border border-white hover:border-white transition ease-in-out duration-150'
                                >
                                    Join the Social Club
                                </button>
                            </a>
                        </Link>
                    </div>
                    <Modal
                        isOpen={modalWorldBankIsOpen}
                        onRequestClose={toggleWorldBank}
                        style={{
                            overlay: {
                                position: 'fixed',
                                margin: 'auto',
                                maxWidth: 360,
                                maxHeight: 200,
                                borderRadius: 8
                            },
                            content: {
                                position: 'absolute',
                                border: '1px solid rgb(217,119,6)',
                                background: 'rgba(0,0,0,0.9)',
                                inset: 0,
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                borderRadius: '8px',
                                outline: 'none',
                                paddingTop: 10
                            }
                        }}
                        ariaHideApp={false}
                    >
                        <div className='flex flex-col'>
                            <div className='flex flex-col gap-5'>
                                <div className='flex text-xl'>
                                    <button type='button' className='close ml-auto' onClick={toggleWorldBank}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <a href='/chiz' target='_blank'
                                   className='text-black p-2 border solid border-gray-600 bg-gray-dark rounded-lg flex flex-row align-center justify-center hover:border-white hover:bg-black hover:text-white'>
                                    <img src='/img/ethereum.png' className='h-6 mr-3'/>
                                    Ethereum Mainnet</a>
                                <a href='#'
                                   className='text-black p-2 border solid border-gray-600 bg-gray-dark rounded-lg flex flex-row align-center justify-center hover:border-white hover:bg-black hover:text-white'>
                                    <img src='/img/polygon.png' className='h-6 mr-3'/>
                                    Coming Soon for Polygon
                                </a>
                            </div>
                        </div>

                    </Modal>

                    <Modal
                        isOpen={modalCHIZIsOpen}
                        onRequestClose={toggleCHIZ}
                        style={{
                            overlay: {
                                position: 'fixed',
                                margin: 'auto',
                                maxWidth: 360,
                                maxHeight: 200,
                                borderRadius: 8
                            },
                            content: {
                                position: 'absolute',
                                border: '1px solid rgb(217,119,6)',
                                background: 'rgba(0,0,0,0.9)',
                                inset: 0,
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                borderRadius: '8px',
                                outline: 'none',
                                paddingTop: 10
                            }
                        }}
                        ariaHideApp={false}
                    >
                        <div className='flex flex-col'>
                            <div className='flex flex-col gap-5'>
                                <div className='flex flex-row text-xl'>
                                    <button type='button' className='close ml-auto' onClick={toggleCHIZ}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <a href='https://www.sewerratsocial.club/shop' target='_blank'
                                   className='text-black p-2 border solid border-gray-600 bg-gray-dark rounded-lg flex flex-row align-center justify-center hover:border-white hover:bg-black hover:text-white'>
                                    <img src='/img/ethereum.png' className='h-6 mr-3'/>
                                    Ethereum Mainnet</a>
                                <a href='#'
                                   className='text-black p-2 border solid border-gray-600 bg-gray-dark rounded-lg flex flex-row align-center justify-center hover:border-white hover:bg-black hover:text-white'>
                                    <img src='/img/polygon.png' className='h-6 mr-3'/>
                                    Coming Soon for Polygon
                                </a>
                            </div>
                        </div>
                    </Modal>

                    <Modal
                        isOpen={modalVideoOpen}
                        onRequestClose={toggleVideo}
                        style={{
                            overlay: {
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: 0,
                                zIndex: 99999
                            },
                            content: {
                                position: 'absolute',
                                top: '40px',
                                left: '40px',
                                right: '40px',
                                bottom: '40px',
                                border: 0,
                                background: 'rgba(0,0,0,0)',
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                borderRadius: '4px',
                                outline: 'none',
                                padding: '20px'
                            }
                        }}
                        ariaHideApp={false}
                    >
                        <ReactPlayer
                            url="https://vimeo.com/649896612"
                            width="100%"
                            height="calc(100vh - 140px)"
                        />
                    </Modal>
                    <Modal
                        isOpen={modalSewerLabOpen}
                        onRequestClose={toggleSewerLab}
                        style={{
                            overlay: {
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: 0,
                                zIndex: 99999
                            },
                            content: {
                                position: 'absolute',
                                top: '40px',
                                left: '40px',
                                right: '40px',
                                bottom: '40px',
                                border: 0,
                                background: 'rgba(0,0,0,0)',
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                borderRadius: '4px',
                                outline: 'none',
                                padding: '20px',
                                maxWidth: '500px',
                                maxHeight: '250px',
                                margin: 'auto'
                            }
                        }}
                        ariaHideApp={false}
                    >
                        <div className='flex flex-col'>
                            <div className='flex flex-col gap-5'>
                                <div className='flex text-xl'>
                                    <button type='button' className='close ml-auto' onClick={toggleSewerLab}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <p
                                   className='text-black p-12 text-2xl border solid border-gray-600 bg-gray-dark rounded-lg flex flex-row align-center justify-center'>
                                    SEWER LAB is Coming Soon!
                                </p>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        isOpen={modalBuyOpenseaOpen}
                        onRequestClose={toggleBuyOpensea}
                        style={{
                            overlay: {
                                position: 'fixed',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                backgroundColor: 'rgba(0,0,0,0.9)',
                                border: 0,
                                zIndex: 99999
                            },
                            content: {
                                position: 'absolute',
                                top: '40px',
                                left: '40px',
                                right: '40px',
                                bottom: '40px',
                                border: 0,
                                background: 'rgba(0,0,0,0)',
                                overflow: 'auto',
                                WebkitOverflowScrolling: 'touch',
                                borderRadius: '4px',
                                outline: 'none',
                                padding: '20px',
                                maxWidth: '500px',
                                maxHeight: '250px',
                                margin: 'auto'
                            }
                        }}
                        ariaHideApp={false}
                    >
                        <div className='flex flex-col'>
                            <div className='flex flex-col gap-5'>
                                <div className='flex text-xl'>
                                    <button type='button' className='close ml-auto' onClick={toggleBuyOpensea}>
                                        <span>&times;</span>
                                    </button>
                                </div>
                                <p
                                    className='text-black p-12 text-2xl border solid border-gray-600 bg-gray-dark rounded-lg flex flex-row align-center justify-center'>
                                    Announced on discord
                                </p>
                            </div>
                        </div>
                    </Modal>
                    <div
                        className='hidden p-6 gap-4 grid-cols-2 transform md:border-4 md:border-gray-800 md:rounded-sm md:grid text-lg' id='desktop_spent_form'>

                        <EarnFlashDiv animation={earnAnimation}>
                            <div className={`border-2 border-yellow-600 rounded-md p-5 flex flex-col text-left gap-2`}>
                                <div className='text-2xl font-bold tracking-widest'>
                                    EARN CHIZ
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a className='flex flex-grow gap-3 hover:text-gray-700 cursor-pointer'
                                       onClick={toggleWorldBank}>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-landmark' />
                                        </div>
                                        <div className='flex-grow'>
                                            World Bank
                                        </div>
                                    </a>
                                    {isTooltipVisible && <div>
                                        <div data-for='world_bank_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='world_bank_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a className='flex flex-grow gap-3 hover:text-gray-700' target='_blank'
                                       href='http://farmv2.sewerratsocial.club/'>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-hand-holding-usd' />
                                        </div>
                                        <div className='flex-grow'>
                                            The Farm
                                        </div>
                                    </a>
                                    {isTooltipVisible &&
                                    <div>
                                        <div data-for='the_farm_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='the_farm_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a className='flex flex-grow gap-3 disabled hover:text-gray-700' title='Coming Soon'>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-lock' />
                                        </div>
                                        <div className='flex-grow'>
                                            P.A.R.M (Coming Soon)
                                        </div>
                                    </a>
                                    {isTooltipVisible &&
                                    <div>
                                        <div data-for='parm_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='parm_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a className='flex flex-grow gap-3 hover:text-gray-700' target='_blank'
                                       href='https://docs.google.com/spreadsheets/d/1OHdDdULQ-CjdvfGZTyOutkEllBQJ-VFmj8OxBz3HUzQ/edit#gid=1678404258'>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-piggy-bank' />
                                        </div>
                                        <div className='flex-grow'>
                                            Ratalyst fund
                                        </div>
                                    </a>
                                    {isTooltipVisible &&
                                    <div>
                                        <div data-for='ratalyst_fund_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='ratalyst_fund_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a className='flex flex-grow gap-3 cursor-pointer hover:text-gray-700' onClick={toggleVideo}>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-ship' />
                                        </div>
                                        <div className='flex-grow'>
                                            Sell on OpenSea
                                        </div>
                                    </a>
                                    {isTooltipVisible &&
                                    <div>
                                        <div data-for='sell_opensea_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='sell_opensea_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                            </div>
                        </EarnFlashDiv>
                        <SpentFlashDiv animation={spentAnimation}>
                            <div className={`border-2 border-yellow-600 rounded-md p-5 flex flex-col text-left gap-2`}>
                                <div className='text-2xl font-bold tracking-widest'>
                                    SPEND CHIZ
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a className='flex flex-grow gap-3 hover:text-gray-700 cursor-pointer'
                                       onClick={toggleCHIZ}>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-store' />
                                        </div>
                                        <div className='flex-grow'>
                                            CHIZ store
                                        </div>
                                    </a>
                                    {isTooltipVisible &&
                                    <div>
                                        <div data-for='chiz_store_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='chiz_store_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a className='flex flex-grow gap-3 hover:text-gray-700' target='_blank'
                                       href='https://www.sewerratsocial.club/search'>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-sticky-note' />
                                        </div>
                                        <div className='flex-grow'>
                                            Rat pages
                                        </div>
                                    </a>
                                    {isTooltipVisible &&
                                    <div>
                                        <div data-for='rat_pages_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='rat_pages_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a target='_blank' className='flex flex-grow gap-3 hover:text-gray-700' href='https://discord.com/channels/854114476869419040/887638198073827349/887640368101867550'>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-briefcase' />
                                        </div>
                                        <div className='flex-grow'>
                                            Job board
                                        </div>
                                    </a>
                                    {isTooltipVisible &&
                                    <div>
                                        <div data-for='job_board_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='job_board_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a className='flex flex-grow gap-3 cursor-pointer hover:text-gray-700 ' onClick={toggleBuyOpensea}>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-gavel' />
                                        </div>
                                        <div className='flex-grow'>
                                            Auction night
                                        </div>
                                    </a>
                                    {isTooltipVisible &&
                                    <div>
                                        <div data-for='auction_night_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='auction_night_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                                <div className='flex flex-row gap-3'>
                                    <a className='flex flex-grow gap-3 hover:text-gray-700' target='_blank' href='https://opensea.io/collection/srsc'>
                                        <div className='flex-none w-4'>
                                            <i className='fas fa-ship' />
                                        </div>
                                        <div className='flex-grow'>
                                            Buy on Opensea
                                        </div>
                                    </a>
                                    {isTooltipVisible &&
                                    <div>
                                        <div data-for='buy_opensea_tooltip'
                                             data-tip='Explaining text goes here. <br /> Second row of the text'
                                             className='flex-none text-gray-700'>
                                            <i className='fas fa-exclamation-circle' />
                                        </div>
                                        <ReactTooltip id='buy_opensea_tooltip' place='bottom' multiline type='dark'
                                                      backgroundColor='#666' />
                                    </div>
                                    }
                                </div>
                            </div>
                        </SpentFlashDiv>
                    </div>
                    <TabContent toggleWorldBank={toggleWorldBank} toggleCHIZ={toggleCHIZ} toggleVideo={toggleVideo} toggleBuyOpensea={toggleBuyOpensea} />
                </div>
                <div className='relative'>
                    <Link href='/shop'>
                        <a href='#'>
                            <img src='/img/rat-shop.gif' alt='' />
                        </a>
                    </Link>
                    <a className={'cursor-pointer'} onClick={toggleSewerLab}>
                        <img src='/img/rat-shop-2.JPG' alt='' />
                    </a>
                </div>
            </div>

            <div className='bg-gradient-to-br from-yellow-300 via-yellow-500 to-pink-500 text-black overflow-hidden'>
                <div className='p-12 py-24 md:py-48 max-w-5xl mx-auto space-y-12'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 transform rotate-2'>
                        <div className='space-y-4'>
                            <p className='font-extended text-xl md:text-4xl uppercase text-center md:text-right'>Each
                                rat is entitled to claim 10,000 CHIZ tokens to spend at the CHIZ shop.</p>
                            <p className='font-extended md:text-xl uppercase text-center md:text-right'>Spend your CHIZ
                                tokens to get the latest and greatest NFT drops — 100% free.</p>
                        </div>
                        <div className='flex justify-center items-center'>
                            <motion.img drag animate={{ rotate: ['0deg', '360deg', '0deg'] }}
                                        transition={{ duration: 8, loop: Infinity }} src='/img/cheez-token.png'
                                        alt='' />
                        </div>
                    </div>
                    <div className='text-xs max-w-xs mx-auto opacity-50 transform -rotate-2'>
                        <p className='font-mono'>
                            $CHIZ is a real ERC20 token — the official currency of the Social Club. $CHIZ can be used to
                            obtain NFT's, exclusive merch drops, raffle tickets to raffles and other things we can't
                            tell you
                            about yet.
                        </p>
                    </div>

                    <div className='text-center font-mono'>
                        <Link href='/claim'>
                            <a href='# '>
                                <Button>Claim Your CHIZ</Button>
                            </a>
                        </Link>
                    </div>
                    <div>
                        <img className='w-96 mx-auto' src='/img/chiz-cycle.png' alt='' />
                    </div>
                </div>
            </div>

            <div
                className='p-12 py-24 max-w-5xl w-full mx-auto text-lg sm:text-2xl md:text-4xl font-extended uppercase space-y-4'>
                <p>Ownership of a Sewer Rat grants the holder access to the most underground circle in the NFT
                    scene.</p>
                <p>
                    <span className='text-yellow-400'>We Are Sold out</span>
                </p>
                <p>
                    <Link href='https://opensea.io/collection/srsc'>
                        <a href='https://opensea.io/collection/srsc' className='underline hover:no-underline'>
                            Available on OpenSea
                        </a>
                    </Link>
                </p>
            </div>

            <div
                className='border-b border-t border-opacity-10 bg-gradient-to-br from-yellow-400 via-green-600 to-green-300'>
                <div className='p-12 py-24 md:py-48 max-w-5xl mx-auto text-center space-y-4'>
                    <div className='space-1'>
                        <p className='font-extended uppercase'>Rats believe in Democracy.</p>
                        <p className='font-extended uppercase text-5xl'>The Rat DAO</p>
                        <p className='font-extended uppercase'>Enables every rat to be heard.</p>
                    </div>

                    <a className='block' href='https://snapshot.org/#/sewerratsocialclub.eth' target='_blank'
                       rel='noreferrer'>
                        <Button size='mini' auto type='secondary'>
                            Visit the DAO
                        </Button>
                    </a>

                    <a className='block' href='https://snapshot.org/#/sewerratsocialclub.eth' target='_blank'
                       rel='noreferrer'>
                        <img src='/img/dao.png' alt='' />
                    </a>
                </div>
            </div>

            <div className='p-12 py-24 md:py-48 max-w-5xl mx-auto space-y-24'>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24'>
                    <div className='transform rotate-2'>
                        <Collapse title='Wen drop?'>
                            <p>Last 10% left to mint</p>
                        </Collapse>
                        <Collapse title='Wen reveal?'>
                            <p>Immediatly after purchase</p>
                        </Collapse>
                        <Collapse title='Wen CHEDDAZ?'>
                            <p>Aiming for early August</p>
                        </Collapse>
                        <Collapse title='How are rats created?'>
                            <p>When a Mommy rat and a Daddy rat love each other very much, an algorithm randomly selects
                                traits from a large pool, and mints a never before seen Sewer Rat.</p>
                        </Collapse>
                    </div>
                    <div className='transform -rotate-1 block md:hidden text-center'>
                        <Link href='/mint'>
                            <a href='# '>
                                <Button type='secondary'>Mint Now</Button>
                            </a>
                        </Link>
                    </div>
                    <div className='transform -rotate-2'>
                        <Collapse title='Can they breed?'>
                            <p>Not yet.</p>
                        </Collapse>
                        <Collapse title='What are the odds of having 2 duplicate rats?'>
                            <p>
                                {'>'}
                                1/1000000000000000000000
                            </p>
                        </Collapse>
                        <Collapse title='What is this about rights?'>
                            <p>You own the commercial rights to your Sewer Rat, for as long as you have it in your
                                Ethereum wallet.</p>
                        </Collapse>
                        <Collapse title='How many can I buy?'>
                            <p>Limited to 15 per transaction</p>
                        </Collapse>
                    </div>
                </div>

                <div className='space-y-4'>
                    <p className='font-extended text-3xl uppercase'>Resources</p>

                    <div className='flex flex-wrap flex-gap-2'>
                        <a href='https://forms.gle/Hj59jb8torZaaqh59' target='_blank' rel='noreferrer'>
                            <Button auto size='mini' type='secondary'>
                                Submit your NFT to the CHIZ Store
                            </Button>
                        </a>
                        <a href='https://nft20.io/asset/0x5d98030ee646e6b3f25425c31c038310696616ea' target='_blank'
                           rel='noreferrer'>
                            <Button auto size='mini' type='secondary'>
                                NFT20 Pool
                            </Button>
                        </a>
                        <a href='https://medium.com/nft20-guides/a-detailed-guide-for-using-the-sewer-rat-social-club-nft20-pool-296355e8afaa'
                           target='_blank' rel='noreferrer'>
                            <Button auto size='mini' type='secondary'>
                                NFT20 Tutorial
                            </Button>
                        </a>
                        <a href='https://v2.info.uniswap.org/pair/0x02346c6d7dcdcbfa511eb72bf61f7545f7bd2527'
                           target='_blank' rel='noreferrer'>
                            <Button auto size='mini' type='secondary'>
                                Trade SRSC20 for ETH
                            </Button>
                        </a>
                        <a href='https://snapshot.org/#/srsc-dao.eth/settings' target='_blank' rel='noreferrer'>
                            <Button auto size='mini' type='secondary'>
                                Rat DAO
                            </Button>
                        </a>
                        <a href='https://forum.sewerratsocial.club/' target='_blank' rel='noreferrer'>
                            <Button auto size='mini' type='secondary'>
                                Rat Forum
                            </Button>
                        </a>
                    </div>
                </div>
            </div>

            <div className='bg-gradient-to-tr from-blue-800 via-blue-600 to-green-800'>
                <div className='p-12 py-24 md:py-48 max-w-5xl mx-auto text-center space-y-8'>
                    <motion.p animate={{ rotate: ['-3deg', '3deg', '-3deg'], scale: ['100%', '110%', '100%'] }}
                              transition={{ loop: Infinity, duration: 4 }} className='text-7xl font-sedgwick'>
                        The Cheddaz
                    </motion.p>

                    <motion.img animate={{ scale: ['99%', '101%', '99%'] }}
                                transition={{ loop: Infinity, duration: 12 }} className='block shadow-xl w-96 mx-auto'
                                src='/img/cheddaz-square.png' alt='' />

                    <p className='max-w-xs w-full mx-auto font-mono opacity-75'>The Cheddaz are 8888 randomly generated
                        dairy-based pets.</p>
                    <p className='max-w-2xl w-full mx-auto font-extended text-2xl uppercase'>Every rat is entitled to
                        one random chedda.</p>

                    <Link href='/cheddaz'>
                        <Button type='secondary'>Claim Yours</Button>
                    </Link>

                    {/* <p className="font-extended uppercase text-xs animate-pulse text-blue-200">Coming soon!</p> */}
                </div>
            </div>

            <div className='p-12 py-24 max-w-5xl w-full mx-auto flex items-center'>
                <p className='font-extended text-2xl md:text-4xl flex-1'>SRSC &copy; {new Date().getFullYear()}</p>
                <p className='space-x-4 text-2xl'>
                    <a href='https://twitter.com/SewerRats_NFT' target='_blank' rel='noreferrer'>
                        <i className='fab fa-twitter' />
                    </a>
                    <a href='https://discord.gg/3z7zbrJY2W' target='_blank' rel='noreferrer'>
                        <i className='fab fa-discord' />
                    </a>
                </p>
            </div>
        </>
    )
}
