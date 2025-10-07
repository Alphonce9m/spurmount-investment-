import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, ShoppingCart, Loader2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from '@/lib/supabase/client';
import { Product } from '@/lib/supabase/models/product';

const Products = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  // Update categories to match your product categories in Supabase
  const categories = ["All", "Grains", "Pulses", "Spices", "Nuts", "Dried Fruits"];

  // Fetch products on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products when search query or category changes
  useEffect(() => {
    filterProducts();
  }, [searchQuery, selectedCategory, products]);

  // Fetch products from Supabase
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match the Product interface
      const formattedProducts = data.map((product: any) => ({
        id: product.id,
        name: product.name,
        description: product.description || '',
        price: Number(product.price) || 0,
        category: product.category || 'Uncategorized',
        in_stock: product.in_stock || false,
        is_featured: product.is_featured || false,
        stock_quantity: Number(product.stock_quantity) || 0,
        min_order: Number(product.min_order) || 1,
        unit: product.unit || 'kg',
        weight: Number(product.weight) || 0,
        images: product.images || [],
        createdAt: product.created_at || new Date().toISOString(),
        updatedAt: product.updated_at || new Date().toISOString()
      }));

      setProducts(formattedProducts);
      setFilteredProducts(formattedProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter products based on search query and selected category
  const filterProducts = () => {
    let filtered = [...products];

    // Apply category filter
    if (selectedCategory !== "All") {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        (p.name?.toLowerCase().includes(query) || 
         p.description?.toLowerCase().includes(query) ||
         p.category?.toLowerCase().includes(query))
      );
    }

    setFilteredProducts(filtered);
  };

  // Handle WhatsApp order button click
  const handleWhatsAppOrder = (product: Product) => {
    const message = `*SPURMOUNT TRADING & INVESTMENT*%0A%0A*Hello Spurmount Team,*%0A%0AI would like to place an order for:%0A%0A*Product:* ${product.name}%0A*Price:* Ksh ${product.price?.toLocaleString() || '0'}%0A%0A*Name:* %0A*Email:* %0A*Phone:* %0A*Quantity (in KGs):* %0A*Delivery Address:* %0A%0ALooking forward to your response.`;

    const formattedPhone = '254740581156'; // Your WhatsApp business number
    const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12 flex-grow">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-foreground font-heading">Our Products</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Quality wholesale products at competitive prices
          </p>
          
          {/* Search & Filters */}
          <div className="max-w-4xl mx-auto space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
              <Input
                type="text"
                placeholder="Search products or categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 justify-center">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category)}
                  size="sm"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product, index) => (
              <Card 
                key={product.id} 
                className="shadow-card hover:shadow-elevated transition-smooth border-border/50 animate-fade-up flex flex-col h-full"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="relative aspect-square">
                  <img
                    src={product.images?.[0] || "/placeholder.svg"}
                    alt={product.name}
                    className="object-cover w-full h-full"
                  />
                  {product.is_featured && (
                    <div className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">
                      Featured
                    </div>
                  )}
                </div>
                <CardContent className="flex-grow p-4 flex flex-col">
                  <div className="mb-2">
                    <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </div>
                  <h3 className="font-semibold mb-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
                    {product.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex flex-col">
                      <span className="font-bold">Ksh {product.price.toLocaleString()}</span>
                      <p className="text-xs text-muted-foreground italic">
                        * Prices are subject to change based on market conditions
                      </p>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t p-4">
                  <Button 
                    variant="default" 
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => handleWhatsAppOrder(product)}
                  >
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Order Now
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found matching your search.</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Products;
