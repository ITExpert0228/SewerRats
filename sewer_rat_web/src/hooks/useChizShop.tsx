import { Button, useToasts } from '@geist-ui/react'
import { useEffect, useState, useContext } from 'react'
import Web3 from 'web3'
import { useWallet } from 'use-wallet'
import chizShopAbi from '../data/chiz-shop-abi.json'
import chizTokenAbi from '../data/chiz-token-abi.json'
import erc721 from '../data/erc721-abi.json'

export default function useChizShop(slug) {
    const wallet = useWallet()
    const [data, setData] = useState({})
    const [status, setStatus] = useState('loading')
    const [stock, setStock] = useState(null)
    const [, setToast] = useToasts()
    var web3;
    var contract;
    var chizShopContract;
    var erc20Contract;

    if(wallet.chanId == process.env.NEXT_PUBLIC_NET_ID_ETH){
        web3 = new Web3(process.env.NEXT_PUBLIC_WEBSOCKET_URL_ETH);
        contract = new web3.eth.Contract(chizShopAbi as any, process.env.NEXT_PUBLIC_CHIZ_SHOP_ADDRESS_ETH);
        chizShopContract = process.env.NEXT_PUBLIC_CHIZ_SHOP_ADDRESS_ETH;
        erc20Contract = process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS_ETH;
    }

    if(wallet.chanId == process.env.NEXT_PUBLIC_NET_ID_POLYGON){
        web3 = new Web3(process.env.NEXT_PUBLIC_WEBSOCKET_URL_POLYGON);
        contract = new web3.eth.Contract(chizShopAbi as any, process.env.NEXT_PUBLIC_CHIZ_SHOP_ADDRESS_POLYGON);
        chizShopContract = process.env.NEXT_PUBLIC_CHIZ_SHOP_ADDRESS_POLYGON;
        erc20Contract = process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS_POLYGON;
    }

    const getData = async () => {
        try {
           
            console.log(slug);
            const dataFromWeb3 = await contract.methods.Products(slug).call();
            console.log(dataFromWeb3);
            setData({ ...dataFromWeb3 })

            const tokenContract = new web3.eth.Contract(erc721 as any, dataFromWeb3.contractAddress)
            setStatus('idle')

            if (dataFromWeb3.multiple) {
                const tokenBalance = await tokenContract.methods.balanceOf(chizShopContract).call()
                setStock(tokenBalance)
            } else {
                console.log(dataFromWeb3.tokenId)
                const confirmOwnership = await tokenContract.methods.ownerOf(dataFromWeb3.tokenId).call()
                console.log(confirmOwnership)
                if (web3.utils.toChecksumAddress(confirmOwnership) === web3.utils.toChecksumAddress(chizShopContract)) return setStock(1)
                setStock(0)
            }
        } catch (error) {
            setStatus('idle')
            console.log(error)
        }
    }

    const buy = async () => {
        try {
            console.log("buying");
            console.log(wallet.account);
            if (!wallet.account) return wallet.connect();
            
            const web3 = new Web3(wallet.ethereum)
            const contract = new web3.eth.Contract(chizShopAbi as any, chizShopContract)
            const chizContract = new web3.eth.Contract(chizTokenAbi as any, erc20Contract)

            const getAllowed = await chizContract.methods.allowance(wallet.account, chizShopContract).call()

            console.log('productPrice', data.price)
            console.log('approvedAmount', getAllowed)

            if (getAllowed < data.price) {
                console.log('allowed less than price');
                const approve = await chizContract.methods.approve(chizShopContract, web3.utils.toWei('999999999999')).send({ from: wallet.account })
            }

            const transaction = await contract.methods.purchaseProduct(slug).encodeABI()

            const gas = await web3.eth.estimateGas({ from: wallet.account, to: chizShopContract, data: transaction })

            const sendTransaction = await contract.methods.purchaseProduct(slug).send({ from: wallet.account, gas })
        } catch (error) {
            setToast({ text: error.message, type: 'error' })
            console.log(error)
        }
    }

    useEffect(() => {
        getData()
    }, [])

    return {
        buy,
        getData,
        status,
        data,
        stock,
        setStock,
        setData,
    }
}
