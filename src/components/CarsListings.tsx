"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Heart,
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  X,
  ChevronDown,
  Check,
  Phone
} from "lucide-react";
import { cars, Car } from "@/data/cars";
import { siteConfig } from "@/data/site";
import { getGeneralWhatsAppLink } from "@/utils/whatsapp";

// Available Filter values
const BRANDS = ["Maruti Suzuki", "Honda", "Renault", "Tata", "Ford"];
const YEARS = [2014, 2016, 2017, 2018, 2021, 2022];
const FUELS = ["Petrol", "Diesel", "CNG", "Electric"];
const BODIES = ["Sedan", "Hatchback", "SUV", "MUV"];
const GEARBOXES = ["Manual", "Automatic"];
const OWNERS = ["1st", "2nd"];

const SORT_OPTIONS = [
  { label: "RELEVANCE", value: "relevance" },
  { label: "PRICE: LOW TO HIGH", value: "price-asc" },
  { label: "PRICE: HIGH TO LOW", value: "price-desc" },
  { label: "KM DRIVEN: LOWEST FIRST", value: "km-asc" },
  { label: "YEAR: NEWEST FIRST", value: "year-desc" }
];

export default function CarsListings() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Search, Sort, Filter States (synchronized with URL params)
  const searchQuery = searchParams.get("search") || "";
  const sortQuery = searchParams.get("sort") || "relevance";
  const budgetQuery = searchParams.get("budget") || "";
  const bodyQuery = searchParams.get("body") || "";
  const fuelQuery = searchParams.get("fuel") || "";
  const gearboxQuery = searchParams.get("gearbox") || "";
  const brandQuery = searchParams.get("brand") || "";
  const yearQuery = searchParams.get("year") || "";
  const kmQuery = searchParams.get("km") || "";
  const ownerQuery = searchParams.get("owner") || "";

  // UI States
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFilterTab, setActiveFilterTab] = useState("PRICE");
  const [isDesktopSortOpen, setIsDesktopSortOpen] = useState(false);
  const [likedCars, setLikedCars] = useState<number[]>([]);

  // Local copy of filter states for the mobile sheet
  const [localFilters, setLocalFilters] = useState({
    budget: "",
    body: "",
    fuel: "",
    gearbox: "",
    brands: [] as string[],
    years: [] as number[],
    km: "",
    owner: ""
  });

  // Load favorites from localstorage
  useEffect(() => {
    const saved = localStorage.getItem("liked_cars");
    if (saved) {
      try {
        setLikedCars(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    let updated = [...likedCars];
    if (updated.includes(id)) {
      updated = updated.filter((item) => item !== id);
    } else {
      updated.push(id);
    }
    setLikedCars(updated);
    localStorage.setItem("liked_cars", JSON.stringify(updated));
  };

  // Sync mobile filter sheet with URL on open
  useEffect(() => {
    if (isFilterOpen) {
      setLocalFilters({
        budget: budgetQuery,
        body: bodyQuery,
        fuel: fuelQuery,
        gearbox: gearboxQuery,
        brands: brandQuery ? brandQuery.split(",") : [],
        years: yearQuery ? yearQuery.split(",").map(Number) : [],
        km: kmQuery,
        owner: ownerQuery
      });
    }
  }, [isFilterOpen, budgetQuery, bodyQuery, fuelQuery, gearboxQuery, brandQuery, yearQuery, kmQuery, ownerQuery]);

  // Update URL Search Params helper
  const updateParams = (newParams: Record<string, string | null>) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === "") {
        current.delete(key);
      } else {
        current.set(key, val);
      }
    });
    router.replace(`${pathname}?${current.toString()}`);
  };

  const handleSearchChange = (val: string) => {
    updateParams({ search: val || null });
  };

  const handleSortSelect = (val: string) => {
    updateParams({ sort: val });
    setIsSortOpen(false);
    setIsDesktopSortOpen(false);
  };

  // Filter evaluation logic
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // 1. Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.make.toLowerCase().includes(q) ||
          c.model.toLowerCase().includes(q) ||
          c.variant.toLowerCase().includes(q)
      );
    }

    // 2. Budget
    if (budgetQuery) {
      if (budgetQuery === "u3") {
        result = result.filter((c) => c.price < 300000);
      } else if (budgetQuery === "3-5") {
        result = result.filter((c) => c.price >= 300000 && c.price <= 500000);
      } else if (budgetQuery === "5-8") {
        result = result.filter((c) => c.price > 500000 && c.price <= 800000);
      } else if (budgetQuery === "8p") {
        result = result.filter((c) => c.price > 800000);
      }
    }

    // 3. Body Type
    if (bodyQuery) {
      result = result.filter((c) => c.bodyType.toLowerCase() === bodyQuery.toLowerCase());
    }

    // 4. Fuel
    if (fuelQuery) {
      result = result.filter((c) => c.fuel.toLowerCase() === fuelQuery.toLowerCase());
    }

    // 5. Gearbox
    if (gearboxQuery) {
      result = result.filter((c) => c.transmission.toLowerCase() === gearboxQuery.toLowerCase());
    }

    // 6. Brand (multi-select)
    if (brandQuery) {
      const selectedBrands = brandQuery.split(",");
      result = result.filter((c) => selectedBrands.includes(c.make));
    }

    // 7. Year (multi-select)
    if (yearQuery) {
      const selectedYears = yearQuery.split(",").map(Number);
      result = result.filter((c) => selectedYears.includes(c.year));
    }

    // 8. KM Driven
    if (kmQuery) {
      if (kmQuery === "u60") {
        result = result.filter((c) => c.km < 60000);
      } else if (kmQuery === "60-80") {
        result = result.filter((c) => c.km >= 60000 && c.km <= 80000);
      } else if (kmQuery === "80-100") {
        result = result.filter((c) => c.km > 80000 && c.km <= 100000);
      } else if (kmQuery === "100p") {
        result = result.filter((c) => c.km > 100000);
      }
    }

    // 9. Owner
    if (ownerQuery) {
      result = result.filter((c) => c.owner.toLowerCase() === ownerQuery.toLowerCase());
    }

    // 10. Sorting
    if (sortQuery === "price-asc") {
      result.sort((a, b) => a.price - b.price);
    } else if (sortQuery === "price-desc") {
      result.sort((a, b) => b.price - a.price);
    } else if (sortQuery === "km-asc") {
      result.sort((a, b) => a.km - b.km);
    } else if (sortQuery === "year-desc") {
      result.sort((a, b) => b.year - a.year);
    }

    return result;
  }, [searchQuery, budgetQuery, bodyQuery, fuelQuery, gearboxQuery, brandQuery, yearQuery, kmQuery, ownerQuery, sortQuery]);

  // Derived filter count for show button & bottom badge
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (budgetQuery) count++;
    if (bodyQuery) count++;
    if (fuelQuery) count++;
    if (gearboxQuery) count++;
    if (brandQuery) count += brandQuery.split(",").length;
    if (yearQuery) count += yearQuery.split(",").length;
    if (kmQuery) count++;
    if (ownerQuery) count++;
    return count;
  }, [budgetQuery, bodyQuery, fuelQuery, gearboxQuery, brandQuery, yearQuery, kmQuery, ownerQuery]);

  // Arrived from quiz? (Quiz params are budget, body, fuel, gearbox)
  const isFromQuiz = useMemo(() => {
    return !!(budgetQuery || bodyQuery || fuelQuery || gearboxQuery);
  }, [budgetQuery, bodyQuery, fuelQuery, gearboxQuery]);

  // Applied filter items for chips row
  const filterChips = useMemo(() => {
    const chips: { key: string; label: string; param: string; isMulti?: boolean; value?: string | number }[] = [];
    if (budgetQuery) {
      let label = "Budget: ";
      if (budgetQuery === "u3") label += "Under ₹3L";
      if (budgetQuery === "3-5") label += "₹3L - 5L";
      if (budgetQuery === "5-8") label += "₹5L - 8L";
      if (budgetQuery === "8p") label += "₹8L+";
      chips.push({ key: "budget", label, param: "budget" });
    }
    if (bodyQuery) {
      chips.push({ key: "body", label: `Body: ${bodyQuery.toUpperCase()}`, param: "body" });
    }
    if (fuelQuery) {
      chips.push({ key: "fuel", label: `Fuel: ${fuelQuery.toUpperCase()}`, param: "fuel" });
    }
    if (gearboxQuery) {
      chips.push({ key: "gearbox", label: `Gearbox: ${gearboxQuery.toUpperCase()}`, param: "gearbox" });
    }
    if (brandQuery) {
      brandQuery.split(",").forEach((b) => {
        chips.push({ key: `brand-${b}`, label: b, param: "brand", isMulti: true, value: b });
      });
    }
    if (yearQuery) {
      yearQuery.split(",").forEach((y) => {
        chips.push({ key: `year-${y}`, label: `Year: ${y}`, param: "year", isMulti: true, value: Number(y) });
      });
    }
    if (kmQuery) {
      let label = "Kms: ";
      if (kmQuery === "u60") label += "Under 60K km";
      if (kmQuery === "60-80") label += "60K - 80K km";
      if (kmQuery === "80-100") label += "80K - 100K km";
      if (kmQuery === "100p") label += "100K+ km";
      chips.push({ key: "km", label, param: "km" });
    }
    if (ownerQuery) {
      chips.push({ key: "owner", label: `${ownerQuery.toUpperCase()} Owner`, param: "owner" });
    }
    return chips;
  }, [budgetQuery, bodyQuery, fuelQuery, gearboxQuery, brandQuery, yearQuery, kmQuery, ownerQuery]);

  const removeChip = (chip: typeof filterChips[0]) => {
    if (chip.isMulti) {
      const currentVal = (searchParams.get(chip.param) || "").split(",");
      const newVal = currentVal.filter((v) => v !== String(chip.value)).join(",");
      updateParams({ [chip.param]: newVal || null });
    } else {
      updateParams({ [chip.param]: null });
    }
  };

  const clearAllFilters = () => {
    updateParams({
      budget: null,
      body: null,
      fuel: null,
      gearbox: null,
      brand: null,
      year: null,
      km: null,
      owner: null
    });
    setIsFilterOpen(false);
  };

  // Live count for mobile filter apply button
  const mobileSheetFilteredCount = useMemo(() => {
    let result = [...cars];
    const { budget, body, fuel, gearbox, brands, years, km, owner } = localFilters;

    if (budget) {
      if (budget === "u3") result = result.filter((c) => c.price < 300000);
      else if (budget === "3-5") result = result.filter((c) => c.price >= 300000 && c.price <= 500000);
      else if (budget === "5-8") result = result.filter((c) => c.price > 500000 && c.price <= 800000);
      else if (budget === "8p") result = result.filter((c) => c.price > 800000);
    }
    if (body) result = result.filter((c) => c.bodyType.toLowerCase() === body.toLowerCase());
    if (fuel) result = result.filter((c) => c.fuel.toLowerCase() === fuel.toLowerCase());
    if (gearbox) result = result.filter((c) => c.transmission.toLowerCase() === gearbox.toLowerCase());
    if (brands.length > 0) result = result.filter((c) => brands.includes(c.make));
    if (years.length > 0) result = result.filter((c) => years.includes(c.year));
    if (km) {
      if (km === "u60") result = result.filter((c) => c.km < 60000);
      else if (km === "60-80") result = result.filter((c) => c.km >= 60000 && c.km <= 80000);
      else if (km === "80-100") result = result.filter((c) => c.km > 80000 && c.km <= 100000);
      else if (km === "100p") result = result.filter((c) => c.km > 100000);
    }
    if (owner) result = result.filter((c) => c.owner.toLowerCase() === owner.toLowerCase());

    return result.length;
  }, [localFilters, isFilterOpen]);

  const applyMobileFilters = () => {
    updateParams({
      budget: localFilters.budget || null,
      body: localFilters.body || null,
      fuel: localFilters.fuel || null,
      gearbox: localFilters.gearbox || null,
      brand: localFilters.brands.join(",") || null,
      year: localFilters.years.join(",") || null,
      km: localFilters.km || null,
      owner: localFilters.owner || null
    });
    setIsFilterOpen(false);
  };

  const handleLocalCheckboxToggle = (category: "brands" | "years", value: any) => {
    setLocalFilters((prev) => {
      const list = [...(prev[category] as any[])];
      const index = list.indexOf(value);
      if (index > -1) {
        list.splice(index, 1);
      } else {
        list.push(value);
      }
      return { ...prev, [category]: list };
    });
  };

  // Synchronous change for desktop sidebar
  const handleDesktopToggle = (category: string, value: any, isMulti = false) => {
    if (isMulti) {
      const currentList = searchParams.get(category) ? searchParams.get(category)!.split(",") : [];
      const valStr = String(value);
      let newList: string[];
      if (currentList.includes(valStr)) {
        newList = currentList.filter((v) => v !== valStr);
      } else {
        newList = [...currentList, valStr];
      }
      updateParams({ [category]: newList.join(",") || null });
    } else {
      const current = searchParams.get(category);
      if (current === value) {
        updateParams({ [category]: null }); // toggle off
      } else {
        updateParams({ [category]: value });
      }
    }
  };

  return (
    <div className="min-h-screen bg-cream text-ink pb-24">
      {/* Sticky Header with Search */}
      <header className="bg-purple-deep text-cream sticky top-0 z-30 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
          {/* Top Navbar Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/" className="p-1 hover:text-brass transition-colors">
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <span className="font-display text-xl tracking-tighter">PANCHAL CARS</span>
            </div>
            <Link href="/reviews" className="p-2 hover:text-brass transition-colors">
              <Heart className="w-6 h-6 fill-current text-star-yellow" />
            </Link>
          </div>

          {/* Search bar inside header */}
          <div className="relative w-full">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="w-5 h-5 text-gray-muted" />
            </span>
            <input
              type="text"
              placeholder="Search by model, brand, or variant..."
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white text-ink placeholder-gray-muted rounded-full focus:outline-none focus:ring-2 focus:ring-violet border-none font-body text-sm shadow-inner"
            />
          </div>
        </div>
      </header>

      {/* Main Content Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* DESKTOP SIDEBAR FILTERS (lg:col-span-3, visible on desktop) */}
        <aside className="hidden lg:block lg:col-span-3 space-y-6 bg-white p-6 rounded-[24px] shadow-sm self-start">
          <div className="flex justify-between items-center pb-4 border-b border-gray-pill">
            <h3 className="font-display text-xl tracking-wider">FILTERS</h3>
            {activeFiltersCount > 0 && (
              <button
                onClick={clearAllFilters}
                className="font-display text-xs text-brass hover:text-purple-deep transition-colors tracking-widest uppercase underline"
              >
                CLEAR ALL
              </button>
            )}
          </div>

          {/* Budget filter category */}
          <div className="space-y-2">
            <span className="font-display text-sm tracking-wider text-gray-muted block">BUDGET</span>
            <div className="flex flex-col gap-2">
              {[
                { label: "UNDER ₹3 LAKH", value: "u3" },
                { label: "₹3 – 5 LAKH", value: "3-5" },
                { label: "₹5 – 8 LAKH", value: "5-8" },
                { label: "₹8 LAKH +", value: "8p" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleDesktopToggle("budget", opt.value)}
                  className={`w-full py-2 px-3 rounded-full text-left font-display text-xs tracking-wider transition-colors ${
                    budgetQuery === opt.value
                      ? "bg-violet text-white"
                      : "bg-gray-pill text-ink hover:bg-gray-muted/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Brand filter category */}
          <div className="space-y-2 pt-2 border-t border-gray-pill">
            <span className="font-display text-sm tracking-wider text-gray-muted block">BRAND</span>
            <div className="space-y-1">
              {BRANDS.map((brand) => {
                const isChecked = (brandQuery ? brandQuery.split(",") : []).includes(brand);
                return (
                  <label key={brand} className="flex items-center gap-3 font-body text-sm py-1.5 cursor-pointer hover:text-violet transition-colors">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleDesktopToggle("brand", brand, true)}
                      className="rounded text-violet focus:ring-violet border-gray-muted w-4 h-4"
                    />
                    <span>{brand}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Body type category */}
          <div className="space-y-2 pt-2 border-t border-gray-pill">
            <span className="font-display text-sm tracking-wider text-gray-muted block">BODY TYPE</span>
            <div className="grid grid-cols-2 gap-2">
              {BODIES.map((body) => (
                <button
                  key={body}
                  onClick={() => handleDesktopToggle("body", body.toLowerCase())}
                  className={`py-2 px-3 rounded-full text-center font-display text-[10px] tracking-wider transition-colors ${
                    bodyQuery === body.toLowerCase()
                      ? "bg-violet text-white"
                      : "bg-gray-pill text-ink hover:bg-gray-muted/20"
                  }`}
                >
                  {body}
                </button>
              ))}
            </div>
          </div>

          {/* Fuel category */}
          <div className="space-y-2 pt-2 border-t border-gray-pill">
            <span className="font-display text-sm tracking-wider text-gray-muted block">FUEL</span>
            <div className="grid grid-cols-2 gap-2">
              {FUELS.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => handleDesktopToggle("fuel", fuel.toLowerCase())}
                  className={`py-2 px-3 rounded-full text-center font-display text-[10px] tracking-wider transition-colors ${
                    fuelQuery === fuel.toLowerCase()
                      ? "bg-violet text-white"
                      : "bg-gray-pill text-ink hover:bg-gray-muted/20"
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>

          {/* Transmission category */}
          <div className="space-y-2 pt-2 border-t border-gray-pill">
            <span className="font-display text-sm tracking-wider text-gray-muted block">GEARBOX</span>
            <div className="flex gap-2">
              {GEARBOXES.map((gearbox) => (
                <button
                  key={gearbox}
                  onClick={() => handleDesktopToggle("gearbox", gearbox.toLowerCase())}
                  className={`flex-1 py-2 px-3 rounded-full text-center font-display text-xs tracking-wider transition-colors ${
                    gearboxQuery === gearbox.toLowerCase()
                      ? "bg-violet text-white"
                      : "bg-gray-pill text-ink hover:bg-gray-muted/20"
                  }`}
                >
                  {gearbox}
                </button>
              ))}
            </div>
          </div>

          {/* KM Driven category */}
          <div className="space-y-2 pt-2 border-t border-gray-pill">
            <span className="font-display text-sm tracking-wider text-gray-muted block">KMS DRIVEN</span>
            <div className="flex flex-col gap-2">
              {[
                { label: "Under 60K km", value: "u60" },
                { label: "60K - 80K km", value: "60-80" },
                { label: "80K - 100K km", value: "80-100" },
                { label: "100K+ km", value: "100p" }
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleDesktopToggle("km", opt.value)}
                  className={`w-full py-2 px-3 rounded-full text-left font-display text-xs tracking-wider transition-colors ${
                    kmQuery === opt.value
                      ? "bg-violet text-white"
                      : "bg-gray-pill text-ink hover:bg-gray-muted/20"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Year category */}
          <div className="space-y-2 pt-2 border-t border-gray-pill">
            <span className="font-display text-sm tracking-wider text-gray-muted block">YEAR</span>
            <div className="grid grid-cols-3 gap-1.5">
              {YEARS.map((year) => {
                const isChecked = (yearQuery ? yearQuery.split(",").map(Number) : []).includes(year);
                return (
                  <button
                    key={year}
                    onClick={() => handleDesktopToggle("year", year, true)}
                    className={`py-2 rounded-full text-center font-display text-xs tracking-wider transition-colors ${
                      isChecked
                        ? "bg-violet text-white"
                        : "bg-gray-pill text-ink hover:bg-gray-muted/20"
                    }`}
                  >
                    {year}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Owner category */}
          <div className="space-y-2 pt-2 border-t border-gray-pill">
            <span className="font-display text-sm tracking-wider text-gray-muted block">OWNER</span>
            <div className="flex gap-2">
              {OWNERS.map((owner) => (
                <button
                  key={owner}
                  onClick={() => handleDesktopToggle("owner", owner.toLowerCase())}
                  className={`flex-1 py-2 px-3 rounded-full text-center font-display text-xs tracking-wider transition-colors ${
                    ownerQuery === owner.toLowerCase()
                      ? "bg-violet text-white"
                      : "bg-gray-pill text-ink hover:bg-gray-muted/20"
                  }`}
                >
                  {owner} Owner
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* LISTINGS DISPLAY (lg:col-span-9, full on mobile) */}
        <main className="lg:col-span-9 space-y-6">
          
          {/* Result count & Header row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="font-display text-2xl sm:text-3xl tracking-tight">
                  {filteredCars.length} CARS MATCH
                </h2>
                {isFromQuiz && (
                  <span className="font-body text-xs text-gray-muted">
                    Based on your answers
                  </span>
                )}
              </div>
              {isFromQuiz && (
                <Link
                  href="/dream-car/quiz"
                  className="font-display text-xs text-brass hover:text-purple-deep hover:underline tracking-widest uppercase"
                >
                  EDIT ANSWERS &rarr;
                </Link>
              )}
            </div>

            {/* Desktop Sort Dropdown */}
            <div className="hidden lg:block relative">
              <button
                onClick={() => setIsDesktopSortOpen(!isDesktopSortOpen)}
                className="inline-flex items-center justify-between gap-3 px-4 py-2.5 bg-white rounded-full text-sm font-display tracking-wider border-none shadow-sm hover:bg-gray-pill min-w-[200px]"
              >
                <span>SORT: {SORT_OPTIONS.find((o) => o.value === sortQuery)?.label}</span>
                <ChevronDown className="w-4 h-4 text-brass" />
              </button>

              {isDesktopSortOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl ring-1 ring-black/5 z-20 overflow-hidden py-1 border border-gray-pill">
                  {SORT_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSortSelect(opt.value)}
                      className={`w-full px-4 py-2.5 text-left font-display text-xs tracking-wider flex items-center justify-between transition-colors ${
                        sortQuery === opt.value
                          ? "bg-violet/10 text-violet"
                          : "text-ink hover:bg-gray-pill"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {sortQuery === opt.value && (
                        <Check className="w-4 h-4 text-violet" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Applied Filter Chips Row */}
          {filterChips.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              {filterChips.map((chip) => (
                <button
                  key={chip.key}
                  onClick={() => removeChip(chip)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-violet text-white font-display text-xs tracking-wider btn-scale"
                >
                  <span>{chip.label}</span>
                  <X className="w-3.5 h-3.5" />
                </button>
              ))}
              <button
                onClick={() => {
                  if (window.innerWidth < 1025) {
                    setIsFilterOpen(true);
                  } else {
                    clearAllFilters();
                  }
                }}
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-gray-pill text-ink font-display text-xs tracking-wider border border-gray-muted/20"
              >
                <span>+ ADD FILTER</span>
              </button>
            </div>
          )}

          {/* Cars Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCars.map((car) => {
                const isLiked = likedCars.includes(car.id);
                // Format price in Indian grouping format
                const formattedPrice = new Intl.NumberFormat("en-IN").format(car.price);
                const formattedKm = new Intl.NumberFormat("en-IN").format(car.km);

                return (
                  <Link
                    href={`/cars/${car.slug}`}
                    prefetch={false}
                    key={car.id}
                    className="group bg-white rounded-[24px] overflow-hidden flex flex-col justify-between hover:-translate-y-1 transition-transform duration-200"
                  >
                    {/* Thumbnail & Like block */}
                    <div className="relative aspect-video w-full">
                      <Image
                        src={`/cars/thumbs/${car.id}.webp`}
                        alt={`${car.year} ${car.make} ${car.model}, ${car.colour}`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
                        className="object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <button
                        onClick={(e) => toggleLike(car.id, e)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-muted hover:text-red-500 transition-colors z-10"
                        aria-label="Favorite car"
                      >
                        <Heart
                          className={`w-5 h-5 transition-all ${
                            isLiked ? "fill-red-500 text-red-500 scale-110" : "fill-none"
                          }`}
                        />
                      </button>
                    </div>

                    {/* Car Info Details */}
                    <div className="p-5 flex-grow flex flex-col justify-between gap-3">
                      <div className="space-y-1">
                        <h3 className="font-display text-lg tracking-wider leading-tight group-hover:text-violet transition-colors">
                          {car.year} {car.make} {car.model}
                        </h3>
                        <p className="font-display text-2xl text-violet leading-none">
                          ₹{formattedPrice}
                        </p>
                      </div>

                      {/* Info Pills */}
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-full bg-gray-pill text-ink font-body text-[10px] sm:text-xs font-medium tracking-wide">
                          {car.fuel.toUpperCase()}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-gray-pill text-ink font-body text-[10px] sm:text-xs font-medium tracking-wide">
                          {car.transmission.toUpperCase()}
                        </span>
                        <span className="px-2.5 py-1 rounded-full bg-gray-pill text-ink font-body text-[10px] sm:text-xs font-medium tracking-wide">
                          {formattedKm} KM
                        </span>
                      </div>

                      {/* Small text footer inside card */}
                      <div className="pt-2 border-t border-gray-pill flex justify-between items-center text-xs text-gray-muted font-body">
                        <span>{car.owner} OWNER</span>
                        <span>{car.regCity.toUpperCase()}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center max-w-md mx-auto space-y-6">
              <div className="space-y-2">
                <h3 className="font-display text-3xl tracking-wide uppercase">NO CARS MATCH</h3>
                <p className="font-body text-sm text-gray-muted">
                  Try removing a filter, or tell us what you're looking for. We can source the car for you!
                </p>
              </div>

              <div className="flex flex-col gap-3 pt-2">
                {activeFiltersCount > 0 && (
                  <button
                    onClick={clearAllFilters}
                    className="w-full py-3 rounded-full bg-violet text-white font-display text-base tracking-wider hover:bg-opacity-95 transition-transform btn-scale"
                  >
                    CLEAR ALL FILTERS
                  </button>
                )}
                <a
                  href={getGeneralWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-full bg-whatsapp text-white font-display text-base tracking-wider hover:bg-opacity-95 transition-transform btn-scale"
                >
                  WHATSAPP US
                </a>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Sticky Bottom Actions Bar (Mobile Only) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-purple-ink h-16 border-t border-purple-night flex items-center justify-between text-cream shadow-xl">
        <button
          onClick={() => setIsSortOpen(true)}
          className="flex-1 h-full font-display text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-purple-night/30"
        >
          <ArrowUpDown className="w-4 h-4 text-brass" />
          SORT
        </button>

        <span className="h-6 w-[1px] bg-brass/40" />

        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex-1 h-full font-display text-sm tracking-widest flex items-center justify-center gap-2 hover:bg-purple-night/30 relative"
        >
          <SlidersHorizontal className="w-4 h-4 text-brass" />
          FILTER
          {activeFiltersCount > 0 && (
            <span className="absolute top-2.5 right-6 w-5 h-5 rounded-full bg-violet text-white text-[10px] font-bold flex items-center justify-center">
              {activeFiltersCount}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Sort Sheet (Bottom Drawer) */}
      {isSortOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-end justify-center">
          <div
            className="absolute inset-0"
            onClick={() => setIsSortOpen(false)}
          />
          <div className="relative w-full max-w-md bg-white rounded-t-[24px] p-6 space-y-6 z-10 animate-slide-up">
            {/* Drag Handle aesthetic */}
            <div className="w-12 h-1 bg-gray-pill rounded-full mx-auto" />

            <div className="flex justify-between items-center pb-2">
              <h3 className="font-display text-xl tracking-wider">SORT BY</h3>
              <button
                onClick={() => setIsSortOpen(false)}
                className="p-1 text-gray-muted hover:text-ink"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-1">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleSortSelect(opt.value)}
                  className={`w-full py-3 px-2 flex items-center justify-between text-left font-display text-sm tracking-wider transition-colors ${
                    sortQuery === opt.value ? "text-violet" : "text-ink"
                  }`}
                >
                  <span>{opt.label}</span>
                  <div
                    className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                      sortQuery === opt.value
                        ? "border-violet bg-violet text-white"
                        : "border-gray-muted"
                    }`}
                  >
                    {sortQuery === opt.value && <Check className="w-3 h-3" />}
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setIsSortOpen(false)}
              className="w-full py-3.5 rounded-full bg-violet text-white font-display text-base tracking-wider hover:bg-opacity-95 btn-scale"
            >
              SHOW {filteredCars.length} CARS
            </button>
          </div>
        </div>
      )}

      {/* Mobile Fullscreen Filter Sheet */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-cream flex flex-col justify-between overflow-hidden">
          {/* Header */}
          <div className="bg-purple-deep text-cream px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFilterOpen(false)}
                className="p-1 hover:text-brass transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
              <span className="font-display text-lg tracking-wider">FILTERS</span>
            </div>
            <button
              onClick={clearAllFilters}
              className="font-display text-xs text-brass hover:text-cream transition-colors tracking-widest uppercase underline"
            >
              CLEAR ALL
            </button>
          </div>

          {/* Split Filter pane: left category list, right values page */}
          <div className="flex-grow flex overflow-hidden">
            {/* Left Rail */}
            <div className="w-[110px] sm:w-[130px] bg-gray-pill flex flex-col overflow-y-auto border-r border-gray-muted/10">
              {[
                "PRICE",
                "BRAND",
                "YEAR",
                "KM DRIVEN",
                "FUEL",
                "BODY TYPE",
                "GEARBOX",
                "OWNER"
              ].map((tab) => {
                const isActive = activeFilterTab === tab;
                // Check if this tab has active configurations
                let hasDot = false;
                if (tab === "PRICE" && localFilters.budget) hasDot = true;
                if (tab === "BRAND" && localFilters.brands.length > 0) hasDot = true;
                if (tab === "YEAR" && localFilters.years.length > 0) hasDot = true;
                if (tab === "KM DRIVEN" && localFilters.km) hasDot = true;
                if (tab === "FUEL" && localFilters.fuel) hasDot = true;
                if (tab === "BODY TYPE" && localFilters.body) hasDot = true;
                if (tab === "GEARBOX" && localFilters.gearbox) hasDot = true;
                if (tab === "OWNER" && localFilters.owner) hasDot = true;

                return (
                  <button
                    key={tab}
                    onClick={() => setActiveFilterTab(tab)}
                    className={`py-4 px-3 text-left font-display text-[10px] sm:text-xs tracking-wider transition-colors relative ${
                      isActive ? "bg-cream text-violet font-bold" : "text-gray-muted hover:bg-gray-muted/10"
                    }`}
                  >
                    <span>{tab}</span>
                    {hasDot && (
                      <span className="absolute top-4 right-2 w-2 h-2 rounded-full bg-violet" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right Pane */}
            <div className="flex-grow p-6 bg-cream overflow-y-auto">
              {activeFilterTab === "PRICE" && (
                <div className="space-y-4">
                  <h4 className="font-display text-sm tracking-wider text-gray-muted uppercase">BUDGET RANGE</h4>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "UNDER ₹3 LAKH", value: "u3" },
                      { label: "₹3 – 5 LAKH", value: "3-5" },
                      { label: "₹5 – 8 LAKH", value: "5-8" },
                      { label: "₹8 LAKH +", value: "8p" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            budget: prev.budget === opt.value ? "" : opt.value
                          }))
                        }
                        className={`w-full py-3 px-4 rounded-[16px] text-left font-display text-xs tracking-wider transition-colors ${
                          localFilters.budget === opt.value
                            ? "bg-violet text-white"
                            : "bg-white text-ink hover:bg-gray-pill"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterTab === "BRAND" && (
                <div className="space-y-4">
                  <h4 className="font-display text-sm tracking-wider text-gray-muted uppercase">BRANDS</h4>
                  <div className="space-y-2">
                    {BRANDS.map((brand) => {
                      const isChecked = localFilters.brands.includes(brand);
                      return (
                        <label
                          key={brand}
                          className="flex items-center gap-3 font-body text-sm py-2 px-3 bg-white rounded-[16px] cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={() => handleLocalCheckboxToggle("brands", brand)}
                            className="rounded text-violet focus:ring-violet border-gray-muted w-5 h-5"
                          />
                          <span className="font-display tracking-wider text-xs">{brand}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeFilterTab === "YEAR" && (
                <div className="space-y-4">
                  <h4 className="font-display text-sm tracking-wider text-gray-muted uppercase">MANUFACTURE YEAR</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {YEARS.map((year) => {
                      const isChecked = localFilters.years.includes(year);
                      return (
                        <button
                          key={year}
                          onClick={() => handleLocalCheckboxToggle("years", year)}
                          className={`py-3 rounded-[16px] text-center font-display text-xs tracking-wider transition-colors ${
                            isChecked
                              ? "bg-violet text-white"
                              : "bg-white text-ink"
                          }`}
                        >
                          {year}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {activeFilterTab === "KM DRIVEN" && (
                <div className="space-y-4">
                  <h4 className="font-display text-sm tracking-wider text-gray-muted uppercase">KMS DRIVEN</h4>
                  <div className="flex flex-col gap-3">
                    {[
                      { label: "Under 60,000 km", value: "u60" },
                      { label: "60,000 - 80,000 km", value: "60-80" },
                      { label: "80,000 - 100,000 km", value: "80-100" },
                      { label: "Over 100,000 km", value: "100p" }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            km: prev.km === opt.value ? "" : opt.value
                          }))
                        }
                        className={`w-full py-3 px-4 rounded-[16px] text-left font-display text-xs tracking-wider transition-colors ${
                          localFilters.km === opt.value
                            ? "bg-violet text-white"
                            : "bg-white text-ink hover:bg-gray-pill"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterTab === "FUEL" && (
                <div className="space-y-4">
                  <h4 className="font-display text-sm tracking-wider text-gray-muted uppercase">FUEL TYPE</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {FUELS.map((fuel) => (
                      <button
                        key={fuel}
                        onClick={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            fuel: prev.fuel === fuel.toLowerCase() ? "" : fuel.toLowerCase()
                          }))
                        }
                        className={`py-3 rounded-[16px] text-center font-display text-xs tracking-wider transition-colors ${
                          localFilters.fuel === fuel.toLowerCase()
                            ? "bg-violet text-white"
                            : "bg-white text-ink"
                        }`}
                      >
                        {fuel}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterTab === "BODY TYPE" && (
                <div className="space-y-4">
                  <h4 className="font-display text-sm tracking-wider text-gray-muted uppercase">BODY TYPE</h4>
                  <div className="grid grid-cols-2 gap-3">
                    {BODIES.map((body) => (
                      <button
                        key={body}
                        onClick={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            body: prev.body === body.toLowerCase() ? "" : body.toLowerCase()
                          }))
                        }
                        className={`py-3 rounded-[16px] text-center font-display text-xs tracking-wider transition-colors ${
                          localFilters.body === body.toLowerCase()
                            ? "bg-violet text-white"
                            : "bg-white text-ink"
                        }`}
                      >
                        {body}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterTab === "GEARBOX" && (
                <div className="space-y-4">
                  <h4 className="font-display text-sm tracking-wider text-gray-muted uppercase">TRANSMISSION</h4>
                  <div className="flex gap-3">
                    {GEARBOXES.map((gearbox) => (
                      <button
                        key={gearbox}
                        onClick={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            gearbox: prev.gearbox === gearbox.toLowerCase() ? "" : gearbox.toLowerCase()
                          }))
                        }
                        className={`flex-1 py-3 rounded-[16px] text-center font-display text-xs tracking-wider transition-colors ${
                          localFilters.gearbox === gearbox.toLowerCase()
                            ? "bg-violet text-white"
                            : "bg-white text-ink"
                        }`}
                      >
                        {gearbox}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {activeFilterTab === "OWNER" && (
                <div className="space-y-4">
                  <h4 className="font-display text-sm tracking-wider text-gray-muted uppercase">OWNER TYPE</h4>
                  <div className="flex gap-3">
                    {OWNERS.map((owner) => (
                      <button
                        key={owner}
                        onClick={() =>
                          setLocalFilters((prev) => ({
                            ...prev,
                            owner: prev.owner === owner.toLowerCase() ? "" : owner.toLowerCase()
                          }))
                        }
                        className={`flex-1 py-3 rounded-[16px] text-center font-display text-xs tracking-wider transition-colors ${
                          localFilters.owner === owner.toLowerCase()
                            ? "bg-violet text-white"
                            : "bg-white text-ink"
                        }`}
                      >
                        {owner} Owner
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sticky Bottom Actions inside sheet */}
          <div className="bg-white p-4 border-t border-gray-pill flex gap-4">
            <button
              onClick={clearAllFilters}
              className="flex-1 py-3.5 rounded-full bg-gray-pill text-ink font-display text-sm tracking-wider hover:bg-gray-muted/10 btn-scale"
            >
              CLEAR ALL
            </button>
            <button
              onClick={applyMobileFilters}
              className="flex-grow py-3.5 rounded-full bg-violet text-white font-display text-sm tracking-wider hover:bg-opacity-95 btn-scale"
            >
              SHOW {mobileSheetFilteredCount} CARS
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
