import { useEffect, useState } from 'react'
import DOTS from 'vanta/dist/vanta.waves.min'

export default function BackgroundTopology({ color }) {
    useEffect(() => {
        if (!window) return
        const effect = DOTS({
            el: '#qisnasssdfas',
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            scale: 1.0,
            scaleMobile: 1.0,
            color: 0x888700,
            shininess: 0.0,
            waveHeight: 40.0,
            waveSpeed: 2.0,
            zoom: 0.65
        })

        return () => {
            effect.destroy()
        }
    }, [color])

    return <div id="qisnasssdfas" className="fixed inset-0 opacity-20" />
}
