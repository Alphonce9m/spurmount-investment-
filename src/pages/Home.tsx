import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShoppingBag, Truck, Shield, ArrowRight, Star } from "lucide-react";
import heroBanner from "@/assets/hero-banner.jpg";

const Home = () => {
  const features = [
    {
      icon: Shield,
      title: "Quality Guaranteed",
      description: "Only the finest products for your business",
    },
    {
      icon: Truck,
      title: "Fast Delivery",
      description: "Quick and reliable delivery service",
    },
    {
      icon: ShoppingBag,
      title: "Wholesale Prices",
      description: "Best prices for bulk purchases",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0"
          style={{
            backgroundImage: `url(${heroBanner})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 gradient-hero opacity-90"></div>
        </div>
        
        <div className="container mx-auto px-4 z-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-primary-foreground mb-6 animate-fade-up font-heading">
            Spurmount Trading & Investments
          </h1>
          <p className="text-xl md:text-2xl text-primary-foreground/90 mb-4 animate-fade-up" style={{ animationDelay: "0.1s" }}>
            Eat Quality, Live Quality
          </p>
          <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: "0.2s" }}>
            Your trusted wholesale partner for quality groceries, beverages, and household products
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up" style={{ animationDelay: "0.3s" }}>
            <Link to="/products">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Browse Products
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link to="/how-to-order">
              <Button 
                variant="outline" 
                size="lg" 
                className="w-full sm:w-auto bg-primary-foreground/10 border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/20 backdrop-blur"
              >
                How to Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 gradient-subtle">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground font-heading">Why Choose Spurmount?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="shadow-card hover:shadow-elevated transition-smooth border-border/50 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-accent mb-4">
                    <feature.icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-card-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Featured Products</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Discover our premium selection of quality products at wholesale prices
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 'sanitary-pads-8pcs',
                name: 'Softcare Sanitary Pads',
                description: 'Premium quality sanitary pads, 8 packs for maximum comfort and protection.',
                price: 1510,
                unit: '8 packs',
                image: 'https://cctpymwbasloxguqntwe.supabase.co/storage/v1/object/public/product-images/IMG-20251007-WA0050.jpg',
                rating: 4.8,
                marketPrice: 1700,
                youSave: 190
              },
              {
                id: 'cooking-oil-5l',
                name: 'Fresh Fry Cooking Oil',
                description: 'Premium quality cooking oil for all your frying and cooking needs.',
                price: 1255,
                unit: '5L',
                image: 'https://cctpymwbasloxguqntwe.supabase.co/storage/v1/object/public/product-images/IMG-20251007-WA0061.jpg',
                rating: 4.7,
                marketPrice: 1400,
                youSave: 145
              },
              {
                id: 'biryani-rice-25kg',
                name: 'Prime Biryani Rice',
                description: 'Premium quality basmati rice, perfect for biryani and other aromatic dishes.',
                price: 2550,
                unit: '25kg',
                image: 'https://cctpymwbasloxguqntwe.supabase.co/storage/v1/object/public/product-images/IMG-20251002-WA0020.jpg',
                rating: 4.9,
                marketPrice: 2800,
                youSave: 250
              }
            ].map((product) => (
              <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow duration-300">
                <div className="h-48 bg-muted/50 overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                </div>
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg text-foreground">{product.name}</h3>
                    <div className="flex items-center bg-primary/10 px-2 py-1 rounded-full">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-bold text-foreground">Ksh {product.price.toLocaleString()}</span>
                      <span className="text-sm text-muted-foreground line-through">Ksh {product.marketPrice.toLocaleString()}</span>
                      <span className="text-sm text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">
                        Save Ksh {product.youSave}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">Per {product.unit}</span>
                  </div>
                  <Button size="sm" className="w-full mt-4" asChild>
                    <Link to={`/products?search=${encodeURIComponent(product.name.split(' ')[0])}`}>
                      View Details
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button asChild variant="outline">
              <Link to="/products" className="flex items-center">
                View All Products <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
