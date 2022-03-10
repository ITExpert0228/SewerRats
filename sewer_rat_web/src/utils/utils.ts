const Web3 = require('web3')
const abi = require('../data/cheddaz-abi.json')

const isMinted = async (id) => {
    const web3 = await new Web3(process.env.NEXT_PUBLIC_WEBSOCKET_URL_ETH)

    const contract = await new web3.eth.Contract(abi, `${process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS_ETH}`)

    const totalySupply = await contract.methods.totalSupply().call()
    const maxId = totalySupply - 1

    if (id > maxId) return false

    return true
}

const hiddenMetadata = {
    name: 'Hidden Rat',
    image: 'https://app.sewerratsocial.club/img/hidden.png',
    attributes: [
        {
            trait_type: 'Hidden',
            value: 'Hidden'
        }
    ]
}

const allowCors = (fn) => async (req, res) => {
    res.setHeader('Access-Control-Allow-Credentials', true)
    res.setHeader('Access-Control-Allow-Origin', '*')
    // another common pattern
    // res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
    res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version')
    if (req.method === 'OPTIONS') {
        res.status(200).end()
        return
    }
    return await fn(req, res)
}

module.exports = {
    isMinted,
    allowCors,
    hiddenMetadata
}
