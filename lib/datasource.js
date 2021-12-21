import fs from 'fs'
import { join } from 'path'
import matter from 'gray-matter'

export const postsDirectory = join(process.cwd(), '_posts')
export const ideasDirectory = join(process.cwd(), '_ideas')
export const projectsDirectory = join(process.cwd(), '_projects')

function getEntitySlugs(directory) {
  return fs.readdirSync(directory)
}

export function getPostBySlug(directory, slug, fields = []) {
  const realSlug = slug.replace(/\.md$/, '')
  const fullPath = join(directory, `${realSlug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const items = {}

  // Ensure only the minimal needed data is exposed
  fields.forEach((field) => {
    if (field === 'slug') {
      items[field] = realSlug
    }
    if (field === 'content') {
      items[field] = content
    }
    if (field === 'year' && !Object.keys(data).includes('year') && Object.keys(data).includes('date')) {
        items['year'] = new Date(data['date']).getFullYear()
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field]
    }
  })

  return items
}

function getAllEntities(directory, fields = []) {
  const slugs = getEntitySlugs(directory)
  return slugs
    .filter(slug => slug.includes(".md"))
    .map((slug) => getPostBySlug(directory, slug, fields))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1))
}

export function groupByYear(posts) {
    return posts.reduce(function (r, a) {
        r[a.year] = r[a.year] || []
        r[a.year].push(a)
        return r
    }, Object.create(null))
}


export function getAllPosts(fields = []) {
  return getAllEntities(postsDirectory, fields)
}

export function getAllIdeas(fields = []) {
  return getAllEntities(ideasDirectory, fields)
}

export function getAllProjects(fields = []) {
  return getAllEntities(projectsDirectory, fields)
}