import {useQuery} from "@tanstack/react-query";
import {blogApi} from "@/api/endpoints/blog/requests";


export function useGetPostBySlug(slug: string) {

    const queryKey = ["useGetPostBySlug"]

    return useQuery({
        queryKey,
        queryFn: () => blogApi.getBySlug(slug)
            .then(data => data.data)
    })

}

export function useGetPosts() {

    const queryKey = ["useGetPosts"]

    return useQuery({
        queryKey,
        queryFn: () => blogApi.getBlogPosts()
            .then(data => data.data)

    })

}