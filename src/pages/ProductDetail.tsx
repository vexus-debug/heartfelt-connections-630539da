import { useParams, Link } from "react-router-dom";
import { useProducts } from "@/hooks/useProducts";
import { useClinicSettings } from "@/hooks/useClinicSettings";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MessageCircle, Package, ShieldCheck, Truck, Clock } from "lucide-react";
import { motion } from "framer-motion";

const formatWhatsAppNumber = (phone: string | null | undefined): string => {
  if (!phone) return "";
  // Strip all non-digit characters
  const digits = phone.replace(/\D/g, "");
  // Nigerian numbers: if starts with 0, replace with country code 234
  if (digits.startsWith("0")) return "234" + digits.slice(1);
  // If already has country code (234...) keep as is
  return digits;
};

const ProductDetail = () => {
  const { productId } = useParams<{ productId: string }>();
  const { products, isLoading } = useProducts();
  const { data: clinicSettings } = useClinicSettings();

  const product = products.find((p) => p.id === productId);

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const whatsappNumber = formatWhatsAppNumber(clinicSettings?.phone);
    if (!whatsappNumber) return;
    const message = encodeURIComponent(
      `Hi! I'd like to order:\n\n` +
      `*${product.name}*\n` +
      `Price: ₦${product.price.toLocaleString()}\n\n` +
      `Please confirm availability. Thank you!`
    );
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, "_blank");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-10 w-10 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Package className="h-16 w-16 text-muted-foreground/40" />
        <h1 className="text-xl font-semibold text-foreground">Product not found</h1>
        <Button asChild variant="outline">
          <Link to="/shop">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Shop
          </Link>
        </Button>
      </div>
    );
  }

  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.category === product.category && p.in_stock)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center px-4">
          <Link
            to="/shop"
            className="flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Shop
          </Link>
        </div>
      </header>

      {/* Product Section */}
      <section className="container mx-auto px-4 py-8 lg:py-16">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Image */}
          <motion.div
            className="relative overflow-hidden rounded-3xl bg-muted aspect-square"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center">
                <Package className="h-24 w-24 text-muted-foreground/20" />
              </div>
            )}
            {product.category && (
              <Badge
                variant="secondary"
                className="absolute top-4 left-4 backdrop-blur-sm bg-background/70"
              >
                {product.category}
              </Badge>
            )}
          </motion.div>

          {/* Details */}
          <motion.div
            className="flex flex-col justify-center"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
              {product.name}
            </h1>

            <p className="mt-4 text-3xl font-bold text-secondary">
              ₦{product.price.toLocaleString()}
            </p>

            {product.description && (
              <p className="mt-6 text-muted-foreground leading-relaxed text-lg">
                {product.description}
              </p>
            )}

            {/* Stock info */}
            <div className="mt-6">
              {product.in_stock ? (
                <Badge className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/20">
                  {product.stock_quantity > 0
                    ? `${product.stock_quantity} in stock`
                    : "In Stock"}
                </Badge>
              ) : (
                <Badge variant="destructive">Out of Stock</Badge>
              )}
            </div>

            {/* CTA */}
            <Button
              size="lg"
              className="mt-8 gap-3 h-14 text-base rounded-2xl bg-[hsl(142,70%,45%)] hover:bg-[hsl(142,70%,40%)] text-white shadow-lg"
              onClick={handleWhatsAppOrder}
              disabled={!product.in_stock}
            >
              <MessageCircle className="h-5 w-5" />
              Order via WhatsApp
            </Button>

            {/* Trust signals */}
            <div className="mt-10 grid grid-cols-3 gap-4">
              {[
                { icon: ShieldCheck, label: "Quality Guaranteed" },
                { icon: Truck, label: "Fast Delivery" },
                { icon: Clock, label: "Quick Response" },
              ].map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex flex-col items-center gap-2 p-3 rounded-xl bg-muted/50 text-center"
                >
                  <Icon className="h-5 w-5 text-secondary" />
                  <span className="text-xs text-muted-foreground font-medium">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            You may also like
          </h2>
          <div className="grid gap-5 grid-cols-2 md:grid-cols-4">
            {relatedProducts.map((rp, i) => (
              <motion.div
                key={rp.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <Link to={`/shop/${rp.id}`} className="group block">
                  <div className="overflow-hidden rounded-2xl bg-card border border-border transition-all duration-500 hover:shadow-lg hover:-translate-y-1">
                    <div className="aspect-square overflow-hidden bg-muted">
                      {rp.image_url ? (
                        <img
                          src={rp.image_url}
                          alt={rp.name}
                          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center">
                          <Package className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="font-medium text-foreground text-sm line-clamp-1">
                        {rp.name}
                      </h3>
                      <p className="mt-1 text-secondary font-bold">
                        ₦{rp.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;
