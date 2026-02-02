import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Crown, Check, ArrowLeft, Calendar } from "lucide-react";

const services = [
  "Dental crowns (Gold, Silver)",
  "Bridges",
  "Complete dentures",
  "Partial dentures",
  "Denture repairs",
];

const Restorative = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <Link
            to="/services"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-secondary mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Services
          </Link>
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="h-16 w-16 rounded-2xl bg-amber-500/10 flex items-center justify-center">
                <Crown className="h-8 w-8 text-amber-600" />
              </div>
              <h1 className="text-4xl font-bold text-primary sm:text-5xl">
                Restorative & Prosthodontics
              </h1>
              <p className="text-lg text-muted-foreground">
                Designed to restore damaged or missing teeth. Our restorative treatments help 
                you regain full function and a natural-looking smile.
              </p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl bg-muted h-[300px] flex items-center justify-center">
              <Crown className="h-24 w-24 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary mb-8">Restorative Treatments</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {services.map((service) => (
              <Card key={service} className="border-0 bg-muted">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Check className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="font-medium">{service}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Info */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-primary mb-6">Restore Your Smile</h2>
            <p className="text-muted-foreground mb-4">
              Missing or damaged teeth can affect your ability to eat, speak, and smile confidently. 
              Our restorative treatments are designed to replace or repair teeth, restoring both 
              function and appearance.
            </p>
            <p className="text-muted-foreground">
              Whether you need a crown to protect a damaged tooth, a bridge to replace missing teeth, 
              or dentures for a complete restoration, our team will work with you to find the best solution.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready to Restore Your Smile?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Book a consultation to discuss your restorative dentistry options.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Appointment</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Restorative;
