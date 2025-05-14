import { useState, useRef, useEffect } from "react";
import { BiChevronDown } from "react-icons/bi";
import { BsExclamationCircleFill, BsStars, BsListTask } from "react-icons/bs";
import styles from "./CustomSelect.module.css";

// Define icons mapping
const icons = {
  // Currency icons
  sapphire: "/images/sapphire.svg",
  crystal: "/images/crystal.svg",
  emerald: "/images/emerald.svg",
  ruby: "/images/ruby.svg",

  // Priority icons
  none: null,
  "Today's focus": <BsStars color="#FFD700" />,
  "High Priority": <BsExclamationCircleFill color="#FF4500" />,
  "Medium Priority": <BsExclamationCircleFill color="#FFA500" />,
  "Low Priority": <BsExclamationCircleFill color="#90EE90" />,
  "Optional/Backlog": <BsListTask color="#a0a0a0" />,
};

interface CustomSelectProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  type: "currency" | "priority"; // Type to determine icon rendering
  className?: string;
}

export default function CustomSelect({
  options,
  value,
  onChange,
  type,
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);

  // Calculate dropdown position when it opens
  useEffect(() => {
    if (isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
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

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
  };

  // Render icon based on type and option
  const renderIcon = (option: string) => {
    if (type === "currency") {
      return (
        <div
          className={styles.gemIcon}
          style={{
            backgroundImage: `url('${icons[option as keyof typeof icons]}')`,
          }}
        ></div>
      );
    } else if (type === "priority") {
      const icon = icons[option as keyof typeof icons];
      return icon ? <span className={styles.priorityIcon}>{icon}</span> : null;
    }
    return null;
  };

  // Format display text for options
  const getDisplayText = (option: string) => {
    return option === "none" && type === "priority" ? "Set priority" : option;
  };

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
          {renderIcon(value)}
          <span>{getDisplayText(value)}</span>
        </div>
        <BiChevronDown
          className={`${styles.chevron} ${isOpen ? styles.rotated : ""}`}
        />
      </div>

      {isOpen && dropdownPosition && (
        <div
          className={styles.optionsContainer}
          style={{
            top: `${dropdownPosition.top}px`,
            left: `${dropdownPosition.left}px`,
            width: `${dropdownRef.current?.offsetWidth}px`,
          }}
        >
          {options.map((option) => (
            <div
              key={option}
              className={`${styles.option} ${
                value === option ? styles.selected : ""
              }`}
              onClick={() => handleSelect(option)}
            >
              {renderIcon(option)}
              <span>{getDisplayText(option)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
