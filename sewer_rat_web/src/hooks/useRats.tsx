import { useState } from 'react'
import useSWR from 'swr'

export default function useRats(address) {
    const [offset, setOffset] = useState(0)

    const nextPage = () => setOffset((_) => _ + 50)
    const previousPage = () => setOffset((_) => _ - 50)

    const { data: rats } = useSWR(
        address ? `https://api.opensea.io/api/v1/assets?owner=${address}&asset_contract_address=${process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS_ETH}&order_direction=desc&offset=${offset}&limit=50` : null
    )

    return {
        offset,
        nextPage,
        previousPage,
        rats: rats ? rats.assets : []
    }
}
