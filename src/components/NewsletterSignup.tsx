import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

const NewsletterSignup = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Error",
        description: "Please enter your email address",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      
      // Check if email already exists
      const subscribersRef = collection(db, 'newsletter_subscribers');
      const q = query(subscribersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        toast({
          title: "Already Subscribed",
          description: "This email is already subscribed to our newsletter.",
        });
        return;
      }
      
      // Add new subscriber
      await addDoc(collection(db, 'newsletter_subscribers'), {
        email,
        subscribedAt: new Date().toISOString(),
        active: true
      });
      
      toast({
        title: "Success!",
        description: "You've been subscribed to our newsletter.",
      });
      setEmail("");
      
    } catch (error) {
      console.error("Error subscribing:", error);
      toast({
        title: "Error",
        description: "Failed to subscribe. Please try again.",
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="bg-secondary/50 rounded-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="h-5 w-5 text-primary" />
        <h4 className="font-semibold text-foreground">Subscribe to Newsletter</h4>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Get the latest deals and product updates delivered to your inbox
      </p>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-grow"
        />
        <Button type="submit" variant="cta" disabled={loading}>
          {loading ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
    </div>
  );
};

export default NewsletterSignup;
