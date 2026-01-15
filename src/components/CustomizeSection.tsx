import { useState } from 'react';
import { motion } from 'framer-motion';
import { Palette, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useCart } from '@/contexts/CartContext';
import { db, Product } from '@/lib/database';
import { toast } from 'sonner';
import { useEffect } from 'react';

const COLORS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Black', value: '#1a1a1a' },
  { name: 'Navy', value: '#1e3a5f' },
  { name: 'Gray', value: '#6b7280' },
  { name: 'Coral', value: '#e76f51' },
  { name: 'Forest', value: '#2d5a3d' },
];

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function CustomizeSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState(COLORS[0].value);
  const [selectedSize, setSelectedSize] = useState('M');
  const [notes, setNotes] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    const loadProducts = async () => {
      const data = await db.getProducts();
      setProducts(data);
      if (data.length > 0) {
        setSelectedProduct(data[0]);
      }
    };
    loadProducts();
  }, []);

  const handleAddToCart = async () => {
    if (!selectedProduct) {
      toast.error('Please select a product');
      return;
    }

    await addItem(selectedProduct, selectedSize, selectedColor, notes);
    setNotes('');
  };

  return (
    <section id="customize" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-coral/10 border border-coral/20 mb-4">
            <Palette className="h-4 w-4 text-coral" />
            <span className="text-sm font-medium text-coral">
              Design Studio
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Create Your <span className="text-gradient">Custom Design</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose your perfect style. Select colors, sizes, and add custom notes for a truly unique piece.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          {/* Preview */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden bg-card shadow-card">
              {selectedProduct && (
                <div 
                  className="w-full h-full flex items-center justify-center p-8 transition-colors duration-300"
                  style={{ backgroundColor: selectedColor === '#ffffff' ? '#f5f5f5' : selectedColor + '20' }}
                >
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="w-full h-full object-contain rounded-2xl"
                  />
                </div>
              )}
            </div>
            
            {/* Selected color indicator */}
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-card/95 backdrop-blur-sm rounded-full shadow-md">
              <div className="flex items-center gap-2">
                <div 
                  className="w-5 h-5 rounded-full border-2 border-border"
                  style={{ backgroundColor: selectedColor }}
                />
                <span className="text-sm font-medium text-card-foreground">
                  {COLORS.find(c => c.value === selectedColor)?.name} / {selectedSize}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Options */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Product Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Select Product
              </label>
              <div className="grid grid-cols-2 gap-3">
                {products.slice(0, 4).map((product) => (
                  <button
                    key={product.id}
                    onClick={() => setSelectedProduct(product)}
                    className={`p-4 rounded-xl border-2 text-left transition-all ${
                      selectedProduct?.id === product.id
                        ? 'border-coral bg-coral/5'
                        : 'border-border bg-card hover:border-coral/50'
                    }`}
                  >
                    <div className="font-medium text-card-foreground truncate">
                      {product.name}
                    </div>
                    <div className="text-coral font-display font-bold">
                      ${product.price.toFixed(2)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Choose Color
              </label>
              <div className="flex flex-wrap gap-3">
                {COLORS.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => setSelectedColor(color.value)}
                    className={`w-12 h-12 rounded-full border-2 transition-all hover:scale-110 ${
                      selectedColor === color.value
                        ? 'border-coral scale-110 shadow-lg'
                        : 'border-border'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Select Size
              </label>
              <div className="flex flex-wrap gap-2">
                {SIZES.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-xl font-medium transition-all ${
                      selectedSize === size
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-card text-muted-foreground border border-border hover:border-primary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-3">
                Custom Notes (Optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any special instructions for your custom design..."
                className="min-h-[100px] resize-none"
              />
            </div>

            {/* Price & Add to Cart */}
            <div className="pt-4 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <span className="text-muted-foreground">Total Price</span>
                <span className="font-display text-3xl font-bold text-coral">
                  ${selectedProduct?.price.toFixed(2) || '0.00'}
                </span>
              </div>
              <Button variant="coral" size="lg" className="w-full" onClick={handleAddToCart}>
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
