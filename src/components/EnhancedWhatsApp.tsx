import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, ChevronDown, ChevronUp, Clock, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const EnhancedWhatsApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [hasSentWelcome, setHasSentWelcome] = useState(false);
  const { toast } = useToast();
  const phoneNumber = "254740581156";
  const businessHours = {
    weekdays: "8:00 AM - 6:00 PM",
    saturday: "9:00 AM - 4:00 PM",
    sunday: "Closed"
  };

  const quickQuestions = [
    "What are your business hours?",
    "Do you deliver to my area?",
    "What payment methods do you accept?",
    "Can I place a bulk order?"
  ];

  const handleSendMessage = (customMessage?: string, isAutoMessage = false) => {
    let msg = customMessage || message.trim();
    if (!msg) return;

    // Handle special commands
    const lowerMsg = msg.toLowerCase().trim();
    let response = '';
    
    if (lowerMsg === 'menu') {
      response = `*📋 Our Product Categories*\n\n` +
      `• *Grains & Cereals*\n  - Rice (Basmati, Pishori, Soya)\n  - Maize Flour\n  - Wheat Flour\n  - Soya Beans\n\n` +
      `• *Pulses & Legumes*\n  - Green Grams\n  - Yellow Peas\n  - Beans (Nairobi, Red, Yellow)\n  - Lentils\n\n` +
      `• *Spices & Seasonings*\n  - Salt\n  - Black Pepper\n  - Mixed Masala\n  - Curry Powder\n\n` +
      `• *Cooking Oils*\n  - Sunflower Oil\n  - Vegetable Oil\n  - Palm Oil\n\n` +
      `• *Canned Goods*\n  - Tomatoes\n  - Baked Beans\n  - Sardines\n\n` +
      `*📞* Call +254 740 581156 for bulk pricing and orders`;
      
      msg = response;
      isAutoMessage = true;
    } 
    else if (lowerMsg === 'prices' || lowerMsg.includes('price list')) {
      response = `*💰 Current Price List (Per 50kg Bag)*\n\n` +
      `*Grains & Cereals*\n` +
      `• Rice (Basmati) - KES 7,500\n` +
      `• Rice (Pishori) - KES 6,900\n` +
      `• Maize Flour - KES 3,200\n` +
      `• Wheat Flour - KES 4,500\n\n` +
      `*Pulses & Legumes*\n` +
      `• Green Grams - KES 8,500\n` +
      `• Yellow Peas - KES 5,800\n` +
      `• Beans (Nairobi) - KES 9,200\n\n` +
      `*Special Offer!*\n` +
      `Order 10+ bags and get 3% discount!\n\n` +
      `*📅* Prices are subject to change. Last updated: ${new Date().toLocaleDateString()}\n` +
      `*📞* Call +254 740 581156 to confirm current prices`;
      
      msg = response;
      isAutoMessage = true;
    }

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`;
    
    if (!isAutoMessage) {
      window.open(whatsappUrl, '_blank');
    } else {
      // For auto messages, open in a hidden iframe to send without redirect
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = whatsappUrl;
      document.body.appendChild(iframe);
      setTimeout(() => document.body.removeChild(iframe), 1000);
    }
    
    if (!customMessage) {
      setMessage("");
      setUnreadCount(0);
    }
    
    toast({
      title: "Opening WhatsApp...",
      description: "You'll be redirected to WhatsApp to continue your conversation."
    });
  };

  const handleQuickQuestion = (question: string) => {
    setMessage(question);
    // Auto-send the quick question
    setTimeout(() => handleSendMessage(question, false), 300);
  };

  useEffect(() => {
    // Check business hours to show appropriate status
    const now = new Date();
    const day = now.getDay();
    const hours = now.getHours();
    const isOpen = 
      (day >= 1 && day <= 5 && hours >= 8 && hours < 18) || // Weekdays 8AM-6PM
      (day === 6 && hours >= 9 && hours < 16); // Saturday 9AM-4PM

    setIsTyping(isOpen);

    // Send welcome message when component mounts if it's the first time
    const hasInteracted = localStorage.getItem('hasInteractedWithChat');
    if (!hasInteracted && isOpen) {
      setTimeout(() => {
        const welcomeMessage = `👋 *Welcome to Spurmount Trading & Investment!*\n\nThank you for reaching out to Kenya's premier wholesale supplier of quality dry foodstuffs.\n\n*Business Hours:*\n📅 Mon-Fri: 8:00 AM - 6:00 PM\n📅 Sat: 9:00 AM - 4:00 PM\n📅 Sun: Closed\n\n*Popular Categories:*
• Grains & Cereals
• Pulses & Legumes
• Spices & Seasonings
• Cooking Oils
• Canned Goods\n\n*How can we assist you today?* You can ask about:\n• Product availability
• Bulk pricing
• Delivery options\n\n*Quick Tip:* Type 'menu' to see our product categories or 'prices' for our latest price list.`;
        
        handleSendMessage(welcomeMessage, true);
        localStorage.setItem('hasInteractedWithChat', 'true');
        setHasSentWelcome(true);
      }, 1500); // Small delay to ensure chat is ready
    }
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="w-80 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200"
          >
            {/* Header */}
            <div className="bg-[#25D366] text-white p-4 flex justify-between items-center">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
                    <MessageCircle className="h-6 w-6 text-[#25D366]" />
                  </div>
                  {isTyping && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div>
                  <p className="font-semibold">Spurmount Support</p>
                  <p className="text-xs opacity-80">
                    {isTyping ? "Online" : "Offline"}
                    {!isTyping && <span className="ml-1">• {businessHours.weekdays} (Mon-Fri)</span>}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <ChevronDown className="h-5 w-5" />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="text-white/80 hover:text-white transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Chat Body */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {hasSentWelcome && (
                <div className="bg-white p-3 rounded-lg shadow-sm">
                  <p className="text-sm text-gray-700">
                    👋 Hello! Thanks for reaching out to Spurmount. We're here to help with your wholesale needs. How can we assist you today?
                  </p>
                  <p className="text-xs text-gray-400 mt-2 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {isTyping ? "Typically replies within minutes" : "Our team will reply as soon as possible"}
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <p className="text-xs text-gray-500 font-medium">QUICK QUESTIONS</p>
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left p-2 text-sm bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 p-3 bg-white">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 border-gray-300 focus-visible:ring-1 focus-visible:ring-primary"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button 
                  onClick={() => handleSendMessage()}
                  disabled={!message.trim()}
                  className="bg-[#25D366] hover:bg-[#128C7E] text-white"
                >
                  Send
                </Button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Powered by WhatsApp • Secure & private
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
            setUnreadCount(0);
          }}
        >
          <Button 
            className="rounded-full w-14 h-14 bg-[#25D366] hover:bg-[#128C7E] text-white shadow-lg relative"
            size="icon"
          >
            <MessageCircle className="h-7 w-7" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </Button>
        </motion.div>
      )}

      {/* Minimized State */}
      {isMinimized && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-full shadow-lg overflow-hidden border border-gray-200 flex items-center"
        >
          <button 
            onClick={() => {
              setIsMinimized(false);
              setUnreadCount(0);
            }}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <div className="relative mr-2">
              <MessageCircle className="h-5 w-5 text-[#25D366]" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </div>
            Chat with us
            <ChevronUp className="ml-1 h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default EnhancedWhatsApp;
