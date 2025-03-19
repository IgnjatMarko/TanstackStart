import { ShoppingBag, X, Menu } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
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
    const [isScrolled, setIsScrolled] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            const menuButton = document.querySelector('[data-menu-button]');
            
            // Don't close if clicking the menu button or inside the menu
            if (menuButton?.contains(target) || menuRef.current?.contains(target)) {
                return;
            }
            
            setIsMenuOpen(false);
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Add keyboard shortcuts for search
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ctrl/Cmd + K to open search
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInputRef.current?.focus();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Escape") {
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
                <div className="flex items-center gap-2">
                    <button
                        type="button"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        data-menu-button
                        className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md lg:hidden cursor-pointer"
                    >
                        <Menu className="w-5 h-5 cursor-pointer" />
                    </button>
                    <Link
                        to="/"
                        className="text-sm font-medium shrink-0"
                    >
                        Shop
                    </Link>
                </div>

                <div className="hidden lg:flex flex-1 px-8 overflow-x-auto items-center justify-center gap-6 scrollbar-none">
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
                        <Input
                            ref={searchInputRef}
                            type="text"
                            value={searchValue}
                            placeholder="Search products... (Ctrl + K)"
                            className="w-48 sm:w-56 h-9"
                            onChange={handleSearchChange}
                            onKeyDown={handleKeyPress}
                        />
                        {searchValue && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-zinc-200 
                                    dark:hover:bg-zinc-700 rounded-full"
                            >
                                <X className="w-4 h-4 cursor-pointer" />
                            </button>
                        )}
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

            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        ref={menuRef}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="lg:hidden border-t border-zinc-200 dark:border-zinc-800"
                    >
                        <div className="py-2 px-3 space-y-1">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => {
                                        onCategoryChange(category);
                                        setIsMenuOpen(false);
                                    }}
                                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors cursor-pointer ${
                                        selectedCategory === category
                                            ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white"
                                            : "text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-white"
                                    }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
