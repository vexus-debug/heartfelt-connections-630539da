import { Link } from "react-router-dom";
import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Stethoscope,
  Sparkles,
  Smile,
  Crown,
  Syringe,
  Scissors,
  Heart,
  Phone,
  MapPin,
  Clock,
  Star,
  ChevronRight,
  ArrowRight,
} from "lucide-react";

const services = [
  {
    icon: Stethoscope,
    title: "General & Preventive",
    description: "Routine check-ups, scaling, polishing, and fluoride treatments",
    href: "/services/general-preventive",
  },
  {
    icon: Sparkles,
    title: "Cosmetic Dentistry",
    description: "Teeth whitening, veneers, and fashion braces",
    href: "/services/cosmetic",
  },
  {
    icon: Smile,
    title: "Orthodontics",
    description: "Braces and retainers for perfect alignment",
    href: "/services/orthodontics",
  },
  {
    icon: Crown,
    title: "Restorative Care",
    description: "Crowns, bridges, and dentures for damaged teeth",
    href: "/services/restorative",
  },
  {
    icon: Syringe,
    title: "Dental Implants",
    description: "Permanent, natural-looking tooth replacements",
    href: "/services/implants",
  },
  {
    icon: Heart,
    title: "Gum Treatment",
    description: "Periodontal care and root canal therapy",
    href: "/services/periodontics",
  },
];

