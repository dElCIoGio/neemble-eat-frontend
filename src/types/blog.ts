export type BlogPostMeta = {
    id: string
    title: string
    slug: string
    published: boolean
    date: Date
    tags: string[]
    status: string
    cover: string
    excerpt: string
}



export type BlogPost = {
    meta: BlogPostMeta
    html: string
}