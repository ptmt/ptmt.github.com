import Link from 'next/link'
import {getAllPosts, getAllIdeas, getAllProjects, groupByYear} from "../lib/datasource"


export default function Home({posts, ideas, projects}) {
    return (
        <div className="p-2 bg-white grid md:grid-rows-2 md:grid-cols-2">
            <Section title="Ideas">
                <LinksByYears path="ideas" posts={ideas} withStatus={true}/>
            </Section>
            <Section title="Projects">
                <LinksByYears path="projects" posts={projects}/>
            </Section>
            <Section title="Blog">
                <LinksByYears path="blog" posts={posts}/>
            </Section>
            <Section title="About">
                My name is Dmitry Loktev.
            </Section>
        </div>
    )
}

function Section({title, children}) {
    return (
        <section className="p-6">
            <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight border-b">
                {title}
            </h2>
            {children}
        </section>)
}

function LinksByYears({path, posts, withStatus}) {

    return (
        <div className="grid grid-cols-1">
            {sortedKeys(posts).map((year) => (
                posts[year] ? <Links posts={posts[year]} year={year} key={year} withStatus={withStatus} path={path}/> : null
            ))}
        </div>
    )
}

function Links({path, posts, year, withStatus}) {
    return (
        <div>
            <div className="font-bold font-mono">{year}</div>
            <div className="flex flex-row flex-wrap">
                {posts.map((post) => (
                    <div className="flex flex-row mr-3 font-mono" key={post.slug}>
                        <Link as={`/${path}/${post.slug}`} href={`/${path}/[slug]`}>
                            <a className="hover:underline">
                                {withStatus ? '- [ ]' : '·'} {post.title}
                            </a>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    )
}

function sortedKeys(hashMap) {
    return Object.keys(hashMap).sort((year1, year2) => (year1 > year2 ? -1 : 1));
}

export async function getStaticProps() {
    const posts = getAllPosts([
        'title',
        'year',
        'slug'
    ])

    const ideas = getAllIdeas([
        'title',
        'year',
        'slug',
        'details'
    ])

    const projects = getAllProjects([
        'title',
        'year',
        'slug'
    ])


    return {
        props: {posts: groupByYear(posts), ideas: groupByYear(ideas), projects: groupByYear(projects)},
    }
}