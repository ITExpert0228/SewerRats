import { useState } from 'react'
import Link from 'next/link'
import { Button } from '@geist-ui/react'

export default function TopMenu(props) {
    const {setEarnAnimation, setSpentAnimation} = props
    /*const {clickHighlightedBox} = props*/
    const [open, setOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const handleBlur = (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
            if (open) {
                setOpen(false);
            }
        }
    }

    return (
        <>
            <div className="fixed w-full z-50">
                <div
                     className="max-w-7xl mx-auto flex flex-col max-w-screen-xl p-6 space-x-4s mx-auto md:items-center md:justify-between md:flex-row md:px-6 lg:px-8">
                    <div className="flex flex-row items-center justify-between">
                        <img className='w-32' src='/img/logo.png' alt='' />
                        <div className="flex flex-row items-center justify-between block md:hidden">
                            <button className="md:hidden rounded-lg focus:outline-none focus:shadow-outline" onClick={() => setMenuOpen(!menuOpen)}>
                                <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                                    <path className={menuOpen ? 'hidden' : ''} fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"></path>
                                    <path className={menuOpen ? '' : 'hidden'} x-show="open" fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                            <a className="ml-3" href='https://discord.gg/3z7zbrJY2W' target='_blank' rel='noreferrer'>
                                <i className='text-2xl fab fa-discord' />
                            </a>
                        </div>
                    </div>
                    <nav className={`${
                        menuOpen ? 'flex' : 'hidden'
                    } flex-col bg-black flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row md:bg-transparent`}>
                        <a className='cursor-pointer px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                           onClick={() => setEarnAnimation()}>Earn</a>
                        <a className='cursor-pointer px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                           onClick={() => setSpentAnimation()}>Spend</a>
                        <a className='px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                           href='https://www.coingecko.com/en/coins/sewer-rat-social-club-chiz-token' target='_blank'>CHIZ token</a>
                        <a className='px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 md:ml-4 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                           target='_blank' href='https://discord.com/channels/854114476869419040/896113756315209828/896113911621877781'>Rat-FI guides</a>
                        <div className='relative' onBlur={handleBlur}>
                            <button onClick={() => setOpen(!open)} className='flex flex-row items-center w-full px-4 py-2 mt-2
                                        text-sm font-semibold text-left bg-transparent rounded-lg dark-mode:bg-transparent
                                        dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:focus:bg-gray-600
                                        dark-mode:hover:bg-gray-600 md:w-auto md:inline md:mt-0 md:ml-4 hover:text-gray-900
                                        focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none
                                        focus:shadow-outline'>
                                <span>Community</span>
                                <svg fill='currentColor' viewBox='0 0 20 20' className={`${
                                    open ? 'rotate-180' : 'rotate-0'
                                } inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1`}>
                                    <path fillRule='evenodd'
                                          d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                                          clipRule='evenodd'></path>
                                </svg>
                            </button>
                            <div className={`${open ? '' : 'hidden'} bg-black border-0 border-yellow-600 absolute left-0 w-full mt-4 origin-top-right rounded-md shadow-lg md:w-48 md:border-4`}>
                                <div className="top-triangle hidden md:block" />
                                <div className='px-2 py-2 rounded-md shadow dark-mode:bg-gray-800'>
                                    <a className='block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                                       href='#' title={'COMING SOON'}>Event Calendar</a>
                                    <a className='block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                                       href='https://snapshot.org/#/sewerratsocialclub.eth'>DAO</a>
                                    <a className='block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                                       href='https://forum.sewerratsocial.club/'>Governance forum</a>
                                    <a className='cursor-pointer block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                                       href='mailto:rk@sewerratsocial.club'>Collabs</a>
                                    {/*<a className='block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline'
                                       href='mailto: rk@sewerratsocial.club'>Add CHIZ collection</a>*/}
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div className="hidden md:block flex-col flex-grow pb-4 md:pb-0 md:flex md:justify-end md:flex-row">
                        <a href='https://discord.gg/3z7zbrJY2W' target='_blank' rel='noreferrer'>
                            <i className='text-2xl fab fa-discord' />
                        </a>
                    </div>
                </div>
            </div>
        </>
    )
}
