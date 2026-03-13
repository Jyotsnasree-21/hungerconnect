import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Heart, Truck, User, Mail, Phone, Lock, MapPin, CheckCircle, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import logoIcon from "@/assets/logo-icon.png";

type Role = "donor" | "volunteer" | null;

const Register = () => {
  const navigate = useNavigate();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<Role>(null);
  const [formData, setFormData] = useState({
    fullName: "", email: "", phone: "", password: "", confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState("");
  const [serviceArea, setServiceArea] = useState("");
  const [locationConfirmed, setLocationConfirmed] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  // No redirect-based verification — polling in step 3 handles it

  const totalSteps = 4;

  // Poll for email verification in step 3
  useEffect(() => {
    if (step !== 3) return;
    const interval = setInterval(async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.email_confirmed_at) {
        setEmailVerified(true);
        clearInterval(interval);
        // Create profile after verification
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          role: role!,
        });
        if (profileError) console.error("Profile creation error:", profileError);
        toast.success("Email verified! Let's set your location.");
        setTimeout(() => setStep(4), 1000);
      }
    }, 3000);
    return () => clearInterval(interval);
  }, [step, formData, role]);

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!formData.fullName.trim()) errs.fullName = "Full name is required";
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) errs.email = "Valid email required";
    if (!formData.phone.trim() || !/^\+?[0-9]{10,13}$/.test(formData.phone.replace(/\s/g, ""))) errs.phone = "Valid phone number required";
    if (formData.password.length < 6) errs.password = "Min 6 characters";
    if (formData.password !== formData.confirmPassword) errs.confirmPassword = "Passwords don't match";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateStep2()) return;
    setLoading(true);
    try {
      const { data: signUpData, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          emailRedirectTo: window.location.origin,
          data: {
            full_name: formData.fullName,
            phone: formData.phone,
            role: role,
          },
        },
      });
      if (error) throw error;

      // If auto-confirm is enabled, user is already confirmed — create profile and skip to step 4
      if (signUpData.user?.email_confirmed_at) {
        const { error: profileError } = await supabase.from("profiles").insert({
          user_id: signUpData.user.id,
          full_name: formData.fullName,
          phone: formData.phone,
          role: role!,
        });
        if (profileError) console.error("Profile creation error:", profileError);
        toast.success("Account created! Let's set your location.");
        setEmailVerified(true);
        setStep(4);
      } else {
        toast.success("Verification email sent! Check your inbox.");
        setStep(3);
      }
    } catch (err: any) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.resend({ email: formData.email, type: "signup" });
      if (error) throw error;
      toast.success("Verification email resent!");
    } catch (err: any) {
      toast.error(err.message || "Failed to resend");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationConfirm = async () => {
    if (!address.trim()) {
      toast.error("Please enter your address");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error } = await supabase.from("profiles").update({
          address,
          service_area: serviceArea || address,
        }).eq("user_id", user.id);
        if (error) throw error;
      }
      setLocationConfirmed(true);
      toast.success("Location saved! Registration complete.");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to save location");
    } finally {
      setLoading(false);
    }
  };

  const progressWidth = `${(step / totalSteps) * 100}%`;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center py-8 px-4">
      <Link to="/" className="flex items-center gap-2 mb-8">
        <img src={logoIcon} alt="HungerConnect" className="h-10 w-10" />
        <span className="font-heading text-2xl font-bold text-primary">HungerConnect</span>
      </Link>

      <div className="w-full max-w-xl bg-card rounded-2xl shadow-elevated overflow-hidden">
        <div className="h-1.5 bg-muted">
          <div className="h-full gradient-primary transition-all duration-500" style={{ width: progressWidth }} />
        </div>

        <div className="p-8">
          <h2 className="font-heading text-2xl font-bold text-primary mb-1">Join the Movement</h2>
          <p className="text-muted-foreground text-sm mb-8">Step {step} of {totalSteps}: {
            step === 1 ? "Choose your role" :
            step === 2 ? "Account information" :
            step === 3 ? "Verify your email" :
            "Set your location"
          }</p>

          {/* Step 1: Role Selection */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setRole("donor")}
                  className={`group p-6 rounded-xl border-2 text-center transition-all hover:shadow-card ${
                    role === "donor" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${
                    role === "donor" ? "bg-primary/10" : "bg-muted group-hover:bg-primary/5"
                  }`}>
                    <Heart size={28} className="text-primary" />
                  </div>
                  <h3 className="font-heading font-bold">Food Donor</h3>
                  <p className="text-muted-foreground text-xs mt-1">I have surplus food to share</p>
                </button>
                <button
                  onClick={() => setRole("volunteer")}
                  className={`group p-6 rounded-xl border-2 text-center transition-all hover:shadow-card ${
                    role === "volunteer" ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3 transition-colors ${
                    role === "volunteer" ? "bg-primary/10" : "bg-muted group-hover:bg-primary/5"
                  }`}>
                    <Truck size={28} className="text-accent" />
                  </div>
                  <h3 className="font-heading font-bold">Volunteer</h3>
                  <p className="text-muted-foreground text-xs mt-1">I want to help with deliveries</p>
                </button>
              </div>
              <div className="flex justify-end">
                <Button variant="hero" size="lg" onClick={() => role && setStep(2)} disabled={!role}>
                  Continue <ArrowRight size={18} />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Account Info */}
          {step === 2 && (
            <div className="animate-fade-in space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-primary font-semibold text-sm">Full Name</Label>
                  <div className="relative mt-1">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Ravi Kumar" className="pl-10" value={formData.fullName}
                      onChange={e => setFormData({...formData, fullName: e.target.value})} />
                  </div>
                  {errors.fullName && <p className="text-destructive text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div>
                  <Label className="text-primary font-semibold text-sm">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input type="email" placeholder="ravi@example.com" className="pl-10" value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})} />
                  </div>
                  {errors.email && <p className="text-destructive text-xs mt-1">{errors.email}</p>}
                </div>
                <div>
                  <Label className="text-primary font-semibold text-sm">Mobile Number</Label>
                  <div className="relative mt-1">
                    <Phone size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="+91 9876543210" className="pl-10" value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <Label className="text-primary font-semibold text-sm">Password</Label>
                  <div className="relative mt-1">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input type="password" placeholder="Min 6 characters" className="pl-10" value={formData.password}
                      onChange={e => setFormData({...formData, password: e.target.value})} />
                  </div>
                  {errors.password && <p className="text-destructive text-xs mt-1">{errors.password}</p>}
                </div>
              </div>
              <div>
                <Label className="text-primary font-semibold text-sm">Confirm Password</Label>
                <div className="relative mt-1">
                  <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input type="password" placeholder="Re-enter password" className="pl-10" value={formData.confirmPassword}
                    onChange={e => setFormData({...formData, confirmPassword: e.target.value})} />
                </div>
                {errors.confirmPassword && <p className="text-destructive text-xs mt-1">{errors.confirmPassword}</p>}
              </div>
              <div className="flex justify-between pt-4">
                <Button variant="ghost" onClick={() => setStep(1)}>
                  <ArrowLeft size={16} /> Back
                </Button>
                <Button variant="hero" size="lg" onClick={handleSignUp} disabled={loading}>
                  {loading ? "Sending..." : "Verify Account"}
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Email Verification (link-based) */}
          {step === 3 && (
            <div className="animate-fade-in text-center">
              <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-6">
                {emailVerified ? (
                  <CheckCircle size={36} className="text-success" />
                ) : (
                  <MailCheck size={36} className="text-primary" />
                )}
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2">
                {emailVerified ? "Email Verified!" : "Check Your Inbox"}
              </h3>
              <p className="text-muted-foreground text-sm mb-2">
                {emailVerified
                  ? "Your email has been verified. Redirecting to location setup..."
                  : <>We've sent a verification link to <span className="font-semibold text-foreground">{formData.email}</span></>
                }
              </p>
              {!emailVerified && (
                <>
                  <p className="text-muted-foreground text-xs mb-6">
                    Click the link in the email to verify your account. This page will update automatically.
                  </p>
                  <div className="flex items-center justify-center gap-2 mb-6">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm text-muted-foreground">Waiting for verification...</span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Didn't receive it?{" "}
                    <button onClick={handleResendEmail} disabled={loading} className="text-primary font-semibold hover:underline">
                      Resend email
                    </button>
                  </p>
                </>
              )}
            </div>
          )}

          {/* Step 4: Set Location */}
          {step === 4 && (
            <div className="animate-fade-in">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <MapPin size={32} className="text-primary" />
                </div>
                <h3 className="font-heading text-lg font-semibold mb-2">Set Your Location</h3>
                <p className="text-muted-foreground text-sm">
                  {role === "volunteer"
                    ? "Set your service area to receive nearby donation alerts"
                    : "Set your location for easy pickup scheduling"}
                </p>
              </div>

              <div className="space-y-4 mb-4">
                <div>
                  <Label className="text-primary font-semibold text-sm">Address</Label>
                  <div className="relative mt-1">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="Enter your full address..." className="pl-10" value={address}
                      onChange={e => setAddress(e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label className="text-primary font-semibold text-sm">Service Area / City</Label>
                  <div className="relative mt-1">
                    <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input placeholder="e.g. Visakhapatnam, Hyderabad, Mumbai..." className="pl-10" value={serviceArea}
                      onChange={e => setServiceArea(e.target.value)} />
                  </div>
                </div>
              </div>

              <div className="w-full h-48 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center mb-4">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground text-sm">Google Maps integration coming soon</p>
                  <p className="text-muted-foreground text-xs">Enter your address above for now</p>
                </div>
              </div>

              {locationConfirmed && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success text-sm mb-4">
                  <CheckCircle size={16} />
                  Registration complete! Redirecting...
                </div>
              )}

              <div className="flex justify-end">
                <Button variant="hero" size="lg" onClick={handleLocationConfirm} disabled={loading || locationConfirmed}>
                  {loading ? "Saving..." : locationConfirmed ? "Done!" : "Complete Registration"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      <p className="text-muted-foreground text-sm mt-6">
        Already have an account? <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
      </p>
    </div>
  );
};

export default Register;
