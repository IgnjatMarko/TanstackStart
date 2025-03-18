import { AnimatePresence } from "motion/react";
import { useState, useMemo } from "react";
import { useQueryState } from "nuqs";
import { ProductGrid } from "./product-grid";
import { CartDrawer } from "./cart-drawer";
import { ProductModal } from "./product-modal";
import { TopBar } from "./top-bar";
import { type Product, type CartItem, products } from "../db/data";

export default function MinimalShop() {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [category, setCategory] = useQueryState("category", {
        defaultValue: "All",
        parse: (value) => value || "All",
    });
    const [productId, setProductId] = useQueryState("product", {
        defaultValue: null,
        parse: (value) => value || null,
    });

    const selectedProduct = useMemo(() => {
        if (!productId) return null;
        return products.find((product) => product.id === productId) || null;
    }, [productId]);

    const totalCartItems = useMemo(() => {
        return cart.reduce((total, item) => total + item.quantity, 0);
    }, [cart]);

    const addToCart = (product: Product, quantity: number = 1) => {
        setCart((prev) => {
            const exists = prev.find((item) => item.id === product.id);
            if (exists) {
                return prev.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + quantity }
                        : item
                );
            }
            return [...prev, { ...product, quantity }];
        });
    };

    const removeFromCart = (productId: string) => {
        setCart((prev) => prev.filter((item) => item.id !== productId));
    };

    const updateCartItemQuantity = (productId: string, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(productId);
            return;
        }
        setCart((prev) =>
            prev.map((item) =>
                item.id === productId
                    ? { ...item, quantity: Math.min(quantity, 99) }
                    : item
            )
        );
    };

    const filteredProducts = useMemo(() => {
        const searchTerms = searchQuery.toLowerCase().split(" ").filter(Boolean);
        
        return products.filter((product) => {
            // Category filter
            const matchesCategory = category === "All" || product.category === category;
            
            // Search filter
            if (!searchQuery) return matchesCategory;
            
            const searchableText = [
                product.name,
                product.category,
                product.description
            ].join(" ").toLowerCase();
            
            // Match all search terms
            const matchesSearch = searchTerms.every(term => 
                searchableText.includes(term)
            );
            
            return matchesCategory && matchesSearch;
        });
    }, [searchQuery, category]);

    return (
        <div className="h-screen bg-zinc-50 dark:bg-zinc-950">
            <TopBar
                cartItemCount={totalCartItems}
                onCartClick={() => setIsCartOpen(true)}
                onSearch={setSearchQuery}
                selectedCategory={category}
                onCategoryChange={setCategory}
            />

            <div className="mx-auto px-2 pt-12 pb-16">
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-zinc-500 dark:text-zinc-400">
                            No products found{searchQuery ? ` for "${searchQuery}"` : ""} 
                            {category !== "All" ? ` in ${category}` : ""}
                        </p>
                    </div>
                ) : (
                    <ProductGrid
                        products={filteredProducts}
                        onProductSelect={(product) => setProductId(product.id)}
                    />
                )}
            </div>

            <AnimatePresence>
                {selectedProduct && (
                    <ProductModal
                        product={selectedProduct}
                        onClose={() => setProductId(null)}
                        onAddToCart={(product, quantity) => {
                            addToCart(product, quantity);
                            setProductId(null);
                            setIsCartOpen(true);
                        }}
                    />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCartOpen && (
                    <CartDrawer
                        cart={cart}
                        onClose={() => setIsCartOpen(false)}
                        onRemoveFromCart={removeFromCart}
                        onUpdateQuantity={updateCartItemQuantity}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}