const testimonials = [
  {
    name: "Amina O.",
    rating: 5,
    text: "Vista Dental Care transformed my smile! The team is incredibly professional and made me feel comfortable throughout my treatment.",
  },
  {
    name: "Chukwudi E.",
    rating: 5,
    text: "Best dental experience I've ever had. The clinic is modern and clean, and the staff are so friendly. Highly recommend!",
  },
  {
    name: "Fatima M.",
    rating: 5,
    text: "I was so nervous about my root canal, but Dr. Vista made it painless. Thank you for your gentle care!",
  },
];

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
        <div className="container relative py-16 md:py-24 lg:py-32">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
            <div className="space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary font-medium">
                <Sparkles className="h-4 w-4" />
                Welcome to Vista Dental Care
              </div>
              <h1 className="text-4xl font-bold tracking-tight text-primary sm:text-5xl lg:text-6xl">
                Your Smile,{" "}
                <span className="text-secondary">Our Priority</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-lg">
                Experience world-class dental care in a comfortable, modern environment. 
                We're committed to giving you a healthy, beautiful smile that lasts a lifetime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90">
                  <Link to="/book-appointment">
                    Book Your Appointment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/services">Explore Our Services</Link>
                </Button>
              </div>
              <div className="flex items-center gap-6 pt-4">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="h-10 w-10 rounded-full bg-muted border-2 border-background flex items-center justify-center text-xs font-medium"
                      >
                        {String.fromCharCode(64 + i)}
                      </div>
                    ))}
                  </div>
                  <div className="text-sm">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <span className="text-muted-foreground">500+ Happy Patients</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative lg:pl-8 animate-slide-in-right">
              <div className="aspect-square max-w-lg mx-auto rounded-3xl bg-gradient-to-br from-secondary/20 to-primary/20 p-8 lg:p-12">
                <div className="h-full w-full rounded-2xl bg-muted flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Smile className="h-24 w-24 mx-auto text-secondary" />
                    <p className="text-muted-foreground">Professional Dental Care</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-secondary/10 blur-2xl"></div>
              <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-primary/10 blur-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* About Preview Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">
                Your Trusted Partner for{" "}
                <span className="text-secondary">Dental Excellence</span>
              </h2>
              <p className="text-muted-foreground">
                Vista Dental Care is a modern, patient-focused dental clinic located in Gaduwa, Abuja. 
                We offer comprehensive dental services for individuals and families, using advanced 
                dental technology in a comfortable and welcoming environment.
              </p>
              <p className="text-muted-foreground">
                Our mission is to provide personalized, high-quality dental care using modern techniques 
                and technology, while ensuring patient comfort, safety, and satisfaction at every stage 
                of treatment.
              </p>
              <Button asChild variant="outline">
                <Link to="/about">
                  Learn More About Us
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <Card className="bg-dental-teal-pale border-0">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-secondary">500+</div>
                    <div className="text-sm text-muted-foreground">Happy Patients</div>
                  </CardContent>
                </Card>
                <Card className="bg-dental-mint border-0">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">7+</div>
                    <div className="text-sm text-muted-foreground">Services Offered</div>
                  </CardContent>
                </Card>
              </div>
              <div className="space-y-4 pt-8">
                <Card className="bg-dental-mint border-0">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-primary">5+</div>
                    <div className="text-sm text-muted-foreground">Years Experience</div>
                  </CardContent>
                </Card>
                <Card className="bg-dental-teal-pale border-0">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-secondary">100%</div>
                    <div className="text-sm text-muted-foreground">Patient Satisfaction</div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              Our <span className="text-secondary">Services</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We offer a comprehensive range of dental services to meet all your oral health needs. 
              From preventive care to advanced cosmetic procedures.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card
                key={service.title}
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 bg-card"
              >
                <CardContent className="p-6">
                  <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                    <service.icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{service.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                  <Link
                    to={service.href}
                    className="text-secondary font-medium text-sm inline-flex items-center hover:underline"
                  >
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild size="lg">
              <Link to="/services">View All Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Valentine Promo Section */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-pink-500 to-rose-500 text-white">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-medium">
                💝 Limited Time Offer
              </div>
              <h2 className="text-3xl font-bold sm:text-4xl lg:text-5xl">
                Valentine's Day Special
              </h2>
              <p className="text-lg text-white/90">
                Show your smile some love! Enjoy 25% OFF on all dental services from February 1-21, 2026. 
                Perfect time to get that smile makeover you've been dreaming of.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button asChild size="lg" variant="secondary" className="bg-white text-rose-500 hover:bg-white/90">
                  <Link to="/book-appointment">Book Now & Save</Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Link to="/promotions">Learn More</Link>
                </Button>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="relative">
                <div className="h-64 w-64 rounded-full bg-white/10 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-6xl font-bold">25%</div>
                    <div className="text-xl">OFF</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 animate-pulse-gentle">
                  <Heart className="h-12 w-12 fill-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              What Our <span className="text-secondary">Patients Say</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Don't just take our word for it. Here's what our patients have to say about their experience at Vista Dental Care.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-0 bg-muted">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-semibold">
                      {testimonial.name.charAt(0)}
                    </div>
                    <span className="font-medium">{testimonial.name}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <Link to="/testimonials">Read More Reviews</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Location Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary sm:text-4xl">
                Visit Our <span className="text-secondary">Clinic</span>
              </h2>
              <p className="text-muted-foreground">
                Conveniently located in Gaduwa, Abuja, our modern clinic is easily accessible 
                and equipped with the latest dental technology.
              </p>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Address</h4>
                    <p className="text-muted-foreground text-sm">
                      Shop 221, Axis Plaza, Plot 678, Rachel T. Owolabi Close, Gaduwa, Abuja.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Phone className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Phone</h4>
                    <p className="text-muted-foreground text-sm">
                      070 8878 8880 | 090 7776 6681
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                    <Clock className="h-5 w-5 text-secondary" />
                  </div>
                  <div>
                    <h4 className="font-semibold">Working Hours</h4>
                    <p className="text-muted-foreground text-sm">
                      Monday - Saturday: 9:00 AM - 6:00 PM
                    </p>
                  </div>
                </div>
              </div>
              <Button asChild className="bg-secondary hover:bg-secondary/90">
                <Link to="/contact">Get Directions</Link>
              </Button>
            </div>
            <div className="rounded-2xl overflow-hidden bg-card h-[400px] flex items-center justify-center border">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p>Map placeholder</p>
                <p className="text-sm">Gaduwa, Abuja</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready for Your Best Smile?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Book your appointment today and take the first step towards a healthier, more confident smile. 
            Our team is ready to provide you with exceptional dental care.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
              <Link to="/book-appointment">Book Appointment</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10">
              <a href="tel:07088788880">
                <Phone className="mr-2 h-4 w-4" />
                Call Us Now
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
