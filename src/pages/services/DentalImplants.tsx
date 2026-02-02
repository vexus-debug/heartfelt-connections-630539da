import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Syringe, Check, ArrowLeft, Calendar } from "lucide-react";

const benefits = [
  "Natural-looking appearance",
  "Permanent solution",
  "Improved chewing ability",
  "No impact on adjacent teeth",
  "Long-lasting durability",
  "Bone preservation",
];

const DentalImplants = () => {
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
              <div className="h-16 w-16 rounded-2xl bg-teal-500/10 flex items-center justify-center">
                <Syringe className="h-8 w-8 text-teal-600" />
              </div>
              <h1 className="text-4xl font-bold text-primary sm:text-5xl">
                Dental Implants
              </h1>
              <p className="text-lg text-muted-foreground">
                Durable, natural-looking replacements for missing teeth using advanced implant 
                technology, improving both function and aesthetics.
              </p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Consultation
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl bg-muted h-[300px] flex items-center justify-center">
              <Syringe className="h-24 w-24 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary mb-8">Benefits of Dental Implants</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {benefits.map((benefit) => (
              <Card key={benefit} className="border-0 bg-muted">
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Check className="h-5 w-5 text-secondary" />
                  </div>
                  <span className="font-medium">{benefit}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary mb-8">The Implant Process</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-secondary mb-4">01</div>
                <h3 className="text-lg font-semibold mb-2">Consultation</h3>
                <p className="text-muted-foreground text-sm">
                  We assess your oral health and determine if implants are right for you.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-secondary mb-4">02</div>
                <h3 className="text-lg font-semibold mb-2">Placement</h3>
                <p className="text-muted-foreground text-sm">
                  The implant is surgically placed into the jawbone with care and precision.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card">
              <CardContent className="p-6">
                <div className="text-4xl font-bold text-secondary mb-4">03</div>
                <h3 className="text-lg font-semibold mb-2">Restoration</h3>
                <p className="text-muted-foreground text-sm">
                  A custom crown is attached, giving you a natural-looking tooth.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Interested in Dental Implants?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Book a consultation to learn if dental implants are right for you.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default DentalImplants;
