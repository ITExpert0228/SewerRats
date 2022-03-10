import { VictoryPie, VictoryLabel } from 'victory'
import { motion } from 'framer-motion'

export default function CheezChart() {
    return (
        <motion.div className="relative z-10 shadow-xl rounded-xl p-1 bg-cheese-rainbow">
            <div className="w-full bg-black text-white rounded-xl shadow-inner p-2">
                <div className="h-80">
                    <VictoryPie
                        animate={{
                            duration: 2000
                        }}
                        style={{ labels: { fill: 'transparent' } }}
                        labelRadius={({ innerRadius }) => innerRadius + 20}
                        // radius={({ datum }) => 50 + datum.y * 20}
                        innerRadius={50}
                        // labelComponent={<VictoryLabel angle={45} />}
                        colorScale={['#007f5fff', '#80b918ff', '#bfd200ff', '#eeef20ff']}
                        data={[
                            { x: 'For Rats', y: 88880000 },
                            { x: 'For Drops', y: 44440000 },
                            { x: 'For Charity', y: 8888000 },
                            { x: 'For Treasury', y: 35552000 }
                        ]}
                    />
                </div>
                <div className="p-6 font-mono text-xs">
                    <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded blocpk" style={{ backgroundColor: '#007f5fff' }} />
                        <div className="hidden md:block border border-dotted flex-1" />
                        <p>88,880,000 for Rats</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded blocpk" style={{ backgroundColor: '#80b918ff' }} />
                        <div className="hidden md:block border border-dotted flex-1" />
                        <p>44,440,000 for Airdrops</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded blocpk" style={{ backgroundColor: '#bfd200ff' }} />
                        <div className="hidden md:block border border-dotted flex-1" />
                        <p>8,888,000 for Charity</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="w-3 h-3 rounded blocpk" style={{ backgroundColor: '#eeef20ff' }} />
                        <div className="hidden md:block border border-dotted flex-1" />
                        <p>35,552,000 for Treasury</p>
                    </div>
                </div>
                {/* #007f5fff #80b918ff #bfd200ff #eeef20ff */}
            </div>
        </motion.div>
    )
}
