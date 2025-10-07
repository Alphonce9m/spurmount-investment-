import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

// Static testimonials data
const testimonials = [
  {
    id: 1,
    name: "John Doe",
    role: "Restaurant Owner",
    content: "Excellent quality products and reliable delivery. Highly recommended!",
    rating: 5,
    image: "/placeholder-user.jpg"
  },
  {
    id: 2,
    name: "Jane Smith",
    role: "Catering Manager",
    content: "Great variety of dry food products at competitive prices.",
    rating: 4,
    image: "/placeholder-user.jpg"
  },
  {
    id: 3,
    name: "Michael Johnson",
    role: "Hotel Chef",
    content: "Consistently fresh and high-quality ingredients for our kitchen.",
    rating: 5,
    image: "/placeholder-user.jpg"
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground font-heading">
            What Our Clients Say
          </h2>
          <p className="text-lg text-muted-foreground">
            Trusted by hundreds of businesses across Kenya
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id}
              className="shadow-card hover:shadow-elevated transition-smooth border-border/50 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-8">
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-accent text-accent" />
                  ))}
                </div>
                <p className="text-muted-foreground mb-6 italic">
                  "{testimonial.content}"
                </p>
                <div>
                  <p className="font-semibold text-card-foreground">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
