import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Clock, MapPin, CheckCircle, Image } from "lucide-react";
import { format } from "date-fns";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface Donation {
  id: string;
  food_items: string;
  food_type: string;
  quantity: number;
  pickup_location: string;
  pickup_time: string;
  status: string;
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

interface DonationHistoryProps {
  role: "donor" | "volunteer";
}

const DonationHistory = ({ role }: DonationHistoryProps) => {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [proofImage, setProofImage] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const col = role === "donor" ? "donor_id" : "volunteer_id";
      const { data } = await supabase.from("donations").select("*")
        .eq(col, user.id).order("created_at", { ascending: false });

      setDonations((data as Donation[]) || []);
      setLoading(false);
    };
    fetch();
  }, [role]);

  if (loading) return <div className="text-center py-6 text-muted-foreground text-sm">Loading history...</div>;
  if (donations.length === 0) return <div className="text-center py-6 text-muted-foreground text-sm">No donation history yet</div>;

  return (
    <>
      <div className="space-y-3">
        {donations.map(d => (
          <div key={d.id} className="bg-card rounded-xl border p-4">
            <div className="flex items-start justify-between mb-1">
              <span className="font-heading font-bold text-sm">{d.food_items}</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColors[d.status] || "bg-muted"}`}>
                {d.status.replace("_", " ")}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span>{foodTypeLabels[d.food_type] || d.food_type}</span>
              <span>• {d.quantity} servings</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
              <MapPin size={11} /> {d.pickup_location}
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock size={11} /> {format(new Date(d.created_at), "PP")}
            </div>
            {d.delivery_proof_url && (
              <button onClick={() => setProofImage(d.delivery_proof_url)}
                className="flex items-center gap-1 text-xs text-primary mt-2 hover:underline">
                <Image size={12} /> View delivery proof
              </button>
            )}
          </div>
        ))}
      </div>

      <Dialog open={!!proofImage} onOpenChange={() => setProofImage(null)}>
        <DialogContent className="max-w-md">
          {proofImage && <img src={proofImage} alt="Delivery proof" className="w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DonationHistory;
