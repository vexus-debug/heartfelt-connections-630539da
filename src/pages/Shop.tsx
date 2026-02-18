import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Package, Search, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Layout } from "@/components/layout";
import shopHero from "@/assets/shop-hero.jpg";

const Shop = () => {
  const { products, isLoading } = useProducts();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const inStockProducts = useMemo(() => {
    return products
      .filter((p) => p.in_stock)
      .filter((p) => {
        const matchesSearch =
          !search ||
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description?.toLowerCase().includes(search.toLowerCase());
        const matchesCategory =
          activeCategory === "All" || p.category === activeCategory;
        return matchesSearch && matchesCategory;
      });
  }, [products, search, activeCategory]);

  const categories = useMemo(() => {
    const cats = new Set(products.map((p) => p.category).filter(Boolean));
    return ["All", ...Array.from(cats)];
  }, [products]);

  return (
    <Layout>
      {/* Hero */}
      <section className="relative h-[55vh] min-h-[400px] overflow-hidden wave-divider">
        <motion.img
          src={shopHero}
          alt="Dental products"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        {/* Navy-to-transparent gradient matching site hero pattern */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/70 via-primary/40 to-background/80" />

        {/* Decorative blobs */}
        <div className="absolute top-8 right-12 w-40 h-40 blob bg-secondary/20 blur-2xl" />
        <div className="absolute bottom-16 left-8 w-28 h-28 blob-2 bg-primary/30 blur-2xl" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center pb-8 px-4 text-center">
          {/* Icon badge */}
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/20 border border-secondary/30 backdrop-blur-sm mb-5"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <ShoppingBag className="h-4 w-4 text-secondary" />
            <span className="text-sm font-medium text-white">Vista Dental Shop</span>
          </motion.div>

          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-md"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6 }}
          >
            Dental Care Products
          </motion.h1>
          <motion.p
            className="mt-4 max-w-xl text-white/80 text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Quality oral care essentials — order directly via WhatsApp
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="bg-background">
        <div className="container mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 bg-card border-border"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    activeCategory === cat
                      ? "bg-secondary text-secondary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  {cat === "All" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="bg-background">
        <div className="container mx-auto px-4 pb-20">
          {isLoading ? (
            <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : inStockProducts.length === 0 ? (
            <motion.div
              className="flex flex-col items-center justify-center py-24 text-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-20 h-20 rounded-full bg-accent flex items-center justify-center mb-4">
                <Package className="h-10 w-10 text-secondary" />
              </div>
              <h2 className="text-xl font-semibold text-foreground">No Products Found</h2>
              <p className="text-muted-foreground mt-1">
                {search || activeCategory !== "All"
                  ? "Try a different search or category."
                  : "Check back soon for new products."}
              </p>
            </motion.div>
          ) : (
            <motion.div
              className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
              layout
            >
              <AnimatePresence mode="popLayout">
                {inStockProducts.map((product, i) => (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05, duration: 0.4 }}
                  >
                    <Link to={`/shop/${product.id}`} className="group block h-full">
                      <div className="relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-1 h-full flex flex-col">
                        {/* Image */}
                        <div className="aspect-square overflow-hidden bg-muted relative">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-accent/30">
                              <Package className="h-12 w-12 text-secondary/40" />
                            </div>
                          )}

                          {/* Gradient overlay on hover */}
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </div>

                        {/* Category badge */}
                        {product.category && (
                          <Badge
                            variant="secondary"
                            className="absolute top-3 left-3 text-xs backdrop-blur-sm bg-primary/80 text-primary-foreground border-0"
                          >
                            {product.category}
                          </Badge>
                        )}

                        {/* Low stock indicator */}
                        {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                          <Badge
                            variant="destructive"
                            className="absolute top-3 right-3 text-xs"
                          >
                            Only {product.stock_quantity} left
                          </Badge>
                        )}

                        {/* Info */}
                        <div className="p-4 flex flex-col flex-1">
                          <h3 className="font-semibold text-foreground line-clamp-1 text-sm md:text-base group-hover:text-secondary transition-colors">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mt-1 flex-1">
                              {product.description}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-lg font-bold text-secondary">
                              ₦{product.price.toLocaleString()}
                            </p>
                            <span className="text-xs text-muted-foreground bg-accent px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              View →
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </section>

      {/* Bottom CTA section */}
      <section className="bg-primary text-primary-foreground py-14">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Need Personalised Advice?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-xl mx-auto">
            Our dental team is happy to recommend the right oral care products for you.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-secondary text-secondary-foreground font-semibold hover:bg-secondary/90 transition-colors shadow-lg"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </Layout>
  );
};

export default Shop;
