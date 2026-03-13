import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { LogOut, Heart, Truck, Trophy, User, ArrowLeftRight, History } from "lucide-react";
import logoIcon from "@/assets/logo-icon.png";
import { toast } from "sonner";
import DonationForm from "@/components/DonationForm";
import RewardsModal from "@/components/RewardsModal";
import VolunteerDonations from "@/components/VolunteerDonations";
import DonationHistory from "@/components/DonationHistory";

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [donationFormOpen, setDonationFormOpen] = useState(false);
  const [rewardsOpen, setRewardsOpen] = useState(false);
  const [donationCount, setDonationCount] = useState(0);
  const [activeView, setActiveView] = useState<"main" | "history">("main");
  const [currentRole, setCurrentRole] = useState<"donor" | "volunteer">("donor");

  const fetchProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/login"); return; }
    const { data } = await supabase.from("profiles").select("*").eq("user_id", user.id).single();
    setProfile(data);
    if (data?.role) setCurrentRole(data.role as "donor" | "volunteer");
    setLoading(false);
  };

  const fetchDonationCount = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const col = currentRole === "donor" ? "donor_id" : "volunteer_id";
    const { count } = await supabase.from("donations").select("*", { count: "exact", head: true }).eq(col, user.id);
    setDonationCount(count || 0);
  };

  useEffect(() => { fetchProfile(); }, [navigate]);
  useEffect(() => { fetchDonationCount(); }, [currentRole]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/");
  };

  const handleRoleSwitch = async () => {
    const newRole = currentRole === "donor" ? "volunteer" : "donor";
    try {
      const { error } = await supabase.from("profiles").update({ role: newRole }).eq("user_id", profile.user_id);
      if (error) throw error;
      setCurrentRole(newRole);
      setProfile({ ...profile, role: newRole });
      setActiveView("main");
      toast.success(`Switched to ${newRole} mode`);
    } catch (err: any) {
      toast.error(err.message || "Failed to switch role");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary font-heading text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <img src={logoIcon} alt="HungerConnect" className="h-8 w-8" />
            <span className="font-heading text-lg font-bold text-primary">HungerConnect</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={handleRoleSwitch}
              className="flex items-center gap-1.5 bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors text-sm font-semibold text-secondary-foreground">
              <ArrowLeftRight size={14} />
              <span className="hidden sm:inline">{currentRole === "donor" ? "Be Volunteer" : "Be Donor"}</span>
            </button>
            <button onClick={() => setRewardsOpen(true)}
              className="flex items-center gap-2 bg-secondary px-3 py-1.5 rounded-full hover:bg-secondary/80 transition-colors cursor-pointer">
              <Trophy size={14} className="text-accent" />
              <span className="text-sm font-semibold text-secondary-foreground">{profile?.reward_points || 0} pts</span>
            </button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        {/* Profile Card */}
        <div className="bg-card rounded-2xl shadow-card p-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full gradient-primary flex items-center justify-center">
              <User size={24} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <h1 className="font-heading text-xl font-bold">Welcome, {profile?.full_name}!</h1>
              <p className="text-muted-foreground text-sm capitalize flex items-center gap-1">
                {currentRole === "donor" ? <Heart size={14} className="text-primary" /> : <Truck size={14} className="text-accent" />}
                {currentRole}
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-card rounded-xl shadow-card p-4 text-center">
            <p className="font-heading text-xl font-bold">{donationCount}</p>
            <p className="text-muted-foreground text-xs">{currentRole === "donor" ? "Donated" : "Delivered"}</p>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4 text-center cursor-pointer hover:shadow-elevated transition-shadow" onClick={() => setRewardsOpen(true)}>
            <p className="font-heading text-xl font-bold">{profile?.reward_points || 0}</p>
            <p className="text-muted-foreground text-xs">Points</p>
          </div>
          <div className="bg-card rounded-xl shadow-card p-4 text-center cursor-pointer hover:shadow-elevated transition-shadow"
            onClick={() => setActiveView(activeView === "history" ? "main" : "history")}>
            <History size={20} className="mx-auto text-primary mb-1" />
            <p className="text-muted-foreground text-xs">{activeView === "history" ? "Back" : "History"}</p>
          </div>
        </div>

        {/* Main Content */}
        {activeView === "history" ? (
          <div className="bg-card rounded-2xl shadow-card p-6">
            <h2 className="font-heading text-lg font-bold mb-4 flex items-center gap-2">
              <History size={18} className="text-primary" /> Donation History
            </h2>
            <DonationHistory role={currentRole} />
          </div>
        ) : currentRole === "donor" ? (
          <div className="bg-card rounded-2xl shadow-card p-8 text-center">
            <Heart size={48} className="mx-auto text-primary mb-4" />
            <h2 className="font-heading text-xl font-bold mb-2">Ready to Donate?</h2>
            <p className="text-muted-foreground mb-6">Share your surplus food with those who need it most.</p>
            <Button variant="hero" size="lg" onClick={() => setDonationFormOpen(true)}>Donate Now</Button>
          </div>
        ) : (
          <VolunteerDonations />
        )}
      </div>

      <DonationForm open={donationFormOpen} onOpenChange={setDonationFormOpen} onSuccess={() => { fetchDonationCount(); fetchProfile(); }} />
      <RewardsModal open={rewardsOpen} onOpenChange={setRewardsOpen} userPoints={profile?.reward_points || 0} onRedeem={fetchProfile} />
    </div>
  );
};

export default Dashboard;
