import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { MapPin, Clock, UtensilsCrossed, Package, Truck, Camera, CheckCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

interface Donation {
  id: string;
  food_items: string;
  food_type: string;
  quantity: number;
  pickup_location: string;
  pickup_time: string;
  special_instructions: string | null;
  status: string;
  donor_id: string;
  volunteer_id: string | null;
  delivery_proof_url: string | null;
  created_at: string;
}

const foodTypeLabels: Record<string, string> = {
  cooked: "🍲 Cooked", raw: "🥬 Raw", packaged: "📦 Packaged",
  fruits: "🍎 Fruits & Veg", bakery: "🍞 Bakery", beverages: "🥤 Beverages",
};

const statusColors: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  accepted: "bg-blue-100 text-blue-800",
  picked_up: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
};

const VolunteerDonations = () => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [myDonations, setMyDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [uploadingProof, setUploadingProof] = useState<string | null>(null);

  const fetchDonations = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Fetch pending donations (available)
    const { data: pending } = await supabase.from("donations").select("*")
      .eq("status", "pending").order("created_at", { ascending: false });

    // Fetch my accepted donations
    const { data: mine } = await supabase.from("donations").select("*")
      .eq("volunteer_id", user.id).neq("status", "pending").order("created_at", { ascending: false });

    setDonations((pending as Donation[]) || []);
    setMyDonations((mine as Donation[]) || []);
    setLoading(false);
  };

  useEffect(() => { fetchDonations(); }, []);

  const handleAccept = async (donationId: string) => {
    setActionLoading(donationId);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("donations").update({
        volunteer_id: user.id,
        status: "accepted",
      }).eq("id", donationId).eq("status", "pending");

      if (error) throw error;
      toast.success("Donation accepted! 🚀");
      fetchDonations();
    } catch (err: any) {
      toast.error(err.message || "Failed to accept");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusUpdate = async (donationId: string, newStatus: string) => {
    setActionLoading(donationId);
    try {
      const { error } = await supabase.from("donations").update({ status: newStatus }).eq("id", donationId);
      if (error) throw error;
      toast.success(`Status updated to ${newStatus.replace("_", " ")}!`);
      fetchDonations();
    } catch (err: any) {
      toast.error(err.message || "Failed to update");
    } finally {
      setActionLoading(null);
    }
  };

  const handleProofUpload = async (donationId: string, file: File) => {
    setUploadingProof(donationId);
    try {
      const ext = file.name.split(".").pop();
      const path = `${donationId}-${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage.from("delivery-proofs").upload(path, file);
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from("delivery-proofs").getPublicUrl(path);

      const { error } = await supabase.from("donations").update({
        delivery_proof_url: publicUrl,
        status: "delivered",
      }).eq("id", donationId);
      if (error) throw error;

      toast.success("Delivery proof uploaded! 📸");
      fetchDonations();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploadingProof(null);
    }
  };

  if (loading) return <div className="text-center py-8 text-muted-foreground">Loading donations...</div>;

  return (
    <div className="space-y-6">
      {/* My Active Deliveries */}
      {myDonations.length > 0 && (
        <div>
          <h3 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
            <Truck size={18} className="text-primary" /> My Deliveries
          </h3>
          <div className="space-y-3">
            {myDonations.map(d => (
              <div key={d.id} className="bg-card rounded-xl border p-4 shadow-card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-heading font-bold text-sm">{d.food_items}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{foodTypeLabels[d.food_type] || d.food_type}</span>
                      <span className="text-xs text-muted-foreground">• {d.quantity} servings</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[d.status] || "bg-muted"}`}>
                    {d.status.replace("_", " ")}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                  <MapPin size={12} /> {d.pickup_location}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Clock size={12} /> {format(new Date(d.pickup_time), "PPp")}
                </div>

                {d.delivery_proof_url && (
                  <div className="mb-3">
                    <img src={d.delivery_proof_url} alt="Delivery proof" className="w-full h-32 object-cover rounded-lg" />
                  </div>
                )}

                <div className="flex gap-2">
                  {d.status === "accepted" && (
                    <Button size="sm" variant="hero" onClick={() => handleStatusUpdate(d.id, "picked_up")}
                      disabled={actionLoading === d.id}>
                      {actionLoading === d.id ? "..." : "Mark Picked Up"}
                    </Button>
                  )}
                  {d.status === "picked_up" && (
                    <label className="cursor-pointer">
                      <Button size="sm" variant="hero" asChild disabled={uploadingProof === d.id}>
                        <span>
                          <Camera size={14} className="mr-1" />
                          {uploadingProof === d.id ? "Uploading..." : "Upload Proof & Deliver"}
                        </span>
                      </Button>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={e => e.target.files?.[0] && handleProofUpload(d.id, e.target.files[0])} />
                    </label>
                  )}
                  {d.status === "delivered" && (
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <CheckCircle size={14} /> Delivered
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Available Donations */}
      <div>
        <h3 className="font-heading font-bold text-lg mb-3 flex items-center gap-2">
          <UtensilsCrossed size={18} className="text-accent" /> Available Donations
        </h3>
        {donations.length === 0 ? (
          <div className="bg-card rounded-xl border p-8 text-center">
            <Truck size={40} className="mx-auto text-muted-foreground mb-3" />
            <p className="text-muted-foreground">No donations available right now. Check back soon!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {donations.map(d => (
              <div key={d.id} className="bg-card rounded-xl border p-4 shadow-card hover:shadow-elevated transition-shadow">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="font-heading font-bold text-sm">{d.food_items}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-muted-foreground">{foodTypeLabels[d.food_type] || d.food_type}</span>
                      <span className="text-xs text-muted-foreground">• {d.quantity} servings</span>
                    </div>
                  </div>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors.pending}`}>
                    Available
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
                  <MapPin size={12} /> {d.pickup_location}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3">
                  <Clock size={12} /> Pickup: {format(new Date(d.pickup_time), "PPp")}
                </div>
                {d.special_instructions && (
                  <p className="text-xs text-muted-foreground mb-3 italic">"{d.special_instructions}"</p>
                )}
                <Button size="sm" variant="hero" onClick={() => handleAccept(d.id)}
                  disabled={actionLoading === d.id}>
                  {actionLoading === d.id ? "Accepting..." : "Accept Donation"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VolunteerDonations;
