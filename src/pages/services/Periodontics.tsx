import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Heart, Check, ArrowLeft, Calendar } from "lucide-react";

const services = [
  "Gum disease treatment",
  "Deep cleaning (scaling and root planing)",
  "Root canal treatment",
  "Endodontic therapy",
  "Gum grafting",
];

const Periodontics = () => {
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
              <div className="h-16 w-16 rounded-2xl bg-green-500/10 flex items-center justify-center">
                <Heart className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-4xl font-bold text-primary sm:text-5xl">
                Gum Treatment & Root Canal
              </h1>
              <p className="text-lg text-muted-foreground">
                Treatment and management of gum-related diseases and infected tooth pulp. 
                Save your natural teeth with our specialized care.
              </p>
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                <Link to="/book-appointment">
                  <Calendar className="mr-2 h-4 w-4" />
                  Book Appointment
                </Link>
              </Button>
            </div>
            <div className="rounded-2xl bg-muted h-[300px] flex items-center justify-center">
              <Heart className="h-24 w-24 text-muted-foreground/30" />
            </div>
          </div>
        </div>
      </section>

      {/* Services List */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <h2 className="text-3xl font-bold text-primary mb-8">Our Treatments</h2>
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

      {/* Root Canal Info */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Root Canal Treatment</h2>
              <p className="text-muted-foreground">
                Root canal treatment is designed to save a tooth that has become infected or badly 
                decayed. The procedure involves removing the infected pulp, cleaning and disinfecting 
                the inside of the tooth, and then filling and sealing it.
              </p>
              <p className="text-muted-foreground">
                Contrary to popular belief, modern root canal treatment is relatively painless 
                and highly effective. We use local anesthesia and modern techniques to ensure 
                your comfort throughout the procedure.
              </p>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Gum Disease Treatment</h2>
              <p className="text-muted-foreground">
                Gum disease, if left untreated, can lead to tooth loss and other health problems. 
                We offer various treatments depending on the severity of the condition, from deep 
                cleaning to more advanced procedures.
              </p>
              <p className="text-muted-foreground">
                Early detection is key. If you notice symptoms like bleeding gums, persistent bad 
                breath, or loose teeth, schedule an appointment with us right away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold">Don't Ignore Gum Problems</h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Early treatment can save your teeth. Book an appointment today.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Appointment</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Periodontics;
