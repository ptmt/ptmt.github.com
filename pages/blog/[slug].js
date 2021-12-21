import { PostPage } from '../../components/PostPage'
import {postsDirectory, getPostBySlug, getAllPosts} from '../../lib/datasource'
import markdownToHtml from '../../lib/markdownToHtml'

export default function Post({post}) {
    return <PostPage post={post} />
}

export async function getStaticProps({params}) {
    const post = getPostBySlug(postsDirectory, params.slug, [
        'title',
        'date',
        'slug',
        'author',
        'content',
        'ogImage',
        'coverImage',
    ])
    const content = await markdownToHtml(post.content || '')

    return {
        props: {
            post: {
                ...post,
                content,
            },
        },
    }
}

export async function getStaticPaths() {
    const posts = getAllPosts(['slug'])

    return {
        paths: posts.map((post) => {
            return {
                params: {
                    slug: post.slug,
                },
            }
        }),
        fallback: false,
    }
}