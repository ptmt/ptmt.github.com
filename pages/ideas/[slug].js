import { getAllIdeas, getPostBySlug, ideasDirectory } from "../../lib/datasource";
import { PostPage } from '../../components/PostPage.js'
import markdownToHtml from '../../lib/markdownToHtml'

export default function Idea({post}) {
    return <PostPage post={post} />
}

export async function getStaticProps({params}) {
    const post = getPostBySlug(ideasDirectory, params.slug, [
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
    const posts = getAllIdeas(['slug'])

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