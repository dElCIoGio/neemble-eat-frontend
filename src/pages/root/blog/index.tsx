import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Link} from "react-router";
import {Badge} from "@/components/ui/badge";
import {useGetPosts} from "@/api/endpoints/blog/hooks";
import {Skeleton} from "@/components/ui/skeleton";

const topics = ["Todos", "Gestão", "Tecnologia", "Marketing", "Tendências", "Casos de Sucesso", "Dicas"]

export default function BlogPage() {
    document.title = "Blog | Neemble Eat"

    const { data: posts, isLoading } = useGetPosts()

    // Get a random read time between 3 and 10 minutes
    const getRandomReadTime = () => `${Math.floor(Math.random() * 8) + 3} min`

    // Format date to "DD MMM YYYY" format
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        })
    }

    const featuredPost = posts?.[0] // Use first post as featured
    const regularPosts = posts?.slice(1) || [] // Rest of the posts

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white">
                <section className="bg-gray-50 py-12 md:py-20">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="max-w-2xl">
                            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog Neemble Eat</h1>
                            <p className="text-xl text-gray-600">
                                Insights, dicas e histórias de sucesso para impulsionar seu restaurante
                            </p>
                        </div>
                    </div>
                </section>

                <section className="py-8 border-b">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex flex-wrap gap-2">
                                {topics.map((topic, index) => (
                                    <Button
                                        key={topic}
                                        variant={index === 0 ? "default" : "outline"}
                                        size="sm"
                                        className={index === 0 ? "bg-[#FF6B35] hover:bg-[#FF5722]" : ""}
                                    >
                                        {topic}
                                    </Button>
                                ))}
                            </div>
                            <div className="w-full md:w-auto">
                                <Input placeholder="Pesquisar artigos..." className="max-w-xs" />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="space-y-4">
                                    <Skeleton className="h-48 rounded-xl" />
                                    <Skeleton className="h-4 w-3/4" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="bg-gray-50 py-12 md:py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="max-w-2xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog Neemble Eat</h1>
                        <p className="text-xl text-gray-600">
                            Insights, dicas e histórias de sucesso para impulsionar seu restaurante
                        </p>
                    </div>
                </div>
            </section>

            {/* Search and Filter Section */}
            <section className="py-8 border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="flex flex-wrap gap-2">
                            {topics.map((topic, index) => (
                                <Button
                                    key={topic}
                                    variant={index === 0 ? "default" : "outline"}
                                    size="sm"
                                    className={index === 0 ? "bg-[#FF6B35] hover:bg-[#FF5722]" : ""}
                                >
                                    {topic}
                                </Button>
                            ))}
                        </div>
                        <div className="w-full md:w-auto">
                            <Input placeholder="Pesquisar artigos..." className="max-w-xs" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            {featuredPost && (
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link to={`/blog/${featuredPost.slug}`}>
                            <div className="grid md:grid-cols-2 gap-8 items-center bg-gray-50 rounded-2xl p-6 md:p-8 hover:bg-gray-100 transition-colors">
                                <div className="relative h-[300px] md:h-[400px] rounded-xl overflow-hidden">
                                    <img
                                        src={featuredPost.cover || "/placeholder.svg"}
                                        alt={featuredPost.title}
                                        className="object-cover"
                                    />
                                </div>
                                <div className="space-y-4">
                                    <Badge className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">Em Destaque</Badge>
                                    {featuredPost.tags?.[0] && (
                                        <Badge variant="outline">{featuredPost.tags[0]}</Badge>
                                    )}
                                    <h2 className="text-3xl font-bold">{featuredPost.title}</h2>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{formatDate(featuredPost.date)}</span>
                                        <span>•</span>
                                        <span>{getRandomReadTime()} de leitura</span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* Articles Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {regularPosts.map((post) => (
                            <Link key={post.id} to={`/blog/${post.slug}`}>
                                <article className="group">
                                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden">
                                        <img
                                            src={post.cover || "/placeholder.svg"}
                                            alt={post.title}
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    {post.tags?.[0] && (
                                        <Badge variant="outline" className="mb-3">
                                            {post.tags[0]}
                                        </Badge>
                                    )}
                                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#FF6B35]">{post.title}</h3>
                                    <div className="flex items-center gap-4 text-sm text-gray-500">
                                        <span>{formatDate(post.date)}</span>
                                        <span>•</span>
                                        <span>{getRandomReadTime()} de leitura</span>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Newsletter Section */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-2xl font-bold mb-4">Receba nossas últimas atualizações</h2>
                    <p className="text-gray-600 mb-6">Inscreva-se para receber dicas exclusivas e novidades do setor</p>
                    <div className="flex gap-2">
                        <Input placeholder="Seu email" type="email" />
                        <Button className="bg-[#FF6B35] hover:bg-[#FF5722] text-white">Inscrever</Button>
                    </div>
                </div>
            </section>
        </div>
    )
}