import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ProductGrid from '@/components/ProductGrid';
import CustomizeSection from '@/components/CustomizeSection';
import Footer from '@/components/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <ProductGrid />
        <CustomizeSection />
        
        {/* About Section */}
        <section id="about" className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-6">
                Why Choose <span className="text-gradient">CustomTees</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                We believe in quality over quantity. Every tee is crafted with premium materials 
                and printed with care to ensure your design looks amazing and lasts for years.
              </p>
              
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    icon: '🌱',
                    title: 'Eco-Friendly',
                    description: '100% organic cotton, sustainable practices',
                  },
                  {
                    icon: '✨',
                    title: 'Premium Quality',
                    description: 'Durable prints that won\'t fade or crack',
                  },
                  {
                    icon: '🚀',
                    title: 'Fast Delivery',
                    description: 'Quick turnaround on all orders',
                  },
                ].map((feature) => (
                  <div key={feature.title} className="p-6 rounded-2xl bg-card shadow-card">
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <h3 className="font-display text-lg font-bold text-card-foreground mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
