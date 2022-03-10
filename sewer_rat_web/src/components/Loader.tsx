import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Flicker, Jitter, JumpAround } from 'react-flicker'

export default function Loader() {
    const [loaded, setLoaded] = useState(false)
    useEffect(() => {
        setInterval(() => {
            setLoaded(true)
        }, 2000)
    }, [])

    return (
        <>
            <AnimatePresence>
                {!loaded && (
                    <motion.div exit={{ y: '-100%' }} transition={{ duration: 2 }} className="fixed z-50 inset-0 bg-black flex items-center justify-center shadow-2xl space-y-4 flex-col border-b-4 border-yellow-500">
                        <Flicker>
                            <img className="w-60" src="/img/neon-sticker.png " alt="" />
                        </Flicker>
                        <p className="font-mono opacity-50 text-xs">Loading...</p>
                        <div className="font-extended text-xs uppercase text-center">
                            <p>8888 Sewer Rats</p>
                            <p>Born and Raisedon the </p>
                            <p>Ethereum Blockchain</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
