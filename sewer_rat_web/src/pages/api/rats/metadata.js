const axios = require('axios')
const { isMinted, allowCors, hiddenMetadata } = require('../../../utils/utils')

const handler = async (req, res) => {
    try {
        const fullUrl = `https://${req.headers.host}`
        const tokenId = req.query.id

        const minted = await isMinted(tokenId)
        if (!minted) return res.status(400).json(hiddenMetadata)

        const url = `https://gateway.pinata.cloud/ipfs/QmRkc8L6hBK94aGwAEcaMgtPUmACB9aQ1m6brpzcRAPbyS/0000${tokenId}`
        const { data } = await axios.get(url)
        data.image = `${fullUrl}/api/rats/image?id=${tokenId}`
        res.json(data)
    } catch (error) {
        console.log(error)
        res.status(400).json({ error: 'An error occurred.' })
    }
}

module.exports = allowCors(handler)
