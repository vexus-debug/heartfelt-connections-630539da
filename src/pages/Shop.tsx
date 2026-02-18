import { useState } from "react";
import { useProducts } from "@/hooks/useProducts";
import { useProductOrders } from "@/hooks/useProductOrders";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { ShoppingBag, MessageCircle, ArrowLeft, Package } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const CLINIC_WHATSAPP = "2348000000000"; // Replace with actual clinic WhatsApp

const Shop = () => {
  const { products, isLoading } = useProducts();
  const { createOrder } = useProductOrders();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [ordering, setOrdering] = useState(false);

  const inStockProducts = products.filter((p) => p.in_stock);

  const handleOrder = async () => {
    if (!customerName.trim() || !customerPhone.trim()) {
      toast({ title: "Please fill in your name and phone number", variant: "destructive" });
      return;
    }
    setOrdering(true);
    try {
      const totalAmount = selectedProduct.price * quantity;

      // Save order to database
      await createOrder.mutateAsync({
        product_id: selectedProduct.id,
        product_name: selectedProduct.name,
        quantity,
        unit_price: selectedProduct.price,
        total_amount: totalAmount,
        customer_name: customerName,
        customer_phone: customerPhone,
        customer_email: "",
        status: "pending",
        notes: "",
      });

      // Redirect to WhatsApp
      const message = encodeURIComponent(
        `🛒 *New Product Order*\n\n` +
        `*Product:* ${selectedProduct.name}\n` +
        `*Quantity:* ${quantity}\n` +
        `*Unit Price:* ₦${selectedProduct.price.toLocaleString()}\n` +
        `*Total:* ₦${totalAmount.toLocaleString()}\n\n` +
        `*Customer:* ${customerName}\n` +
        `*Phone:* ${customerPhone}\n\n` +
        `I'd like to order this product. Please confirm availability.`
      );
      window.open(`https://wa.me/${CLINIC_WHATSAPP}?text=${message}`, "_blank");

      toast({ title: "Order placed!", description: "You'll be redirected to WhatsApp to confirm." });
      setSelectedProduct(null);
      setCustomerName("");
      setCustomerPhone("");
      setQuantity(1);
    } catch {
      // error handled in hook
    } finally {
      setOrdering(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2 text-primary font-semibold">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <span className="text-lg font-bold text-foreground">Dental Materials Shop</span>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-foreground md:text-4xl">Dental Materials & Products</h1>
          <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
            Browse our selection of quality dental care products. Order directly via WhatsApp for quick service.
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="container mx-auto px-4 py-10">
        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <Card key={i}>
                <Skeleton className="h-48 w-full rounded-t-lg" />
                <CardContent className="p-4 space-y-2">
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-6 w-1/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : inStockProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Package className="h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground">No Products Available</h2>
            <p className="text-muted-foreground mt-1">Check back soon for new dental materials and products.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {inStockProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                <div className="aspect-square overflow-hidden bg-muted">
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Package className="h-16 w-16 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-base line-clamp-2">{product.name}</CardTitle>
                    <Badge variant="secondary" className="shrink-0 ml-2">{product.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  {product.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                  )}
                  <p className="mt-2 text-lg font-bold text-primary">₦{product.price.toLocaleString()}</p>
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-2" onClick={() => setSelectedProduct(product)}>
                    <MessageCircle className="h-4 w-4" />
                    Order via WhatsApp
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Order Dialog */}
      <Dialog open={!!selectedProduct} onOpenChange={() => setSelectedProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Order {selectedProduct?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4 p-3 bg-muted rounded-lg">
              {selectedProduct?.image_url && (
                <img src={selectedProduct.image_url} alt="" className="h-16 w-16 rounded object-cover" />
              )}
              <div>
                <p className="font-medium text-foreground">{selectedProduct?.name}</p>
                <p className="text-primary font-bold">₦{selectedProduct?.price?.toLocaleString()}</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Your Name *</Label>
              <Input value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="Full name" />
            </div>
            <div className="space-y-2">
              <Label>Phone Number *</Label>
              <Input value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="e.g. 08012345678" />
            </div>
            <div className="space-y-2">
              <Label>Quantity</Label>
              <Input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              />
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-xl font-bold text-primary">
                ₦{((selectedProduct?.price || 0) * quantity).toLocaleString()}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedProduct(null)}>Cancel</Button>
            <Button onClick={handleOrder} disabled={ordering} className="gap-2">
              <MessageCircle className="h-4 w-4" />
              {ordering ? "Processing..." : "Send to WhatsApp"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Shop;
