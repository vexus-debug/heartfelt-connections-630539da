import { useState, useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShoppingBag, ArrowLeft, Package, Search, Filter } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import shopHero from "@/assets/shop-hero.jpg";

const CATEGORIES = ["All", "general", "whitening", "orthodontics", "hygiene", "tools"];

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Back to Home</span>
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-secondary" />
            <span className="text-lg font-bold text-foreground tracking-tight">
              Vista Shop
            </span>
          </div>
          <div className="w-20" />
        </div>
      </header>

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[380px] overflow-hidden">
        <motion.img
          src={shopHero}
          alt="Dental products"
          className="absolute inset-0 h-full w-full object-cover"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="relative z-10 flex h-full flex-col items-center justify-end pb-12 px-4 text-center">
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            Dental Care Products
          </motion.h1>
          <motion.p
            className="mt-3 max-w-xl text-muted-foreground text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            Quality oral care essentials — order directly via WhatsApp
          </motion.p>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="container mx-auto px-4 py-8">
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
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "bg-muted text-muted-foreground hover:bg-accent"
                }`}
              >
                {cat === "All" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 pb-20">
        {isLoading ? (
          <div className="grid gap-5 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] rounded-2xl bg-muted animate-pulse"
              />
            ))}
          </div>
        ) : inStockProducts.length === 0 ? (
          <motion.div
            className="flex flex-col items-center justify-center py-24 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Package className="h-16 w-16 text-muted-foreground/40 mb-4" />
            <h2 className="text-xl font-semibold text-foreground">
              No Products Found
            </h2>
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
                  <Link to={`/shop/${product.id}`} className="group block">
                    <div className="relative overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 hover:shadow-xl hover:-translate-y-1">
                      {/* Image */}
                      <div className="aspect-square overflow-hidden bg-muted">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-12 w-12 text-muted-foreground/30" />
                          </div>
                        )}
                      </div>

                      {/* Category badge */}
                      {product.category && (
                        <Badge
                          variant="secondary"
                          className="absolute top-3 left-3 text-xs backdrop-blur-sm bg-background/70"
                        >
                          {product.category}
                        </Badge>
                      )}

                      {/* Stock indicator */}
                      {product.stock_quantity > 0 && product.stock_quantity <= 5 && (
                        <Badge
                          variant="destructive"
                          className="absolute top-3 right-3 text-xs"
                        >
                          Only {product.stock_quantity} left
                        </Badge>
                      )}

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-foreground line-clamp-1 text-sm md:text-base group-hover:text-primary transition-colors">
                          {product.name}
                        </h3>
                        {product.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {product.description}
                          </p>
                        )}
                        <p className="mt-3 text-lg font-bold text-secondary">
                          ₦{product.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>
    </div>
  );
};

export default Shop;
