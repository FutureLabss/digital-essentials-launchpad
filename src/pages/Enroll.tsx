import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CreditCard, ArrowLeft, CheckCircle } from "lucide-react";
import { toast } from "sonner";

declare global {
  interface Window {
    PaystackPop: any;
  }
}

const Enroll = () => {
  const { courseId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);
  const [alreadyEnrolled, setAlreadyEnrolled] = useState(false);

  useEffect(() => {
    // Load Paystack inline script
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { document.body.removeChild(script); };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [courseRes, enrollRes] = await Promise.all([
        supabase.from("courses").select("*").eq("id", courseId!).single(),
        supabase.from("enrollments").select("payment_status").eq("course_id", courseId!).eq("user_id", user!.id).maybeSingle(),
      ]);
      if (courseRes.data) setCourse(courseRes.data);
      if (enrollRes.data?.payment_status === "completed") setAlreadyEnrolled(true);
      setLoading(false);
    };
    fetchData();
  }, [courseId, user]);

  const completeEnrollment = async (reference: string) => {
    const { data: existing } = await supabase
      .from("enrollments")
      .select("id, payment_status")
      .eq("course_id", courseId!)
      .eq("user_id", user!.id)
      .maybeSingle();

    if (existing?.payment_status === "completed") {
      toast.success("Already enrolled!");
      navigate(`/course/${courseId}`);
      return;
    }

    const payload = {
      payment_status: "completed",
      payment_provider: "paystack",
      payment_reference: reference,
      amount_paid: course.price,
    };

    const { error } = existing
      ? await supabase.from("enrollments").update(payload).eq("id", existing.id)
      : await supabase.from("enrollments").insert({ ...payload, user_id: user!.id, course_id: courseId! });

    if (error) {
      toast.error("Failed to activate enrollment. Contact support.");
      console.error(error);
    } else {
      toast.success("Payment confirmed! Course unlocked.");
      navigate(`/course/${courseId}`);
    }
  };

  const handlePaystack = () => {
    if (!window.PaystackPop) {
      toast.error("Payment system is loading, please try again.");
      return;
    }

    setPaying(true);

    const handler = window.PaystackPop.setup({
      key: "pk_test_f3a5c2ef20261562a07f128e4de9335605443769",
      email: user!.email,
      amount: course.price * 100, // Paystack expects kobo
      currency: course.currency || "NGN",
      metadata: { course_id: courseId, user_id: user!.id },
      onClose: () => {
        setPaying(false);
        toast.info("Payment cancelled.");
      },
      callback: (response: { reference: string }) => {
        setPaying(false);
        completeEnrollment(response.reference);
      },
    });

    handler.openIframe();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Course not found.</p>
      </div>
    );
  }

  if (alreadyEnrolled) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="py-12">
            <CheckCircle className="h-16 w-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">You're already enrolled!</h2>
            <p className="text-muted-foreground mb-6">You have full access to this course.</p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => navigate(`/course/${courseId}`)}>
              Go to Course
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Dashboard
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12 max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">{course.title}</CardTitle>
            <CardDescription>{course.short_description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <span className="text-4xl font-bold text-slate-900">
                {course.currency} {course.price}
              </span>
              <p className="text-sm text-muted-foreground mt-1">One-time payment for full access</p>
            </div>

            <div className="space-y-3">
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 h-12 text-base"
                onClick={handlePaystack}
                disabled={paying}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                {paying ? "Processing..." : "Pay with Paystack"}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground">
              After payment, your course will be unlocked automatically.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Enroll;
