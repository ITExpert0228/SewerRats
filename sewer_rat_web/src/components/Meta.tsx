import Head from 'next/head'

const Meta = () => {
    const title = 'Sewer Rat Social Club'
    const description = 'Sewer Rat Social Club is the most exclusive club on Ethereum.'
    const url = 'https://sewerratsocial.club/'

    return (
        <Head>
            <title>{title}</title>
            <meta name="description" content={description} />
            <meta property="og:type" content="website" />
            <meta name="og:title" property="og:title" content={title} />
            <meta name="og:description" property="og:description" content={description} />
            <meta property="og:site_name" content={title} />
            <meta property="og:url" content={url} />
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            <meta name="twitter:site" content={url} />
            <meta name="twitter:creator" content="@al5ina5" />
            <link rel="icon" type="image/png" href="/img/og-image.jpg" />
            <link rel="apple-touch-icon" href="/img/og-image.jpg" />
            <meta property="og:image" content="https://sewer-rat.vercel.app/img/og-image.jpg" />
            <meta name="twitter:image" content="https://sewer-rat.vercel.app/img/og-image.jpg" />
        </Head>
    )
}

export default Meta
