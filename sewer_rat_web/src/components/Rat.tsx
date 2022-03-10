import { Loading } from '@geist-ui/react'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

export default function Rat({ toggleRat, rat, selectRatIds, getClaimStatus }) {
    const [isClaimed, setIsClaimed] = useState(null)
    const isLoading = isClaimed === null

    useEffect(() => {
        const loadData = async () => {
            const getStatus = await getClaimStatus(rat.token_id)
            console.log(getStatus)
            setIsClaimed(getStatus)
        }
        loadData()
    }, [])

    return (
        <button
            disabled={isClaimed || isLoading}
            onClick={() => toggleRat(rat)}
            type="button"
            className={classNames('block relative overflow-hidden', selectRatIds.includes(rat.token_id) && 'border-4 rounded-lg border-yellow-400')}
            key={rat.token_id}
        >
            <div className="absolute w-full text-center bottom-4 font-medium text-xs font-mono">
                {isClaimed === null && <p>Loading...</p>}
                {isClaimed && <p>Already Claimed</p>}
            </div>
            <img className={classNames('rounded shadow-xl', (isLoading || isClaimed) && 'opacity-50 cursor-not-allowed')} src={rat.image_url} alt="" />
        </button>
    )
}
