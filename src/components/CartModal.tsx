import { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import CheckoutModal from './CheckoutModal';

interface CartModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CartModal({ open, onOpenChange }: CartModalProps) {
  const { items, removeItem, totalPrice } = useCart();
  const { user } = useAuth();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const handleCheckout = () => {
    onOpenChange(false);
    setCheckoutOpen(true);
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
              className="fixed inset-0 bg-foreground/60 backdrop-blur-sm z-50"
            />

            {/* Slide-in Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-card shadow-2xl z-50 flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-6 w-6 text-coral" />
                  <h2 className="font-display text-xl font-bold text-card-foreground">
                    Your Cart
                  </h2>
                  <span className="px-2 py-0.5 bg-coral text-accent-foreground text-sm font-medium rounded-full">
                    {items.length}
                  </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto p-6">
                {items.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mb-4" />
                    <h3 className="font-display text-lg font-bold text-card-foreground mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-muted-foreground mb-6">
                      Add some awesome tees to get started!
                    </p>
                    <Button variant="coral" onClick={() => onOpenChange(false)}>
                      Continue Shopping
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 50 }}
                        className="flex gap-4 p-4 bg-muted rounded-xl"
                      >
                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-background flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-card-foreground truncate">
                            {item.productName}
                          </h4>
                          <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                            <span>Size: {item.size}</span>
                            <span>•</span>
                            <span
                              className="w-4 h-4 rounded border border-border"
                              style={{ backgroundColor: item.color }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="font-display font-bold text-coral">
                              ${item.price.toFixed(2)}
                            </span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => removeItem(item.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              {items.length > 0 && (
                <div className="p-6 border-t border-border bg-background">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-display text-2xl font-bold text-card-foreground">
                      ${totalPrice.toFixed(2)}
                    </span>
                  </div>
                  <Button variant="coral" size="lg" className="w-full" onClick={handleCheckout}>
                    Proceed to Checkout
                    <ArrowRight className="h-5 w-5" />
                  </Button>
                  <p className="text-center text-sm text-muted-foreground mt-3">
                    Shipping calculated at checkout
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
    </>
  );
}
