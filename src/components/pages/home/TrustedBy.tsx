
function TrustedBy() {
    return (
        <section className="border-t border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-center text-gray-600 mb-8">Utilizado por restaurantes em toda Angola</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center opacity-50">
                    {Array.from({length: 4}).map((_, i) => (
                        <div key={i} className="h-12 w-32 bg-gray-200 rounded"/>
                    ))}
                </div>
            </div>
        </section>
    );
}

export default TrustedBy;