import { Search, ShoppingBag, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Link } from "@tanstack/react-router";
import { Input } from "../ui/input";

interface TopBarProps {
    cartItemCount: number;
    onCartClick: () => void;
    onSearch: (query: string) => void;
    selectedCategory: string;
    onCategoryChange: (category: string) => void;
}

const categories = [
    "All",
    "Lighting",
    "Kitchenware",
    "Home Decor",
    "Plants",
    "Office",
    "Textiles",
];

export function TopBar({ 
    cartItemCount, 
    onCartClick, 
    onSearch,
    selectedCategory,
    onCategoryChange,
}: TopBarProps) {
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Add keyboard shortcuts for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsSearchOpen(true);
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
            setIsSearchOpen(false);
            setSearchValue("");
            onSearch("");
            searchInputRef.current?.blur();
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        onSearch(value);
    };

    const clearSearch = () => {
        setSearchValue("");
        onSearch("");
        setIsSearchOpen(false);
    };

    return (
        <div
            className={`sticky top-0 z-40 transition-all duration-200 ${
                isScrolled
                    ? "bg-white/90 dark:bg-zinc-900/90 shadow-sm"
                    : "bg-white/80 dark:bg-zinc-900/80"
            } backdrop-blur-sm border-b border-zinc-200 dark:border-zinc-800`}
        >
            <div className="flex items-center justify-between px-3 h-12">
                <Link
                    to="/"
                    className="text-sm font-medium shrink-0"
                >
                    Shop
                </Link>

                <div className="flex-1 px-8 overflow-x-auto flex items-center justify-center gap-6 scrollbar-none">
                    {categories.map((category) => (
                        <button
                            type="button"
                            key={category}
                            className={`whitespace-nowrap transition-colors cursor-pointer ${
                                selectedCategory === category
                                    ? "text-zinc-900 dark:text-white text-sm font-medium"
                                    : "text-zinc-500 dark:text-zinc-400 text-sm hover:text-zinc-900 dark:hover:text-white"
                            }`}
                            onClick={() => onCategoryChange(category)}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                    <div className="relative flex items-center">
                        <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ 
                                width: isSearchOpen ? 'auto' : 0,
                                opacity: isSearchOpen ? 1 : 0,
                                marginRight: isSearchOpen ? '0.5rem' : 0
                            }}
                            transition={{ 
                                duration: 0.2,
                                ease: "easeInOut"
                            }}
                            className="overflow-hidden"
                        >
                            <Input
                                ref={searchInputRef}
                                type="text"
                                value={searchValue}
                                placeholder="Search products..."
                                className="w-48 sm:w-56 h-9 px-3 py-1 text-sm rounded-md border bg-transparent shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
                                onChange={handleSearchChange}
                                onKeyDown={handleKeyPress}
                            />
                            {isSearchOpen && (
                                <motion.button
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.1 }}
                                    type="button"
                                    onClick={clearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 
                                        dark:hover:bg-zinc-700 rounded-full"
                                >
                                    <X className="w-4 h-4" />
                                </motion.button>
                            )}
                        </motion.div>
                        <motion.button
                            type="button"
                            onClick={() => {
                                setIsSearchOpen(!isSearchOpen);
                                if (!isSearchOpen) {
                                    setTimeout(() => searchInputRef.current?.focus(), 100);
                                } else {
                                    clearSearch();
                                }
                            }}
                            initial={false}
                            animate={{
                                opacity: isSearchOpen ? 0 : 1,
                                scale: isSearchOpen ? 0.8 : 1
                            }}
                            transition={{ duration: 0.2 }}
                            className={`p-1.5 rounded-md transition-colors overflow-hidden cursor-pointer ${
                                isSearchOpen
                                    ? "bg-zinc-100 dark:bg-zinc-800"
                                    : "hover:bg-zinc-100 dark:hover:bg-zinc-800"
                            }`}
                            aria-label="Toggle search"
                        >
                            <Search className="w-4 h-4" />
                        </motion.button>
                    </div>
                    <button
                        type="button"
                        onClick={onCartClick}
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md relative cursor-pointer"
                    >
                        <ShoppingBag className="w-4 h-4" />
                        {cartItemCount > 0 && (
                            <motion.span
                                initial={{ scale: 0.5 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 bg-zinc-900 dark:bg-white 
                                    text-white dark:text-zinc-900 text-xs font-medium w-4 h-4 
                                    flex items-center justify-center rounded-full"
                            >
                                {cartItemCount}
                            </motion.span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
