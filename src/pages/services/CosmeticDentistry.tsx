import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Sparkles, Check, ArrowLeft, Calendar } from "lucide-react";

const services = [
  "Professional teeth whitening",
  "Fashion braces",
  "Veneers",
  "Smile makeovers",
];

const CosmeticDentistry = () => {
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
              <div className="h-16 w-16 rounded-2xl bg-pink-500/10 flex items-center justify-center">
                <Sparkles className="h-8 w-8 text-pink-600" />
              </div>
              <h1 className="text-4xl font-bold text-primary sm:text-5xl">
                Cosmetic Dentistry
              </h1>
              <p className="text-lg text-muted-foreground">
                Enhance the appearance of your teeth and achieve the smile you've always dreamed of. 
                Our cosmetic treatments are designed to give you a confident, beautiful smile.
              </p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Consultation
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl bg-muted h-[300px] flex items-center justify-center">
              <Sparkles className="h-24 w-24 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary mb-8">Our Cosmetic Services</h2>
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

      {/* Teeth Whitening Feature */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="rounded-2xl bg-card h-[300px] flex items-center justify-center">
              <Sparkles className="h-24 w-24 text-secondary/30" />
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Professional Teeth Whitening</h2>
              <p className="text-muted-foreground">
                Our professional whitening treatments safely remove stains and discoloration, 
                restoring a brighter and more youthful smile. Unlike over-the-counter products, 
                our treatments are administered by dental professionals for optimal results.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-secondary" />
                  <span>Safe and effective treatment</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-secondary" />
                  <span>Long-lasting results</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-secondary" />
                  <span>Minimal sensitivity</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Ready for Your Smile Makeover?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Book a consultation to discuss your cosmetic dentistry options.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default CosmeticDentistry;
