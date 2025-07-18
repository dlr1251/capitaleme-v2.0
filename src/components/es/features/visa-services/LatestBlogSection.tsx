// React import removed - not needed in React 17+
// import { HiArrowRight, HiCalendar, HiClock } from 'react-icons/hi';

const LatestBlogSection = ({ posts = [] }) => {
  // Mock data for demonstration - replace with actual blog posts
  const latestPosts = posts.length > 0 ? posts.slice(0, 3) : [
    {
      id: 1,
      title: "Contando tus Días: Entendiendo los Límites de Tiempo de Visa Colombiana",
      excerpt: "Aprende sobre los importantes límites de tiempo y restricciones para diferentes categorías de visa en Colombia.",
      image: "/blog/counting-your-days/counting-your-days.webp",
      date: "2024",
      readingTime: 5,
      category: "Inmigración"
    },
    {
      id: 2,
      title: "Confusión DNV: Aclarando Conceptos Erróneos Comunes",
      excerpt: "Desglosamos los malentendidos más comunes sobre los requisitos y procesos de visa colombiana.",
      image: "/blog/dnv-confusion/img-1.webp",
      date: "2024",
      readingTime: 4,
      category: "Proceso de Visa"
    },
    {
      id: 3,
      title: "Sobre Precios Gringo: Entendiendo las Diferencias de Costo en Colombia",
      excerpt: "Explora la realidad detrás de las diferencias de precios y cómo afectan los costos de tu solicitud de visa.",
      image: "/blog/gringo-prices/img-1.webp",
      date: "2024",
      readingTime: 6,
      category: "Costos"
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">
            Lo Último de Nuestro Blog
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Mantente informado con las últimas perspectivas, actualizaciones y consejos expertos sobre inmigración colombiana y procesos de visa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {latestPosts.map((post, index) => (
            <article key={post.id} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded-full">
                    {post.category}
                  </span>
                </div>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-3">
                  {/* <HiCalendar className="w-4 h-4 mr-1" /> */}
                  <span>{post.date}</span>
                  <span className="mx-2">•</span>
                  {/* <HiClock className="w-4 h-4 mr-1" /> */}
                  <span>{post.readingTime} min de lectura</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-200 line-clamp-2">
                  {post.title}
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors duration-200 flex items-center group">
                    Leer Más
                    {/* <HiArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" /> */}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* View All Posts CTA */}
        <div className="text-center mt-12">
          <button className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl">
            Ver Todas las Publicaciones
            {/* <HiArrowRight className="w-5 h-5 ml-2" /> */}
          </button>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogSection; 