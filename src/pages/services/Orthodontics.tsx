import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Smile, Check, ArrowLeft, Calendar } from "lucide-react";

const services = [
  "Traditional metal braces",
  "Ceramic braces",
  "Retainers",
  "Bite correction",
  "Teeth alignment",
];

const Orthodontics = () => {
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
              <div className="h-16 w-16 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                <Smile className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-4xl font-bold text-primary sm:text-5xl">
                Orthodontics
              </h1>
              <p className="text-lg text-muted-foreground">
                Correcting teeth alignment and bite issues for a healthier, more attractive smile. 
                Our orthodontic treatments help you achieve the perfect alignment.
              </p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Consultation
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl bg-muted h-[300px] flex items-center justify-center">
              <Smile className="h-24 w-24 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary mb-8">Orthodontic Treatments</h2>
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

      {/* Benefits */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-bold text-primary mb-6">Benefits of Orthodontic Treatment</h2>
            <p className="text-muted-foreground mb-4">
              Orthodontic treatment goes beyond aesthetics. Properly aligned teeth are easier to clean, 
              reducing the risk of cavities and gum disease. A correct bite also prevents excessive 
              wear on your teeth and reduces jaw strain.
            </p>
            <p className="text-muted-foreground">
              Our team will assess your needs and recommend the best treatment option, whether it's 
              traditional braces or other alignment solutions. We'll work with you to create a 
              personalized treatment plan.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Start Your Orthodontic Journey</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Schedule a consultation to learn about your orthodontic options.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Orthodontics;
