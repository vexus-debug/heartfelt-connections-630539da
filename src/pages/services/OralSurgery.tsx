import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Scissors, Check, ArrowLeft, Calendar } from "lucide-react";

const services = [
  "Tooth extractions (simple and surgical)",
  "Wisdom tooth removal",
  "Dental surgeries",
  "Pre-prosthetic surgery",
];

const OralSurgery = () => {
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
              <div className="h-16 w-16 rounded-2xl bg-red-500/10 flex items-center justify-center">
                <Scissors className="h-8 w-8 text-red-600" />
              </div>
              <h1 className="text-4xl font-bold text-primary sm:text-5xl">
                Oral Surgery
              </h1>
              <p className="text-lg text-muted-foreground">
                Advanced dental procedures with patient comfort in mind. Our surgical treatments 
                are performed with care and precision to ensure quick recovery.
              </p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Consultation
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl bg-muted h-[300px] flex items-center justify-center">
              <Scissors className="h-24 w-24 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary mb-8">Surgical Procedures</h2>
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

      {/* Extractions */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-primary mb-6">Gentle Tooth Extractions</h2>
            <p className="text-muted-foreground mb-4">
              Sometimes a tooth needs to be removed to protect your oral health. Whether it's due 
              to decay, damage, or overcrowding, we perform extractions with a focus on minimizing 
              discomfort and ensuring quick recovery.
            </p>
            <p className="text-muted-foreground">
              Our team uses modern techniques and appropriate anesthesia to make the process as 
              comfortable as possible. We'll also provide detailed aftercare instructions to 
              help you heal quickly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Need Oral Surgery?</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Don't worry – you're in good hands. Book a consultation today.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default OralSurgery;
