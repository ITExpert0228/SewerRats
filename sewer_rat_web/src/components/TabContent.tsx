import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Button } from '@geist-ui/react'
import ReactTooltip from 'react-tooltip'

export default function TopContent(props) {
    const { toggleWorldBank, toggleCHIZ, toggleVideo, toggleBuyOpensea } = props

    const [openTab, setOpenTab] = useState(1);
    const [isTooltipVisible, setTooltipVisibility] = useState(false);

    useEffect(() => {
        setTooltipVisibility(true);
    }, []);

    /*useEffect(() => {
        if(highlightedBox == 'spent'){
            setOpenTab(2)
        }else{
            setOpenTab(1)
        }
    }, [highlightedBox])*/

    return (
        <>
            <div className="flex flex-wrap transform md:hidden" id="mobile_spent_form">
                <div className="w-full">
                    <ul
                        className="flex mb-0 list-none flex-wrap pt-3 flex-row"
                        role="tablist"
                    >
                        <li className="-mb-px flex-auto text-center">
                            <a
                                className={
                                    "text-xl font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 1
                                        ? "text-white bg-yellow-600 rounded-b-none"
                                        : "text-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist"
                            >
                                EARN
                            </a>
                        </li>
                        <li className="-mb-px last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-xl font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 2
                                        ? "text-white bg-yellow-600 rounded-b-none"
                                        : "text-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist"
                            >
                                SPEND
                            </a>
                        </li>
                    </ul>
                    <div className={"border-2 border-yellow-600 rounded-md relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg " + (openTab === 1
                                        ? "rounded-tl-none"
                                        : "rounded-tr-none")}>
                        <div className="px-4 py-5 flex-auto">
                            <div className="tab-content tab-space text-lg">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <div className='flex flex-col text-left gap-2'>
                                        <div className='flex flex-row gap-3'>
                                            <a className='flex flex-grow gap-3 hover:text-gray-700 cursor-pointer' onClick={toggleWorldBank}>
                                                <div className='flex-none w-4'>
                                                    <i className='fas fa-landmark' />
                                                </div>
                                                <div className='flex-grow'>
                                                    World Bank
                                                </div>
                                            </a>
                                            { isTooltipVisible && <div>
                                                <div data-for="world_bank_tab_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="world_bank_tab_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
                                            </div>
                                            }
                                        </div>
                                        <div className='flex flex-row gap-3'>
                                            <a className='flex flex-grow gap-3 hover:text-gray-700' target='_blank' href='http://farmv2.sewerratsocial.club/'>
                                                <div className='flex-none w-4'>
                                                    <i className='fas fa-hand-holding-usd' />
                                                </div>
                                                <div className='flex-grow'>
                                                    The Farm
                                                </div>
                                            </a>
                                            { isTooltipVisible &&
                                            <div>
                                                <div data-for="the_farm_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="the_farm_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
                                            </div>
                                            }
                                        </div>
                                        <div className='flex flex-row gap-3'>
                                            <a className='flex flex-grow gap-3 hover:text-gray-700'>
                                                <div className='flex-none w-4'>
                                                    <i className='fas fa-lock' />
                                                </div>
                                                <div className='flex-grow'>
                                                    P.A.R.M (Coming Soon)
                                                </div>
                                            </a>
                                            { isTooltipVisible &&
                                            <div>
                                                <div data-for="parm_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="parm_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
                                            </div>
                                            }
                                        </div>
                                        <div className='flex flex-row gap-3'>
                                            <a className='flex flex-grow gap-3 hover:text-gray-700' target='_blank' href='https://docs.google.com/spreadsheets/d/1OHdDdULQ-CjdvfGZTyOutkEllBQJ-VFmj8OxBz3HUzQ/edit#gid=1678404258'>
                                                <div className='flex-none w-4'>
                                                    <i className='fas fa-piggy-bank' />
                                                </div>
                                                <div className='flex-grow'>
                                                    Ratalyst fund
                                                </div>
                                            </a>
                                            { isTooltipVisible &&
                                            <div>
                                                <div data-for="ratalyst_fund_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="ratalyst_fund_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
                                            </div>
                                            }
                                        </div>
                                        <div className='flex flex-row gap-3'>
                                            <a className='flex flex-grow gap-3 hover:text-gray-700' onClick={toggleVideo}>
                                                <div className='flex-none w-4'>
                                                    <i className='fas fa-ship' />
                                                </div>
                                                <div className='flex-grow'>
                                                    Sell on OpenSea
                                                </div>
                                            </a>
                                            { isTooltipVisible &&
                                            <div>
                                                <div data-for="sell_opensea_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="sell_opensea_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <div className='flex flex-col text-left gap-2'>
                                        <div className='flex flex-row gap-3'>
                                            <a className='flex flex-grow gap-3 hover:text-gray-700 cursor-pointer' onClick={toggleCHIZ}>
                                                <div className='flex-none w-4'>
                                                    <i className='fas fa-store' />
                                                </div>
                                                <div className='flex-grow'>
                                                    CHIZ store
                                                </div>
                                            </a>
                                            { isTooltipVisible &&
                                            <div>
                                                <div data-for="chiz_store_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="chiz_store_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
                                            </div>
                                            }
                                        </div>
                                        <div className='flex flex-row gap-3'>
                                            <a className='flex flex-grow gap-3 hover:text-gray-700' target='_blank' href='https://www.sewerratsocial.club/search'>
                                                <div className='flex-none w-4'>
                                                    <i className='fas fa-sticky-note' />
                                                </div>
                                                <div className='flex-grow'>
                                                    Rat pages
                                                </div>
                                            </a>
                                            { isTooltipVisible &&
                                            <div>
                                                <div data-for="rat_pages_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="rat_pages_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
                                            </div>
                                            }
                                        </div>
                                        <div className='flex flex-row gap-3'>
                                            <a className='flex flex-grow gap-3 hover:text-gray-700' target='_blank' href='https://discord.com/channels/854114476869419040/887638198073827349/887640368101867550'>
                                                <div className='flex-none w-4'>
                                                    <i className='fas fa-briefcase' />
                                                </div>
                                                <div className='flex-grow'>
                                                    Job board
                                                </div>
                                            </a>
                                            { isTooltipVisible &&
                                            <div>
                                                <div data-for="job_board_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="job_board_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
                                            </div>
                                            }
                                        </div>
                                        <div className='flex flex-row gap-3'>
                                            <a className='flex flex-grow gap-3 hover:text-gray-700' onClick={toggleBuyOpensea}>
                                                <div className='flex-none w-4'>
                                                    <i className='fas fa-gavel' />
                                                </div>
                                                <div className='flex-grow'>
                                                    Auction night
                                                </div>
                                            </a>
                                            { isTooltipVisible &&
                                            <div>
                                                <div data-for="auction_night_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="auction_night_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
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
                                            { isTooltipVisible &&
                                            <div>
                                                <div data-for="buy_opensea_tooltip" data-tip='Explaining text goes here. <br /> Second row of the text' className='flex-none text-gray-700'>
                                                    <i className='fas fa-exclamation-circle' />
                                                </div>
                                                <ReactTooltip id="buy_opensea_tooltip" place='bottom' multiline type='dark' backgroundColor="#666"/>
                                            </div>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}