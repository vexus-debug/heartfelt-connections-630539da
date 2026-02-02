import { useState } from "react";
import { Link } from "react-router-dom";
import { NavLink } from "@/components/NavLink";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Menu, Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.jpg";

const services = [
  { title: "General & Preventive Dentistry", href: "/services/general-preventive", description: "Check-ups, scaling, fluoride treatments" },
  { title: "Cosmetic Dentistry", href: "/services/cosmetic", description: "Teeth whitening, veneers, fashion braces" },
  { title: "Orthodontics", href: "/services/orthodontics", description: "Braces, retainers, alignment correction" },
  { title: "Restorative & Prosthodontics", href: "/services/restorative", description: "Crowns, bridges, dentures" },
  { title: "Dental Implants", href: "/services/implants", description: "Natural-looking tooth replacements" },
  { title: "Oral Surgery", href: "/services/oral-surgery", description: "Extractions and surgical procedures" },
  { title: "Gum Treatment & Root Canal", href: "/services/periodontics", description: "Gum disease treatment, endodontics" },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground">
        <div className="container flex h-10 items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <a href="tel:07088788880" className="flex items-center gap-1 hover:text-secondary transition-colors">
              <Phone className="h-3 w-3" />
              <span>070 8878 8880</span>
            </a>
            <span className="hidden sm:inline">|</span>
            <a href="tel:09077766681" className="hidden sm:flex items-center gap-1 hover:text-secondary transition-colors">
              <span>090 7776 6681</span>
            </a>
          </div>
          <a href="mailto:Vista.dcs@gmail.com" className="hover:text-secondary transition-colors">
            Vista.dcs@gmail.com
          </a>
        </div>
      </div>

      {/* Main navigation */}
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Vista Dental Care" className="h-12 w-12 rounded-full object-cover" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">Vista Dental</span>
            <span className="text-xs text-muted-foreground">Care</span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <NavigationMenu className="hidden lg:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavLink
                to="/"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                activeClassName="bg-accent text-accent-foreground"
              >
                Home
              </NavLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavLink
                to="/about"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                activeClassName="bg-accent text-accent-foreground"
              >
                About Us
              </NavLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuTrigger>Services</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[500px] gap-3 p-4 md:grid-cols-2">
                  <li className="col-span-2">
                    <NavigationMenuLink asChild>
                      <Link
                        to="/services"
                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-secondary/50 to-secondary p-6 no-underline outline-none focus:shadow-md"
                      >
                        <div className="mb-2 mt-4 text-lg font-medium text-secondary-foreground">
                          All Services
                        </div>
                        <p className="text-sm leading-tight text-secondary-foreground/80">
                          Comprehensive dental care for your entire family
                        </p>
                      </Link>
                    </NavigationMenuLink>
                  </li>
                  {services.map((service) => (
                    <li key={service.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          to={service.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{service.title}</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {service.description}
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavLink
                to="/testimonials"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                activeClassName="bg-accent text-accent-foreground"
              >
                Testimonials
              </NavLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavLink
                to="/gallery"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                activeClassName="bg-accent text-accent-foreground"
              >
                Gallery
              </NavLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavLink
                to="/contact"
                className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none"
                activeClassName="bg-accent text-accent-foreground"
              >
                Contact
              </NavLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex items-center gap-4">
          <Button asChild className="hidden md:inline-flex bg-secondary hover:bg-secondary/90">
            <Link to="/book-appointment">Book Appointment</Link>
          </Button>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
              <nav className="flex flex-col gap-4 mt-8">
                <Link
                  to="/"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  Home
                </Link>
                <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  About Us
                </Link>
                <div className="space-y-2">
                  <Link
                    to="/services"
                    onClick={() => setIsOpen(false)}
                    className="text-lg font-medium hover:text-secondary transition-colors"
                  >
                    Services
                  </Link>
                  <div className="pl-4 space-y-2">
                    {services.map((service) => (
                      <Link
                        key={service.href}
                        to={service.href}
                        onClick={() => setIsOpen(false)}
                        className="block text-sm text-muted-foreground hover:text-secondary transition-colors"
                      >
                        {service.title}
                      </Link>
                    ))}
                  </div>
                </div>
                <Link
                  to="/testimonials"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  Testimonials
                </Link>
                <Link
                  to="/gallery"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  Gallery
                </Link>
                <Link
                  to="/contact"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-secondary transition-colors"
                >
                  Contact
                </Link>
                <Button asChild className="mt-4 bg-secondary hover:bg-secondary/90">
                  <Link to="/book-appointment" onClick={() => setIsOpen(false)}>
                    Book Appointment
                  </Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* Valentine Promo Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white py-2">
        <div className="container text-center text-sm font-medium">
          💝 Valentine Promo: 25% OFF all services! Feb 1 - 21, 2026{" "}
          <Link to="/promotions" className="underline hover:no-underline ml-2">
            Learn More →
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
