import {Button} from "@/components/ui/button.tsx";
import {Link, useParams} from "react-router";
import {ChevronLeft} from "lucide-react";
import {Badge} from "@/components/ui/badge.tsx";
import {useGetPostBySlug} from "@/api/endpoints/blog/hooks.ts";
import {Helmet} from "react-helmet-async";



export default function ArticlePage() {
    const { articleId } = useParams() as { articleId: string };
    const { data: article } = useGetPostBySlug(articleId);

    if (!article) {
        return <div>Loading...</div>;
    }

    // Format date to "DD MMM YYYY" format
    const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-white">
            <Helmet>
                <title>{article.meta.title} | Neemble Eat</title>
                <meta name="description" content={article.meta.excerpt || 'Descubra insights e dicas para o sucesso do seu restaurante.'} />
                <link rel="canonical" href={`https://neemble-eat.ao/blog/${article.meta.slug}`} />

                {/* Open Graph */}
                <meta property="og:title" content={article.meta.title} />
                <meta property="og:description" content={article.meta.excerpt || 'Conteúdo exclusivo para donos de restaurantes'} />
                <meta property="og:type" content="article" />
                <meta property="og:image" content={article.meta.cover || 'https://neemble-eat.ao/default-og-image.png'} />
                <meta property="og:url" content={`https://neemble-eat.ao/blog/${article.meta.slug}`} />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content={article.meta.title} />
                <meta name="twitter:description" content={article.meta.excerpt || 'Conteúdo exclusivo para donos de restaurantes'} />
                <meta name="twitter:image" content={article.meta.cover || 'https://neemble-eat.ao/default-og-image.png'} />
            </Helmet>
            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Back Button */}
                <Link to="/blog">
                    <Button variant="ghost" className="mb-8">
                        <ChevronLeft className="mr-2 h-4 w-4"/>
                        Voltar para o Blog
                    </Button>
                </Link>

                {/* Article Header */}
                <div className="mb-8">
                    {article.meta.tags?.[0] && (
                        <Badge variant="outline" className="mb-4">
                            {article.meta.tags[0]}
                        </Badge>
                    )}
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{article.meta.title}</h1>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{formatDate(article.meta.date)}</span>
                    </div>
                </div>

                {/* Featured Image */}
                <div className="relative h-[400px] mb-8 rounded-xl overflow-hidden">
                    <img
                        src={article.meta.cover || "/placeholder.svg"}
                        alt={article.meta.title}
                        className="object-cover"
                    />
                </div>

                {/* Article Content */}
                <div className="prose prose-lg max-w-none" dangerouslySetInnerHTML={{__html: article.html}}/>

                {/* Share Section */}
                <div className="mt-12 pt-8 border-t">
                    <h2 className="text-xl font-bold mb-4">Compartilhe este artigo</h2>
                    <div className="flex gap-2">
                        <Button variant="outline">Facebook</Button>
                        <Button variant="outline">Twitter</Button>
                        <Button variant="outline">LinkedIn</Button>
                    </div>
                </div>
            </article>
        </div>
    );
}