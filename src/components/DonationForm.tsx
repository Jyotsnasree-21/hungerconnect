import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Heart, Clock, Package, UtensilsCrossed, MapPin } from "lucide-react";
import { toast } from "sonner";
import LocationPicker from "./LocationPicker";

interface DonationFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DonationForm = ({ open, onOpenChange, onSuccess }: DonationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    food_items: "",
    food_type: "",
    quantity: "",
    pickup_time: "",
    special_instructions: "",
  });
  const [location, setLocation] = useState<{ lat: number; lng: number; address: string } | null>(null);

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setLocation({ lat, lng, address });
  };

  const handleSubmit = async () => {
    if (!form.food_items || !form.food_type || !form.quantity || !location || !form.pickup_time) {
      toast.error("Please fill all required fields and select a location on the map");
      return;
    }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { error } = await supabase.from("donations").insert({
        donor_id: user.id,
        food_items: form.food_items,
        food_type: form.food_type,
        quantity: parseInt(form.quantity),
        pickup_location: location.address,
        pickup_latitude: location.lat,
        pickup_longitude: location.lng,
        pickup_time: new Date(form.pickup_time).toISOString(),
        special_instructions: form.special_instructions || null,
      });

      if (error) throw error;
      toast.success("Donation created successfully! 🎉");
      setForm({ food_items: "", food_type: "", quantity: "", pickup_time: "", special_instructions: "" });
      setLocation(null);
      onOpenChange(false);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to create donation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl flex items-center gap-2">
            <Heart size={20} className="text-primary" /> Create Donation
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div>
            <Label className="text-sm font-semibold">Food Items *</Label>
            <div className="relative mt-1">
              <UtensilsCrossed size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="e.g. Rice, Dal, Chapati, Sabzi" className="pl-10" value={form.food_items}
                onChange={e => setForm({ ...form, food_items: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold">Food Type *</Label>
              <Select value={form.food_type} onValueChange={v => setForm({ ...form, food_type: v })}>
                <SelectTrigger className="mt-1"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cooked">Cooked Food</SelectItem>
                  <SelectItem value="raw">Raw Ingredients</SelectItem>
                  <SelectItem value="packaged">Packaged Food</SelectItem>
                  <SelectItem value="fruits">Fruits & Vegetables</SelectItem>
                  <SelectItem value="bakery">Bakery Items</SelectItem>
                  <SelectItem value="beverages">Beverages</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold">Servings *</Label>
              <div className="relative mt-1">
                <Package size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input type="number" placeholder="e.g. 20" className="pl-10" value={form.quantity}
                  onChange={e => setForm({ ...form, quantity: e.target.value })} />
              </div>
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Pickup Location * <span className="text-muted-foreground font-normal">(click on map)</span></Label>
            <LocationPicker onLocationSelect={handleLocationSelect} className="mt-1" />
            {location && (
              <div className="flex items-start gap-2 mt-2 p-2 rounded-lg bg-secondary text-sm">
                <MapPin size={14} className="text-primary mt-0.5 shrink-0" />
                <span className="text-secondary-foreground text-xs">{location.address}</span>
              </div>
            )}
          </div>

          <div>
            <Label className="text-sm font-semibold">Pickup Time *</Label>
            <div className="relative mt-1">
              <Clock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input type="datetime-local" className="pl-10" value={form.pickup_time}
                onChange={e => setForm({ ...form, pickup_time: e.target.value })} />
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold">Special Instructions</Label>
            <Textarea placeholder="Any dietary info, packaging details, etc." className="mt-1" value={form.special_instructions}
              onChange={e => setForm({ ...form, special_instructions: e.target.value })} />
          </div>

          <Button variant="hero" size="lg" className="w-full" onClick={handleSubmit} disabled={loading}>
            {loading ? "Creating..." : "Submit Donation"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DonationForm;
