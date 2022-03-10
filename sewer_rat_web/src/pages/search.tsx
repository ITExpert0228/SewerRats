import { useRouter } from 'next/dist/client/router'
import { useState } from 'react'
import R from 'random'
import Link from 'next/link'
import classNames from 'classnames'
import Matrix from '../components/Matrix'
import FixedLogo from '../components/FixedLogo'

export default function SearchPage(props: any) {
    const router = useRouter()
    const [search, setSearch] = useState('')
    const [status, setStatus] = useState('idle')

    const onSubmit = (e) => {
        try {
            e.preventDefault()
            setStatus('idle')
            if (search < 0 || search > 8887) return setStatus('error')

            router.push(`/rat/${search}`)
        } catch (error) {
            console.log(error)
            setStatus('error')
        }
    }

    return (
        <>
            <Matrix />
            {/* <FixedLogo /> */}
            <div className="relative flex-1 p-6 md:p-12 flex items-center justify-center font-mono flex-col space-y-12">
                <p className="text-3xl text-center">RatPages&trade;</p>

                <form onSubmit={onSubmit} className="space-y-6">
                    <div className="flex">
                        <p className="flex-1">Search for a Rat</p>
                        <p>
                            <Link href={`/rat/${R.int(0, 8887)}`}>
                                <a className="underline hover:no-underline">Random &rarr;</a>
                            </Link>
                        </p>
                    </div>
                    <div className="flex items-stretch border-4 border-white">
                        <input autoFocus value={search} onChange={(e) => setSearch(e.target.value)} className="p-6 text-3xl max-w-3xl w-full bg-black" placeholder="378" type="number" />
                        <button type="submit" disabled={!search} className={classNames('px-6 bg-white text-black', !search && 'cursor-not-allowed')}>
                            Search
                        </button>
                    </div>
                    <p className="text-xs text-red-400">{status === 'error' && 'You must enter a number between 0 and 8887.'}</p>
                </form>
            </div>
        </>
    )
}
