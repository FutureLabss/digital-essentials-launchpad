import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);
  const [success, setSuccess] = useState(false);

  const courseId = searchParams.get("course_id");
  const reference = searchParams.get("trxref") || searchParams.get("reference");

  useEffect(() => {
    const createEnrollment = async () => {
      if (!user || !courseId) {
        setProcessing(false);
        return;
      }

      // Check if already enrolled
      const { data: existing } = await supabase
        .from("enrollments")
        .select("id, payment_status")
        .eq("course_id", courseId)
        .eq("user_id", user.id)
        .maybeSingle();

      if (existing?.payment_status === "completed") {
        setSuccess(true);
        setProcessing(false);
        return;
      }

      // Upsert enrollment as completed
      const { error } = existing
        ? await supabase
            .from("enrollments")
            .update({
              payment_status: "completed",
              payment_provider: "paystack",
              payment_reference: reference || "manual",
            })
            .eq("id", existing.id)
        : await supabase.from("enrollments").insert({
            user_id: user.id,
            course_id: courseId,
            payment_status: "completed",
            payment_provider: "paystack",
            payment_reference: reference || "manual",
          });

      if (error) {
        toast.error("Failed to activate enrollment. Please contact support.");
        console.error(error);
      } else {
        setSuccess(true);
        toast.success("Payment confirmed! Course unlocked.");
      }
      setProcessing(false);
    };

    createEnrollment();
  }, [user, courseId, reference]);

  if (processing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-muted-foreground">Confirming your payment...</p>
        </div>
      </div>
    );
  }

  if (!courseId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Invalid payment link.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <Card className="max-w-md w-full text-center">
        <CardContent className="py-12">
          {success ? (
            <>
              <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-muted-foreground mb-6">Your course has been unlocked. Start learning now!</p>
              <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate(`/course/${courseId}`)}>
                Go to Course
              </Button>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
              <p className="text-muted-foreground mb-6">We couldn't confirm your payment. Please contact support.</p>
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccess;
