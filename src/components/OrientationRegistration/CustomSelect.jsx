import React, { useState, useEffect, useRef, useCallback } from "react";
import { ChevronDown, Check } from "lucide-react";
import gsap from "gsap";

export default function CustomSelect({
  label,
  name,
  value,
  options,
  placeholder,
  onChange,
  onFocus,
  onBlur,
  error,
  icon: Icon
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const menuRef = useRef(null);
  const itemsRef = useRef([]);

  const closeDropdown = useCallback(() => {
    if (menuRef.current) {
      gsap.to(menuRef.current, {
        opacity: 0,
        y: -4,
        scale: 0.98,
        duration: 0.15,
        ease: "power2.in",
        onComplete: () => {
          setIsOpen(false);
          if (onBlur) onBlur();
        }
      });
    } else {
      setIsOpen(false);
      if (onBlur) onBlur();
    }
  }, [onBlur]);

  // Close dropdown menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        closeDropdown();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [closeDropdown]);

  const openDropdown = () => {
    setIsOpen(true);
    if (onFocus) onFocus();

    // Animate menu in
    requestAnimationFrame(() => {
      if (menuRef.current) {
        gsap.fromTo(
          menuRef.current,
          { opacity: 0, y: -8, scale: 0.97 },
          { opacity: 1, y: 0, scale: 1, duration: 0.25, ease: "power3.out" }
        );
      }

      // Stagger items
      const items = itemsRef.current.filter(Boolean);
      if (items.length > 0) {
        gsap.fromTo(
          items,
          { opacity: 0, x: -6 },
          { opacity: 1, x: 0, duration: 0.2, stagger: 0.015, ease: "power2.out", delay: 0.08 }
        );
      }
    });
  };

  const handleSelect = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    closeDropdown();
  };

  const handleToggle = () => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
          {Icon && <Icon className="w-3.5 h-3.5 text-indigo-500" />} {label} <span className="text-rose-400">*</span>
        </label>
      )}

      {/* Trigger Button */}
      <button
        type="button"
        onClick={handleToggle}
        className={`w-full py-2.5 px-3.5 rounded-xl border text-left text-base sm:text-sm flex items-center justify-between cursor-pointer select-trigger ${
          value ? "text-slate-800 font-medium" : "text-slate-400"
        } ${
          error
            ? "border-rose-300 bg-rose-50/40"
            : isOpen
            ? "border-indigo-400 ring-2 ring-indigo-100 bg-white shadow-sm"
            : "border-slate-200 bg-slate-50/80"
        }`}
      >
        <span className="truncate pr-2">{value || placeholder}</span>
        <ChevronDown
          className={`w-4 h-4 shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-indigo-500" : "text-slate-400"
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={menuRef}
          className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/60 py-1 max-h-60 overflow-y-auto dropdown-scroll"
        >
          {options.map((opt, index) => {
            const isSelected = value === opt;
            return (
              <button
                key={opt}
                ref={(el) => (itemsRef.current[index] = el)}
                type="button"
                onClick={() => handleSelect(opt)}
                className={`w-full px-3.5 py-2.5 text-left text-xs sm:text-sm flex items-center justify-between cursor-pointer transition-colors duration-150 ${
                  isSelected
                    ? "bg-indigo-50 text-indigo-700 font-semibold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span className="truncate pr-2">{opt}</span>
                {isSelected && (
                  <div className="w-4.5 h-4.5 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}

      {error && <p className="mt-1 text-[11px] text-rose-500 font-medium">{error}</p>}
    </div>
  );
}
