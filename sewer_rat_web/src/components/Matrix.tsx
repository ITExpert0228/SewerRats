import { useEffect } from 'react'

export default function Matrix() {
    useEffect(() => {
        const c = document.getElementById('c')
        const ctx = c.getContext('2d')

        // making the canvas full screen
        c.height = window.innerHeight
        c.width = window.innerWidth

        // chinese characters - taken from the unicode charset
        let chinese = 'SRSC'
        // converting the string into an array of single characters
        chinese = chinese.split('')

        const font_size = 10
        const columns = c.width / font_size // number of columns for the rain
        // an array of drops - one per column
        const drops = []
        // x below is the x coordinate
        // 1 = y co-ordinate of the drop(same for every drop initially)
        for (let x = 0; x < columns; x++) {
            drops[x] = 1
        }

        // drawing the characters
        function draw() {
            // Black BG for the canvas
            // translucent BG to show trail
            ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
            ctx.fillRect(0, 0, c.width, c.height)

            ctx.fillStyle = 'rgba(238, 238, 0, 0.3)' // green text
            ctx.font = `${font_size}px arial`
            // looping over drops
            for (let i = 0; i < drops.length; i++) {
                // a random chinese character to print
                const text = chinese[Math.floor(Math.random() * chinese.length)]
                // x = i*font_size, y = value of drops[i]*font_size
                ctx.fillText(text, i * font_size, drops[i] * font_size)

                // sending the drop back to the top randomly after it has crossed the screen
                // adding a randomness to the reset to make the drops scattered on the Y axis
                if (drops[i] * font_size > c.height && Math.random() > 0.975) {
                    ctx.op
                    drops[i] = 0
                }

                // incrementing Y coordinate
                drops[i]++
            }
        }
        setInterval(draw, 33)

        // const resizeHandler = () => {
        //     c.height = window.innerHeight
        //     c.width = window.innerWidth
        // }

        // window.addEventListener('resize', () => {
        //     c.height = window.innerHeight
        //     c.width = window.innerWidth
        // })
        // return () => window.removeEventListener('resize', resizeHandler)
    }, [])
    return <canvas className="absolute" id="c" />
}
