import Particles from 'react-particles-js'

export default function CheezParticles() {
    return (
        <Particles
            params={{
                particles: {
                    line_linked: {
                        enable: false
                    },
                    move: {
                        speed: 0.3,
                        out_mode: 'out'
                    },
                    shape: {
                        type: ['image'],
                        image: [
                            {
                                src: '/img/cheez-token.png',
                                height: 50,
                                width: 50
                            },
                            {
                                src: '/img/srsc-key.png',
                                height: 50,
                                width: 50
                            }
                        ]
                    },
                    size: {
                        value: 30,
                        random: false,
                        anim: {
                            enable: true,
                            speed: 4,
                            size_min: 10,
                            sync: false
                        }
                    }
                }
            }}
            className="absolute inset-0 z-0"
        />
    )
}
