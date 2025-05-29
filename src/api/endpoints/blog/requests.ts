import {BlogPost, BlogPostMeta} from "@/types/blog";
import {apiClient} from "@/api/axios";
import {AxiosResponse} from "axios";


const baseRoute = "/blog"


export const blogApi = {
    getBlogPosts: async () =>
        await apiClient.get<BlogPostMeta[]>(`${baseRoute}/`),

    getBySlug: async (slug: string): Promise<AxiosResponse<BlogPost>> =>
        await apiClient.get<BlogPost>(`${baseRoute}/${slug}`)
}