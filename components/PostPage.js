

import {useRouter} from 'next/router'
import ErrorPage from 'next/error'
import Head from 'next/head'
import markdownStyles from './markdown-styles.module.css'

export function PostPage({post, preview}) {
    console.log(">> postPage render", post)
    const router = useRouter()
    if (!router.isFallback && !post?.slug) {
        return <ErrorPage statusCode={404}/>
    }
    return (
        <Layout preview={preview}>
            <Container>
                <Header/>
                {router.isFallback ? (
                    <PostTitle>Loading…</PostTitle>
                ) : (
                    <>
                        <article className="mb-32">
                            <Head>
                                <title>
                                    {post.title} | Next.js Blog Example with
                                </title>
                                {post.ogImage ? <meta property="og:image" content={post.ogImage.url}/> : null}
                            </Head>
                            <PostHeader
                                title={post.title}
                                coverImage={post.coverImage}
                                date={post.date}
                                author={post.author}
                            />
                            <PostBody content={post.content}/>
                        </article>
                    </>
                )}
            </Container>
        </Layout>
    )
}

function Layout({children}) {
    return (<div className="p-10">{children}</div>)
}

function Container({children}) {
    return (<div className="max-w-2xl mx-auto">{children}</div>)
}

function Header({children}) {
    return (<div>{children}</div>)
}

function PostHeader({title}) {
    return (<div>
        <PostTitle>{title}</PostTitle>
    </div>)
}
export function PostTitle({children}) {
    return (
        <h1 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight border-b">{children}</h1>
    )
}

export function PostBody({content}) {
    return (<div
        className={markdownStyles['markdown']}
        dangerouslySetInnerHTML={{__html: content}}
    />)
}