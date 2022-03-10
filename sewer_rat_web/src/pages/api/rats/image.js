const request = require('request')
const { isMinted, allowCors } = require('../../../utils/utils')

const handler = async (req, res) => {
    try {
        const tokenId = req.query.id

        const minted = await isMinted(tokenId)
        if (!minted) return res.status(400).json({ error: 'This token has not been minted.' })

        const url = `https://gateway.pinata.cloud/ipfs/QmZFoQ5JPkBAsokPucPcYVrM5jFykPYnGFgEaSPE1Y7J6W/rat${tokenId}.png`
        request(url).pipe(res)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'An error occurred.' })
    }
}

module.exports = allowCors(handler)
