import Web3 from 'web3'
import _abi from '../data/rat-abi.json'

export const abi = _abi as any
export const providerUrl = `${process.env.NEXT_PUBLIC_WEBSOCKET_URL_ETH}`
export const provider = new Web3.providers.WebsocketProvider(providerUrl, {
    reconnect: {
        auto: true
    }
})
export const web3 = new Web3(provider)
export const contractAddress = `${process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS_ETH}`
export const contract = new web3.eth.Contract(abi, contractAddress)
