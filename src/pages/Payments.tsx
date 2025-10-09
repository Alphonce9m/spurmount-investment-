import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, CheckCircle, Smartphone } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const Payments = () => {
  const { toast } = useToast();
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const paybillNumber = "400200"; // M-PESA Paybill number
  const accountNumber = "852404"; // Account number for payment reference

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    toast({
      title: "Copied!",
      description: `${field} copied to clipboard`,
    });
    setTimeout(() => setCopiedField(null), 2000);
  };

  const steps = [
    {
      number: "1",
      title: "Go to M-PESA",
      description: "Open M-PESA on your phone and select Lipa na M-PESA",
    },
    {
      number: "2",
      title: "Select Paybill",
      description: "Choose the Paybill option from the menu",
    },
    {
      number: "3",
      title: "Enter Details",
      description: `Business Number: ${paybillNumber}, Account: ${accountNumber}`,
    },
    {
      number: "4",
      title: "Enter Amount",
      description: "Enter the exact amount as quoted in your order",
    },
    {
      number: "5",
      title: "Complete Payment",
      description: "Enter your M-PESA PIN to complete the transaction"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">Payment Information</h1>
          <p className="text-lg text-gray-600">
            Complete your order payment securely through M-PESA
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {/* Payment Steps */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">How to Pay</h2>
            <div className="space-y-4">
              {steps.map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="font-medium text-blue-600">{step.number}</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Payment Details</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600">Paybill Number:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded">{paybillNumber}</span>
                  <button
                    onClick={() => copyToClipboard(paybillNumber, "Paybill number")}
                    className="p-1 rounded-full hover:bg-gray-100"
                    title="Copy to clipboard"
                  >
                    {copiedField === "Paybill number" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600">Account Number:</span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono bg-gray-100 px-3 py-1 rounded">{accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(accountNumber, "Account number")}
                    className="p-1 rounded-full hover:bg-gray-100"
                    title="Copy to clipboard"
                  >
                    {copiedField === "Account number" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5 text-gray-500" />
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100">
                <p className="text-sm text-gray-500 flex items-center">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Track your order status through WhatsApp
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
