import React, { forwardRef, useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { createPortal } from "react-dom";

export interface SelectOption {
  value: string;
  label: string;
  [key: string]: any;
}

interface BaseSelectProps {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  required?: boolean;
}

// Simple Select Props (native select element)
interface SimpleSelectProps extends BaseSelectProps, Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  searchable?: false;
  value?: string;
  onChange?: (value: string) => void;
}

// Searchable Select Props (custom dropdown)
interface SearchableSelectProps extends BaseSelectProps {
  searchable: true;
  value?: string;
  onChange?: (value: string) => void;
  clearable?: boolean;
  noOptionsMessage?: string;
  usePortal?: boolean;
  renderOption?: (option: SelectOption, isSelected: boolean) => React.ReactNode;
  renderSelectedValue?: (option: SelectOption) => React.ReactNode;
}

type SelectProps = SimpleSelectProps | SearchableSelectProps;

// Simple Select Component (native)
const SimpleSelect = forwardRef<HTMLSelectElement, SimpleSelectProps>(
  ({ label, error, options, placeholder, className = "", required, disabled, value, onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (onChange) {
        onChange(e.target.value);
      }
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <select
          ref={ref}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`
            w-full px-4 py-2 rounded-lg border
            focus:ring-2 focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-100 disabled:cursor-not-allowed
            transition duration-150 ease-in-out
            ${error ? "border-red-500" : "border-gray-300"}
            ${className}
          `}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

SimpleSelect.displayName = "SimpleSelect";

// Searchable Select Component (custom dropdown)
const SearchableSelect: React.FC<SearchableSelectProps> = ({
  label,
  error,
  options,
  placeholder = "Select an option...",
  className = "",
  disabled = false,
  required = false,
  value,
  onChange,
  clearable = true,
  noOptionsMessage = "No options found",
  usePortal = true,
  renderOption,
  renderSelectedValue,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<SelectOption[]>(options);
  const [menuStyle, setMenuStyle] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 0 });

  const dropdownRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || null;

  // Filter options based on search term
  useEffect(() => {
    const searchLower = searchTerm.trim().toLowerCase();
    if (!searchLower) {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter((option) =>
        option.label.toLowerCase().includes(searchLower)
      );
      setFilteredOptions(filtered);
    }
  }, [searchTerm, options]);

  // Update menu position
  const updateMenuPosition = () => {
    const anchor = anchorRef.current;
    if (!anchor) return;

    const rect = anchor.getBoundingClientRect();
    const left = rect.left;
    const width = rect.width;
    let top = rect.bottom;

    const menuHeight = menuRef.current?.offsetHeight || 0;
    const viewportHeight = window.innerHeight;
    const bottomSpace = viewportHeight - rect.bottom;
    const topSpace = rect.top;

    if (menuHeight && bottomSpace < menuHeight && topSpace > menuHeight) {
      top = rect.top - menuHeight;
    }

    setMenuStyle({ top, left, width });
  };

  useEffect(() => {
    if (!isOpen) return;

    updateMenuPosition();
    const timer = setTimeout(() => updateMenuPosition(), 10);

    const onScrollOrResize = () => {
      requestAnimationFrame(() => updateMenuPosition());
    };

    window.addEventListener("scroll", onScrollOrResize, { passive: true, capture: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScrollOrResize, true);
      window.removeEventListener("resize", onScrollOrResize);
      clearTimeout(timer);
    };
  }, [isOpen]);

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedInsideAnchor = dropdownRef.current?.contains(target);
      const clickedInsideMenu = menuRef.current?.contains(target);
      if (!clickedInsideAnchor && !clickedInsideMenu) {
        setIsOpen(false);
        setSearchTerm("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOptionSelect = (option: SelectOption) => {
    if (onChange) {
      onChange(option.value);
    }
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleClearSelection = () => {
    if (onChange) {
      onChange("");
    }
    setSearchTerm("");
  };

  const toggleDropdown = () => {
    if (disabled) return;
    if (isOpen) {
      setIsOpen(false);
      setSearchTerm("");
    } else {
      setIsOpen(true);
      setTimeout(() => {
        updateMenuPosition();
        searchInputRef.current?.focus();
      }, 10);
    }
  };

  const highlightText = (text: string, search: string) => {
    if (!search || !text) return <span>{text}</span>;
    const idx = text.toLowerCase().indexOf(search.toLowerCase());
    if (idx === -1) return <span>{text}</span>;
    const before = text.slice(0, idx);
    const match = text.slice(idx, idx + search.length);
    const after = text.slice(idx + search.length);
    return (
      <span>
        {before}
        <span className="bg-yellow-100 text-yellow-800 font-semibold">{match}</span>
        {after}
      </span>
    );
  };

  const dropdownMenu = (
    <div
      ref={menuRef}
      style={usePortal ? { position: "fixed", top: menuStyle.top, left: menuStyle.left, width: menuStyle.width, zIndex: 1000 } : undefined}
      className={`bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-hidden ${!usePortal ? "absolute left-0 right-0 mt-1 z-50" : ""}`}
    >
      {/* Search input */}
      <div className="p-3 border-b border-gray-200 bg-gray-50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search options..."
            className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>

      {/* Options list */}
      <div className="max-h-48 overflow-y-auto bg-white">
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => {
            const isSelected = selectedOption?.value === option.value;
            return (
              <div
                key={option.value}
                onClick={() => handleOptionSelect(option)}
                className={`flex items-center px-4 py-2 cursor-pointer hover:bg-gray-50 transition-colors ${
                  isSelected ? "bg-blue-50 border-r-2 border-blue-500" : ""
                }`}
              >
                <div className="flex-1 min-w-0">
                  {renderOption ? (
                    renderOption(option, isSelected)
                  ) : (
                    <p className="text-sm font-medium text-gray-900">
                      {highlightText(option.label, searchTerm)}
                    </p>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="px-4 py-6 text-center text-gray-500 text-sm">
            <div className="flex flex-col items-center space-y-2">
              <Search className="w-8 h-8 text-gray-300" />
              <p>{noOptionsMessage}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className={`w-full ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Selected option display or search trigger */}
        {selectedOption ? (
          <div
            ref={anchorRef}
            className={`
              flex items-center justify-between w-full px-4 py-2
              border rounded-lg bg-white cursor-pointer
              hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              ${error ? "border-red-500" : "border-gray-300"}
              ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            `}
            onClick={toggleDropdown}
            tabIndex={disabled ? -1 : 0}
          >
            <div className="flex items-center flex-1 min-w-0">
              {renderSelectedValue ? (
                renderSelectedValue(selectedOption)
              ) : (
                <p className="text-sm font-medium text-gray-900 truncate">
                  {selectedOption.label}
                </p>
              )}
            </div>
            <div className="flex items-center space-x-1 ml-2">
              {!disabled && clearable && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClearSelection();
                  }}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <ChevronDown
                className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
              />
            </div>
          </div>
        ) : (
          <div
            ref={anchorRef}
            className={`
              flex items-center w-full px-4 py-2
              border rounded-lg bg-white cursor-pointer
              hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors
              ${error ? "border-red-500" : "border-gray-300"}
              ${disabled ? "bg-gray-100 cursor-not-allowed" : ""}
            `}
            onClick={toggleDropdown}
            tabIndex={disabled ? -1 : 0}
          >
            <Search className="w-4 h-4 text-gray-400 mr-3" />
            <span className="text-sm text-gray-500 flex-1 truncate">{placeholder}</span>
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
            />
          </div>
        )}

        {/* Dropdown menu: portal or inline */}
        {isOpen && !disabled && (usePortal ? createPortal(dropdownMenu, document.body) : dropdownMenu)}
      </div>

      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

SearchableSelect.displayName = "SearchableSelect";

// Main Select component that switches between simple and searchable
export const Select = forwardRef<HTMLSelectElement, SelectProps>((props, ref) => {
  if ('searchable' in props && props.searchable) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { searchable, ...searchableProps } = props;
    return <SearchableSelect {...(searchableProps as SearchableSelectProps)} />;
  }

  return <SimpleSelect ref={ref} {...(props as SimpleSelectProps)} />;
});

Select.displayName = "Select";
