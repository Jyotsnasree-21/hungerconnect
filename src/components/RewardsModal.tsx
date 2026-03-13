import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Gift, ShoppingBag, Check } from "lucide-react";
import { toast } from "sonner";

interface Coupon {
  id: string;
  title: string;
  description: string | null;
  points_required: number;
  partner_name: string | null;
  is_active: boolean;
}

interface RewardsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userPoints: number;
  onRedeem: () => void;
}

const partnerColors: Record<string, string> = {
  "Amazon India": "bg-amber-100 text-amber-800",
  "Flipkart": "bg-blue-100 text-blue-800",
  "Swiggy": "bg-orange-100 text-orange-800",
  "Myntra": "bg-pink-100 text-pink-800",
  "BigBasket": "bg-green-100 text-green-800",
  "Zomato": "bg-red-100 text-red-800",
  "Meesho": "bg-purple-100 text-purple-800",
  "PhonePe": "bg-indigo-100 text-indigo-800",
};

const RewardsModal = ({ open, onOpenChange, userPoints, onRedeem }: RewardsModalProps) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const fetchCoupons = async () => {
      setLoading(true);
      const { data } = await supabase.from("coupons").select("*").eq("is_active", true).order("points_required", { ascending: true });
      setCoupons((data as Coupon[]) || []);
      setLoading(false);
    };
    fetchCoupons();
  }, [open]);

  const handleRedeem = async (coupon: Coupon) => {
    if (userPoints < coupon.points_required) {
      toast.error("Not enough points to redeem this coupon");
      return;
    }
    setRedeeming(coupon.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Insert redemption
      const { error: redemptionError } = await supabase.from("redemptions").insert({
        user_id: user.id,
        coupon_id: coupon.id,
        points_spent: coupon.points_required,
      });
      if (redemptionError) throw redemptionError;

      // Deduct points
      const { error: profileError } = await supabase.from("profiles").update({
        reward_points: userPoints - coupon.points_required,
      }).eq("user_id", user.id);
      if (profileError) throw profileError;

      toast.success(`🎉 Redeemed: ${coupon.title}! Check your email for the coupon code.`);
      onRedeem();
    } catch (err: any) {
      toast.error(err.message || "Redemption failed");
    } finally {
      setRedeeming(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Trophy size={20} className="text-accent" /> Rewards Store
          </DialogTitle>
        </DialogHeader>

        <div className="flex items-center gap-3 p-4 rounded-xl bg-secondary mb-4">
          <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center">
            <Gift size={22} className="text-primary-foreground" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Your Balance</p>
            <p className="font-heading text-2xl font-bold text-primary">{userPoints} pts</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8 text-muted-foreground">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No coupons available right now</div>
        ) : (
          <div className="space-y-3">
            {coupons.map(coupon => {
              const canRedeem = userPoints >= coupon.points_required;
              const colorClass = partnerColors[coupon.partner_name || ""] || "bg-muted text-muted-foreground";
              return (
                <div key={coupon.id} className={`p-4 rounded-xl border-2 transition-all ${canRedeem ? "border-border hover:border-primary/50 hover:shadow-card" : "border-border opacity-60"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}>
                          {coupon.partner_name}
                        </span>
                      </div>
                      <h4 className="font-heading font-bold text-sm">{coupon.title}</h4>
                      <p className="text-muted-foreground text-xs mt-0.5">{coupon.description}</p>
                    </div>
                    <div className="text-right flex flex-col items-end gap-2">
                      <span className="font-heading font-bold text-sm text-accent">{coupon.points_required} pts</span>
                      <Button
                        size="sm"
                        variant={canRedeem ? "hero" : "secondary"}
                        disabled={!canRedeem || redeeming === coupon.id}
                        onClick={() => handleRedeem(coupon)}
                        className="text-xs"
                      >
                        {redeeming === coupon.id ? "..." : canRedeem ? "Redeem" : "Locked"}
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RewardsModal;
