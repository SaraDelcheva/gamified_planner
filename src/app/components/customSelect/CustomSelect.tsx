import { useState, useRef, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import styles from "./CustomSelect.module.css";

interface Option {
  value: string;
  label: string;
  icon?: React.ReactNode;
  iconPosition?: "left" | "right";
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select option",
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);
  const displayText = selectedOption?.label || placeholder;
  const displayIcon = selectedOption?.icon;
  const iconPosition = selectedOption?.iconPosition || "left";

  return (
    <div
      className={`${styles.customSelect} ${className || ""}`}
      ref={dropdownRef}
    >
      <div
        className={`${styles.selectHeader} ${isOpen ? styles.active : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className={styles.selectedOption}>
          {displayIcon && iconPosition === "left" && (
            <span className={styles.optionIcon}>{displayIcon}</span>
          )}
          <span>{displayText}</span>
          {displayIcon && iconPosition === "right" && (
            <span className={styles.optionIcon}>{displayIcon}</span>
          )}
        </div>
        <BiChevronDown
          className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      {isOpen && (
        <div className={styles.optionsContainer}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${
                value === option.value ? styles.selected : ""
              }`}
              onClick={() => handleSelect(option.value)}
            >
              {option.icon && (option.iconPosition || "left") === "left" && (
                <span className={styles.optionIcon}>{option.icon}</span>
              )}
              <span>{option.label}</span>
              {option.icon && (option.iconPosition || "left") === "right" && (
                <span className={styles.optionIcon}>{option.icon}</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
