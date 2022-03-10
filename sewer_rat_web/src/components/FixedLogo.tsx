import Link from 'next/link'

export default function FixedLogo() {
    return (
        <div className="fixed z-10 p-2">
            <Link href="/">
                <a>
                    <img className="w-32" src="/img/logo.png" alt="" />
                </a>
            </Link>
        </div>
    )
}
