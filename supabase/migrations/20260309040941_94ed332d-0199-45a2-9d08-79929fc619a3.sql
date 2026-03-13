-- Create function to award rewards when donation is delivered
CREATE OR REPLACE FUNCTION public.award_delivery_rewards()
RETURNS TRIGGER AS $$
BEGIN
  -- Check if status changed to 'delivered' and it wasn't 'delivered' before
  IF NEW.status = 'delivered' AND (OLD.status IS NULL OR OLD.status != 'delivered') THEN
    -- Award 10 points to donor
    UPDATE public.profiles 
    SET reward_points = reward_points + 10 
    WHERE user_id = NEW.donor_id;
    
    -- Award 10 points to volunteer (if assigned)
    IF NEW.volunteer_id IS NOT NULL THEN
      UPDATE public.profiles 
      SET reward_points = reward_points + 10 
      WHERE user_id = NEW.volunteer_id;
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically award rewards
CREATE TRIGGER trigger_award_delivery_rewards
  AFTER UPDATE ON public.donations
  FOR EACH ROW
  EXECUTE FUNCTION public.award_delivery_rewards();