import { Layout } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { Target, Eye, Heart, Lightbulb, Users, Shield, Sparkles } from "lucide-react";

const values = [
  {
    icon: Heart,
    title: "Patient-Centered Care",
    description: "Every treatment plan is personalized to meet your unique dental needs and goals.",
  },
  {
    icon: Shield,
    title: "Safety First",
    description: "We maintain the highest standards of hygiene and use sterilized equipment.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description: "We use modern dental technology for accurate diagnosis and efficient treatment.",
  },
  {
    icon: Users,
    title: "Professional Team",
    description: "Our experienced dental professionals are committed to your comfort and care.",
  },
];

const About = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-dental-teal-pale via-background to-dental-mint">
        <div className="container">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h1 className="text-4xl font-bold text-primary sm:text-5xl">
              About <span className="text-secondary">Vista Dental Care</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Your trusted partner for comprehensive dental care in Abuja. We're committed to 
              delivering high-quality, safe, and effective dental treatments using advanced technology.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">Our Story</h2>
              <p className="text-muted-foreground">
                Vista Dental Care is a modern, patient-focused dental clinic located in Gaduwa, Abuja. 
                We offer comprehensive dental services for individuals and families, committed to 
                delivering high-quality, safe, and effective dental treatments.
              </p>
              <p className="text-muted-foreground">
                Using advanced dental technology in a comfortable and welcoming environment, we address 
                both oral health needs and aesthetic goals, helping patients maintain healthy teeth 
                while achieving confident, beautiful smiles.
              </p>
              <p className="text-muted-foreground">
                Our clinic is strategically located within Axis Plaza, making it easily accessible 
                to residents and professionals within Gaduwa and surrounding areas.
              </p>
            </div>
            <div className="rounded-2xl bg-muted h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Sparkles className="h-16 w-16 mx-auto mb-4 text-secondary opacity-50" />
                <p>Clinic Photo Placeholder</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            <Card className="border-0 bg-card overflow-hidden">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Eye className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To become a leading dental healthcare provider in Abuja, recognized for excellence 
                  in patient care, innovation, and long-term oral health solutions.
                </p>
              </CardContent>
            </Card>
            <Card className="border-0 bg-card overflow-hidden">
              <CardContent className="p-8">
                <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-primary mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide personalized, high-quality dental care using modern techniques and technology, 
                  while ensuring patient comfort, safety, and satisfaction at every stage of treatment.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              Our Core <span className="text-secondary">Values</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              These principles guide everything we do at Vista Dental Care.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <Card key={value.title} className="border-0 bg-muted text-center">
                <CardContent className="p-6">
                  <div className="h-14 w-14 rounded-xl bg-secondary/10 flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="container">
          <div className="grid gap-12 lg:grid-cols-2 items-center">
            <div className="rounded-2xl bg-card h-[400px] flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Lightbulb className="h-16 w-16 mx-auto mb-4 text-secondary opacity-50" />
                <p>Technology Photo Placeholder</p>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-primary">
                Modern <span className="text-secondary">Technology</span>
              </h2>
              <p className="text-muted-foreground">
                Vista Dental Care utilizes modern dental equipment and updated treatment protocols to ensure:
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground">Accurate diagnosis</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground">Efficient procedures</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground">Long-lasting results</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="h-2 w-2 rounded-full bg-secondary"></div>
                  <span className="text-muted-foreground">Reduced patient discomfort</span>
                </li>
              </ul>
              <p className="text-muted-foreground">
                Every patient receives personalized treatment plans based on their dental condition, 
                lifestyle, and expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container">
          <div className="text-center space-y-4 mb-12">
            <h2 className="text-3xl font-bold text-primary sm:text-4xl">
              Meet Our <span className="text-secondary">Team</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our experienced dental professionals are dedicated to providing you with the best care possible.
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="border-0 bg-muted text-center">
                <CardContent className="p-6">
                  <div className="h-32 w-32 rounded-full bg-secondary/10 mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-16 w-16 text-secondary opacity-50" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">Team Member {i}</h3>
                  <p className="text-muted-foreground text-sm">Dental Specialist</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center space-y-6">
          <h2 className="text-3xl font-bold sm:text-4xl">
            Ready to Experience Our Care?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto">
            Join our growing family of satisfied patients. Book your appointment today.
          </p>
          <Button asChild size="lg" variant="secondary" className="bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Appointment</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default About;
