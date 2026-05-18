export const GalleryLoading = () => {
  return (
    <div className="min-h-screen bg-page-primary">
      <section className="relative py-20 bg-gradient-to-r from-page-secondary to-page-tertiary overflow-hidden">
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="h-12 bg-gray-300 rounded-full w-96 mx-auto mb-6 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-3/4 mx-auto mb-2 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-2/3 mx-auto mb-8 animate-pulse"></div>
            <div className="flex gap-4 justify-center">
              <div className="h-12 bg-gray-300 rounded-full w-40 animate-pulse"></div>
              <div className="h-12 bg-gray-300 rounded-full w-40 animate-pulse"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-page-primary border-b border-light">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-300 mb-3 animate-pulse"></div>
                <div className="h-8 bg-gray-300 rounded w-16 mx-auto mb-1 animate-pulse"></div>
                <div className="h-4 bg-gray-300 rounded w-20 mx-auto animate-pulse"></div>
              </div>
            ))} 
          </div>
        </div>
      </section>

      <section className="py-8 bg-page-secondary">
        <div className="container mx-auto px-4">
          <div className="h-12 bg-gray-300 rounded-full max-w-lg mb-4 animate-pulse"></div>
          <div className="flex gap-4">
            <div className="h-10 bg-gray-300 rounded-full w-40 animate-pulse"></div>
            <div className="h-10 bg-gray-300 rounded-full w-20 animate-pulse"></div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-page-primary">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div className="h-6 bg-gray-300 rounded w-40 animate-pulse"></div>
            <div className="h-6 bg-gray-300 rounded w-32 animate-pulse"></div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-page-secondary rounded-2xl overflow-hidden border border-light">
                <div className="aspect-square bg-gray-300 animate-pulse"></div>
                <div className="p-6">
                  <div className="h-4 bg-gray-300 rounded w-24 mb-3 animate-pulse"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2 animate-pulse"></div>
                  <div className="h-4 bg-gray-300 rounded mb-4 animate-pulse"></div>
                  <div className="flex gap-2 mb-4">
                    <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
                    <div className="h-6 bg-gray-300 rounded w-16 animate-pulse"></div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-light">
                    <div>
                      <div className="h-4 bg-gray-300 rounded w-12 mb-1 animate-pulse"></div>
                      <div className="h-5 bg-gray-300 rounded w-20 animate-pulse"></div>
                    </div>
                    <div className="flex gap-2">
                      <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
                      <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};