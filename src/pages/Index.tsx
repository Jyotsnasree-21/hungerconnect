import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroCarousel from "@/components/HeroCarousel";
import { ArrowRight, Heart, MapPin, Trophy, Truck, Users, Utensils, CheckCircle, TrendingUp, Shield } from "lucide-react";

const stats = [
  { value: "68M+", label: "Tonnes of food wasted yearly in India" },
  { value: "190M", label: "Indians go hungry every day" },
  { value: "40%", label: "Of food produced is wasted" },
  { value: "₹92,000 Cr", label: "Worth of food wasted annually" },
];

const howItWorks = [
  { icon: Utensils, title: "Donor Lists Food", desc: "Restaurants, caterers & households list surplus food with pickup details." },
  { icon: MapPin, title: "AI Matches Area", desc: "Our system matches donations with nearby volunteers using GPS-based routing." },
  { icon: Truck, title: "Volunteer Picks Up", desc: "A local volunteer accepts, collects, and delivers food to those in need." },
  { icon: Heart, title: "Lives Impacted", desc: "Food reaches families, shelters & communities — zero waste, maximum impact." },
];

const features = [
  { icon: Shield, title: "Verified Users", desc: "OTP-based verification ensures only genuine donors and volunteers join." },
  { icon: TrendingUp, title: "Real-time Tracking", desc: "Track every donation from listing to delivery with live status updates." },
  { icon: Trophy, title: "Reward Points", desc: "Earn points for every donation and delivery. Redeem for partner offers." },
  { icon: Users, title: "Community Network", desc: "Join thousands of donors and volunteers building a hunger-free India." },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24">
        <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6">
              <CheckCircle size={14} />
              Working together to end food waste in India
            </div>
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
              Don't Waste Food,<br />
              <span className="text-gradient">Feed a Soul.</span>
            </h1>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-lg">
              HungerConnect uses AI and smart logistics to bridge the gap between surplus food and those in need. Join our local community of heroes across India.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/register">
                <Button variant="hero" size="lg">
                  Become a Donor <ArrowRight size={18} />
                </Button>
              </Link>
              <Link to="/register">
                <Button variant="heroOutline" size="lg">Volunteer</Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-8 h-8 rounded-full gradient-primary border-2 border-card" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">5,420+ Meals</span> shared this month</p>
            </div>
          </div>
          <div className="animate-fade-in">
            <HeroCarousel />
          </div>
        </div>
      </section>

      {/* India Food Waste Stats */}
      <section className="py-16 gradient-primary">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div key={i} className="text-center animate-count-up" style={{ animationDelay: `${i * 0.15}s` }}>
                <p className="font-heading text-3xl md:text-4xl font-extrabold text-primary-foreground mb-1">{stat.value}</p>
                <p className="text-primary-foreground/80 text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider mb-3">How it Works</span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold">From Surplus to Smiles in 4 Steps</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((step, i) => (
              <div key={i} className="relative bg-card rounded-2xl p-6 shadow-card hover:shadow-elevated transition-shadow group">
                <div className="w-14 h-14 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <step.icon size={24} className="text-primary-foreground" />
                </div>
                <span className="absolute top-4 right-4 text-4xl font-heading font-extrabold text-muted/60">{i + 1}</span>
                <h3 className="font-heading text-lg font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="about" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider mb-3">Why HungerConnect?</span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">Redefining Logistics<br />for Social Good</h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                HungerConnect isn't just a database; it's a living ecosystem. We use GPS tracking and AI-powered categorization to ensure surplus food reaches the right hands in record time across cities in India.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <MapPin size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Precise GPS Matching</h4>
                    <p className="text-muted-foreground text-sm">Volunteers are alerted to donations within their preferred service area.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <TrendingUp size={16} className="text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">Impact Visualization</h4>
                    <p className="text-muted-foreground text-sm">Track your cumulative impact and total meals shared in real-time.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {features.map((f, i) => (
                <div key={i} className={`rounded-2xl p-6 ${i === 0 ? 'gradient-primary text-primary-foreground' : i === 1 ? 'bg-accent text-accent-foreground' : 'bg-secondary'} shadow-card hover:shadow-elevated transition-all`}>
                  <f.icon size={28} className={i > 1 ? 'text-primary mb-3' : 'mb-3'} />
                  <h4 className={`font-heading font-semibold mb-1 ${i > 1 ? '' : ''}`}>{f.title}</h4>
                  <p className={`text-xs ${i === 0 ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Impact */}
      <section id="impact" className="py-20">
        <div className="container mx-auto px-4 text-center">
          <span className="inline-block px-4 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-semibold uppercase tracking-wider mb-3">Our Impact</span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">India Wastes Enough Food to Feed<br />Its Entire Hungry Population</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-10">
            According to the United Nations, India wastes approximately 68.76 million tonnes of food every year — enough to feed all 190 million undernourished people in the country. HungerConnect aims to change this, one meal at a time.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <p className="font-heading text-4xl font-extrabold text-primary mb-2">12,500+</p>
              <p className="text-muted-foreground text-sm">Meals Shared</p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <p className="font-heading text-4xl font-extrabold text-primary mb-2">850+</p>
              <p className="text-muted-foreground text-sm">Active Volunteers</p>
            </div>
            <div className="bg-card rounded-2xl p-8 shadow-card">
              <p className="font-heading text-4xl font-extrabold text-primary mb-2">35+</p>
              <p className="text-muted-foreground text-sm">Cities in India</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-primary-foreground mb-4">Ready to change a life today?</h2>
          <p className="text-primary-foreground/80 max-w-lg mx-auto mb-8">
            Whether you have surplus food or a few spare hours, your contribution is the missing link in our community.
          </p>
          <Link to="/register">
            <Button variant="outline" size="xl" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              Get Started Now
            </Button>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
