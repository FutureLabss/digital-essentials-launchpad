import { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const Onboarding = () => {
  const { user, loading, profile, onboardingCompleted, refreshProfile } = useAuth();
  const navigate = useNavigate();

  const [submitting, setSubmitting] = useState(false);

  const [fullLegalName, setFullLegalName] = useState(profile?.full_legal_name ?? profile?.full_name ?? "");
  const [emailAddress, setEmailAddress] = useState(profile?.email ?? user?.email ?? "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone ?? "");
  const [profilePhotoUrl, setProfilePhotoUrl] = useState(profile?.avatar_url ?? "");

  const [dateOfBirth, setDateOfBirth] = useState<string>(profile?.date_of_birth ?? "");
  const [ageRange, setAgeRange] = useState(profile?.age_range ?? "");
  const [gender, setGender] = useState(profile?.gender ?? "");
  const [countryOfResidence, setCountryOfResidence] = useState(profile?.country_of_residence ?? "Nigeria");
  const [stateOfResidence, setStateOfResidence] = useState(profile?.state_of_residence ?? "");

  const [highestEducationLevel, setHighestEducationLevel] = useState(profile?.highest_education_level ?? "");
  const [employmentStatus, setEmploymentStatus] = useState(profile?.employment_status ?? "");

  const [primaryReasonForJoining, setPrimaryReasonForJoining] = useState(profile?.primary_reason_for_joining ?? "");
  const [learningInterestTrack, setLearningInterestTrack] = useState(profile?.learning_interest_track ?? "");
  const [currentSkillLevel, setCurrentSkillLevel] = useState(profile?.current_skill_level ?? "beginner");

  const [referralSource, setReferralSource] = useState(profile?.referral_source ?? "");
  const [careerGoal, setCareerGoal] = useState(profile?.career_goal ?? "");

  const [consentDataUsage, setConsentDataUsage] = useState(Boolean(profile?.consent_data_usage));
  const [consentReceiveCommunications, setConsentReceiveCommunications] = useState(Boolean(profile?.consent_receive_communications));

  const hasDob = Boolean(dateOfBirth);
  const hasAgeRange = Boolean(ageRange);
  const ageProvided = hasDob || hasAgeRange;

  const validationError = useMemo(() => {
    if (!fullLegalName.trim()) return "Full legal name is required";
    if (!emailAddress.trim()) return "Email address is required";
    if (!phoneNumber.trim()) return "Phone number is required";
    if (!countryOfResidence.trim()) return "Country of residence is required";
    if (!stateOfResidence.trim()) return "State of residence is required";
    if (!highestEducationLevel) return "Highest education level is required";
    if (!employmentStatus) return "Employment status is required";
    if (!primaryReasonForJoining) return "Primary reason for joining is required";
    if (!learningInterestTrack) return "Learning interest / track is required";
    if (!currentSkillLevel) return "Current skill level is required";
    if (!referralSource) return "Referral source is required";
    if (!careerGoal.trim()) return "Career goal is required";
    if (!ageProvided) return "Please provide either date of birth or age range";
    if (!consentDataUsage) return "You must consent to data usage & privacy policy";
    return null;
  }, [
    fullLegalName,
    emailAddress,
    phoneNumber,
    countryOfResidence,
    stateOfResidence,
    highestEducationLevel,
    employmentStatus,
    primaryReasonForJoining,
    learningInterestTrack,
    currentSkillLevel,
    referralSource,
    careerGoal,
    ageProvided,
    consentDataUsage,
  ]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  if (onboardingCompleted) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        user_id: user.id,
        full_legal_name: fullLegalName.trim(),
        full_name: (profile?.full_name || fullLegalName).trim(),
        email: emailAddress.trim(),
        phone: phoneNumber.trim(),
        avatar_url: profilePhotoUrl.trim() || null,
        date_of_birth: dateOfBirth || null,
        age_range: ageRange || null,
        gender: gender || null,
        country_of_residence: countryOfResidence.trim(),
        state_of_residence: stateOfResidence.trim(),
        highest_education_level: highestEducationLevel,
        employment_status: employmentStatus,
        primary_reason_for_joining: primaryReasonForJoining,
        learning_interest_track: learningInterestTrack,
        current_skill_level: currentSkillLevel,
        referral_source: referralSource,
        career_goal: careerGoal.trim(),
        consent_data_usage: consentDataUsage,
        consent_receive_communications: consentReceiveCommunications,
        onboarding_completed: true,
      };

      const { error } = await supabase
        .from("profiles")
        .upsert(payload, { onConflict: "user_id" });

      if (error) {
        console.error("Onboarding save error:", error);
        toast.error(error.message || "Failed to save your profile. Please try again.");
        return;
      }

      await refreshProfile();
      toast.success("Profile saved! Welcome onboard.");
      navigate("/dashboard", { replace: true });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-blue-50 flex items-center justify-center px-4 py-10">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-slate-900">Complete your profile</CardTitle>
          <CardDescription>
            This helps us personalize your learning experience and track impact.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            <section className="space-y-4">
              <h3 className="font-semibold text-slate-900">Basic info</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullLegalName">Full legal name</Label>
                  <Input id="fullLegalName" value={fullLegalName} onChange={(e) => setFullLegalName(e.target.value)} maxLength={120} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <Input id="email" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} maxLength={255} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} maxLength={30} placeholder="+234..." />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="photo">Profile photo URL (optional)</Label>
                  <Input id="photo" value={profilePhotoUrl} onChange={(e) => setProfilePhotoUrl(e.target.value)} placeholder="https://..." />
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="font-semibold text-slate-900">Demographics & eligibility</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Date of birth</Label>
                  <Input id="dob" type="date" value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Age range (if you prefer not to share DOB)</Label>
                  <Select value={ageRange} onValueChange={setAgeRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select age range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under_18">Under 18</SelectItem>
                      <SelectItem value="18_24">18–24</SelectItem>
                      <SelectItem value="25_34">25–34</SelectItem>
                      <SelectItem value="35_44">35–44</SelectItem>
                      <SelectItem value="45_plus">45+</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Gender (optional)</Label>
                  <Select value={gender} onValueChange={setGender}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="non_binary">Non-binary</SelectItem>
                      <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">Country of residence</Label>
                  <Input id="country" value={countryOfResidence} onChange={(e) => setCountryOfResidence(e.target.value)} maxLength={80} />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="state">State of residence</Label>
                  <Input id="state" value={stateOfResidence} onChange={(e) => setStateOfResidence(e.target.value)} maxLength={80} />
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="font-semibold text-slate-900">Education & work context</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Highest education level</Label>
                  <Select value={highestEducationLevel} onValueChange={setHighestEducationLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="primary">Primary</SelectItem>
                      <SelectItem value="secondary">Secondary</SelectItem>
                      <SelectItem value="diploma">Diploma</SelectItem>
                      <SelectItem value="bachelors">Bachelor's</SelectItem>
                      <SelectItem value="masters">Master's</SelectItem>
                      <SelectItem value="phd">PhD</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Employment status</Label>
                  <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="unemployed">Unemployed</SelectItem>
                      <SelectItem value="employed">Employed</SelectItem>
                      <SelectItem value="self_employed">Self-employed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="font-semibold text-slate-900">Program intelligence</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Primary reason for joining</Label>
                  <Select value={primaryReasonForJoining} onValueChange={setPrimaryReasonForJoining}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="skills">Skills</SelectItem>
                      <SelectItem value="job">Job</SelectItem>
                      <SelectItem value="freelancing">Freelancing</SelectItem>
                      <SelectItem value="entrepreneurship">Entrepreneurship</SelectItem>
                      <SelectItem value="certification">Certification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Learning interest / track</Label>
                  <Select value={learningInterestTrack} onValueChange={setLearningInterestTrack}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select track" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="data">Data</SelectItem>
                      <SelectItem value="product">Product</SelectItem>
                      <SelectItem value="digital_marketing">Digital marketing</SelectItem>
                      <SelectItem value="ai">AI</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Current skill level</Label>
                  <Select value={currentSkillLevel} onValueChange={setCurrentSkillLevel}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Referral source</Label>
                  <Select value={referralSource} onValueChange={setReferralSource}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="friend">Friend</SelectItem>
                      <SelectItem value="social_media">Social media</SelectItem>
                      <SelectItem value="school">School</SelectItem>
                      <SelectItem value="partner">Partner</SelectItem>
                      <SelectItem value="ads">Ads</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="font-semibold text-slate-900">Growth, accountability & impact</h3>
              <div className="space-y-2">
                <Label htmlFor="careerGoal">Career goal</Label>
                <Textarea id="careerGoal" value={careerGoal} onChange={(e) => setCareerGoal(e.target.value)} placeholder="Tell us what you want to achieve..." />
              </div>
            </section>

            <Separator />

            <section className="space-y-4">
              <h3 className="font-semibold text-slate-900">Compliance & trust</h3>
              <div className="flex items-start gap-2">
                <Checkbox checked={consentDataUsage} onCheckedChange={(v) => setConsentDataUsage(Boolean(v))} />
                <div className="text-sm">
                  <p className="font-medium">Consent to data usage & privacy policy</p>
                  <p className="text-muted-foreground">Required</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Checkbox checked={consentReceiveCommunications} onCheckedChange={(v) => setConsentReceiveCommunications(Boolean(v))} />
                <div className="text-sm">
                  <p className="font-medium">Consent to receive communications (Email / WhatsApp)</p>
                  <p className="text-muted-foreground">Optional</p>
                </div>
              </div>
            </section>

            <div className="flex justify-end">
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={submitting}>
                {submitting ? "Saving..." : "Save and continue"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Onboarding;
