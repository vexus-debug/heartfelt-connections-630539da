import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import {
  Stethoscope,
  Sparkles,
  Smile,
  Crown,
  Syringe,
  Scissors,
  Heart,
  ChevronRight,
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "General & Preventive Dentistry",
    description: "Focused on maintaining oral health and preventing dental issues. Includes dental consultation, routine check-ups, scaling and polishing, fluoride treatments, dental sealants, tooth fillings, and oral health awareness campaigns.",
    href: "/services/general-preventive",
    color: "bg-blue-500/10 text-blue-600",
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    description: "Enhancing the appearance of teeth and smiles. Services include professional teeth whitening, fashion braces, and veneers for a beautiful, confident smile.",
    href: "/services/cosmetic",
    color: "bg-pink-500/10 text-pink-600",
  },
  {
    icon: Smile,
    title: "Orthodontics",
    description: "Correcting teeth alignment and bite issues. We offer dental braces and retainers to help you achieve a perfectly aligned smile.",
    href: "/services/orthodontics",
    color: "bg-purple-500/10 text-purple-600",
  },
  {
    icon: Crown,
    title: "Restorative & Prosthodontics",
    description: "Designed to restore damaged or missing teeth. Services include dental crowns (Gold, Silver), bridges, dentures, and denture repairs.",
    href: "/services/restorative",
    color: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Syringe,
    title: "Dental Implants",
    description: "Durable, natural-looking replacements for missing teeth using advanced implant technology, improving both function and aesthetics.",
    href: "/services/implants",
    color: "bg-teal-500/10 text-teal-600",
  },
  {
    icon: Scissors,
    title: "Oral Surgery",
    description: "Advanced dental procedures with patient comfort in mind. Includes tooth extractions and dental surgeries performed with care and precision.",
    href: "/services/oral-surgery",
    color: "bg-red-500/10 text-red-600",
  },
  {
    icon: Heart,
    title: "Gum Treatment & Root Canal",
    description: "Treatment and management of gum-related diseases and infected tooth pulp. Includes periodontal care and endodontic procedures.",
    href: "/services/periodontics",
    color: "bg-green-500/10 text-green-600",
  },
];

const Services = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              Our <span className="text-secondary">Services</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Comprehensive dental care tailored to your needs. From preventive care to advanced 
              cosmetic procedures, we've got your smile covered.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.title}
                className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 bg-muted"
              >
                <CardContent className="p-8">
                  <div className={`h-16 w-16 rounded-2xl ${service.color} flex items-center justify-center mb-6`}>
                    <service.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-primary mb-3">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 line-clamp-4">{service.description}</p>
                  <Button asChild variant="outline" className="w-full group-hover:bg-secondary group-hover:text-secondary-foreground group-hover:border-secondary transition-colors">
                    <Link to={service.href}>
                      Learn More
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Highlights Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              Why Choose <span className="text-secondary">Our Services</span>
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-secondary mb-2">500+</div>
              <div className="text-muted-foreground">Happy Patients</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-secondary mb-2">Modern</div>
              <div className="text-muted-foreground">Equipment & Technology</div>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl font-bold text-secondary mb-2">Expert</div>
              <div className="text-muted-foreground">Dental Team</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Not Sure Which Service You Need?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Book a consultation with our dental experts. We'll assess your needs and recommend 
            the best treatment plan for you.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Consultation</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
