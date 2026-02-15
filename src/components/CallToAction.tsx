
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const CallToAction = () => {
  const navigate = useNavigate();
  const handlePayment = () => {
    // This would typically redirect to Paystack payment page
    // For demo purposes, we'll open a new window to Paystack's site
    // In a real implementation, you would use Paystack's JavaScript API or redirect to a specific checkout URL
    window.open("https://paystack.com/pay/digitalessentials", "_blank");
    
    // Show toast notification
    toast.success("Redirecting to secure payment page", {
      description: "You'll be redirected to complete your payment"
    });
  };

  return (
    <section className="py-20 px-4 md:px-8 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto max-w-5xl">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-3xl overflow-hidden shadow-xl">
          <div className="px-6 py-12 md:p-12 lg:p-16 text-white">
            <div className="flex items-center space-x-2 mb-8 bg-white/20 rounded-full px-4 py-2 w-fit backdrop-blur-sm">
              <Clock className="w-5 h-5" />
              <span className="font-medium">Limited time offer</span>
            </div>
            
            <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
              ⏳ Time is Running Out! Secure Your Spot Today
            </h2>
            
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-3xl">
              Don't let the AI revolution leave you behind! Join thousands of learners who are transforming their lives with AI Essentials.
            </p>
            
            <div className="mb-10">
              <div className="text-2xl font-bold mb-2">🎉 Limited Slots Available</div>
              <div className="w-full bg-white/30 rounded-full h-3">
                <div className="bg-white h-3 rounded-full w-[25%]"></div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                className="bg-white hover:bg-blue-50 text-blue-700 hover:text-blue-800 text-lg px-8 py-6 h-auto shadow-lg hover:shadow-xl transition-all" 
                size="lg"
                onClick={handlePayment}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Pay with Paystack
              </Button>
              
              <Button 
                className="bg-transparent hover:bg-white/10 text-white border border-white text-lg px-8 py-6 h-auto" 
                size="lg"
              >
                Learn More <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;
