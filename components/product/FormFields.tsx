// components/product/FormFields.tsx
"use client";

import { motion } from "framer-motion";
import { FormField, FormFieldOption } from "./ProductFormTypes";
import { Check, ChevronDown } from "lucide-react";

interface FormFieldProps {
  field: FormField;
  value: any;
  onChange: (value: any) => void;
  disabled?: boolean;
}

export function SelectField({
  field,
  value,
  onChange,
  disabled,
}: FormFieldProps) {
  const options =
    field.grouped && field.groups
      ? Object.values(field.groups).flat()
      : field.options || [];

  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-foreground">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>

      {field.grouped && field.groups ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select {field.label}</option>
          {Object.entries(field.groups).map(([groupLabel, groupOptions]) => (
            <optgroup key={groupLabel} label={groupLabel}>
              {groupOptions.map((option, optIndex) => (
                <option
                  key={`${groupLabel}-${option.value}-${optIndex}`}
                  value={option.value}
                  disabled={option.disabled}
                >
                  {option.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      ) : (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className="w-full px-3 py-2 text-sm rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="">Select {field.label}</option>
          {options.map((option, index) => (
            <option
              key={`${option.value}-${index}`}
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

export function RadioField({
  field,
  value,
  onChange,
  disabled,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-foreground">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-1.5">
        {field.options?.map((option, index) => (
          <motion.button
            key={`${field.key}-${option.value}-${index}`}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange(option.value)}
            disabled={disabled || option.disabled}
            className={`px-2 py-1.5 rounded-md border text-xs font-bold text-center transition-all ${
              value === option.value
                ? "border-primary bg-primary/10 text-primary"
                : "border-border hover:border-primary/50"
            } ${disabled || option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {option.label}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function RadioVisualField({
  field,
  value,
  onChange,
  disabled,
}: FormFieldProps) {
  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-foreground">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="grid grid-cols-6 sm:grid-cols-8 gap-1.5">
        {field.options?.map((option, index) => (
          <motion.button
            key={`${field.key}-${option.value}-${index}`}
            whileTap={{ scale: 0.95 }}
            onClick={() => onChange(option.value)}
            disabled={disabled || option.disabled}
            className={`relative p-1.5 rounded-md border transition-all ${
              value === option.value
                ? "border-primary ring-1 ring-primary/30"
                : "border-border hover:border-primary/50"
            } ${disabled || option.disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            title={option.label}
          >
            <div
              className="w-full h-6 rounded"
              style={{ backgroundColor: option.hexColor || "#ccc" }}
            />
            <div className="text-xs font-bold text-center mt-0.5 truncate">
              {option.label}
            </div>
            {value === option.value && (
              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-primary rounded-full flex items-center justify-center">
                <Check className="h-2 w-2 text-primary-foreground" />
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export function CheckboxField({
  field,
  value = [],
  onChange,
  disabled,
}: FormFieldProps) {
  const handleChange = (optionValue: string, checked: boolean) => {
    if (checked) {
      onChange([...value, optionValue]);
    } else {
      onChange(value.filter((v: string) => v !== optionValue));
    }
  };

  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-foreground">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {field.options?.map((option, index) => {
          const isChecked = value.includes(option.value);
          return (
            <label
              key={`${field.key}-${option.value}-${index}`}
              className={`flex items-center space-x-2 px-2 py-1.5 rounded-md border cursor-pointer transition-all text-xs ${
                isChecked
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              }`}
            >
              <input
                type="checkbox"
                checked={isChecked}
                onChange={(e) => handleChange(option.value, e.target.checked)}
                disabled={disabled || option.disabled}
                className="w-3.5 h-3.5 text-primary rounded border-border focus:ring-primary"
              />
              <span className="font-bold truncate">{option.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function MultiSelectField({
  field,
  value = {},
  onChange,
  disabled,
}: FormFieldProps) {
  const genderStyle = field.affectsField ? value[field.affectsField] : null;
  const options =
    genderStyle && field.dynamicOptions
      ? field.dynamicOptions[genderStyle] || []
      : field.options || [];

  const handleSizeQuantityChange = (sizeValue: string, quantity: number) => {
    onChange({
      ...value,
      [field.key]: {
        ...(value[field.key] || {}),
        [sizeValue]: quantity,
      },
    });
  };

  return (
    <div className="space-y-1">
      <label className="block text-xs font-bold text-foreground">
        {field.label}
        {field.required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
        {options.map((option, index) => {
          const sizeQuantities = value[field.key] || {};
          const quantity = sizeQuantities[option.value] || 0;
          return (
            <div
              key={`${field.key}-${option.value}-${index}`}
              className="flex items-center justify-between px-2 py-1.5 rounded-md border border-border bg-card text-xs"
            >
              <span className="font-bold truncate mr-2">{option.label}</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() =>
                    handleSizeQuantityChange(
                      option.value,
                      Math.max(0, quantity - 1),
                    )
                  }
                  disabled={disabled || quantity === 0}
                  className="w-5 h-5 rounded border border-border hover:bg-secondary transition-colors disabled:opacity-50 text-xs"
                >
                  -
                </button>
                <span className="w-6 text-center font-bold">{quantity}</span>
                <button
                  onClick={() =>
                    handleSizeQuantityChange(option.value, quantity + 1)
                  }
                  disabled={disabled}
                  className="w-5 h-5 rounded border border-border hover:bg-secondary transition-colors disabled:opacity-50 text-xs"
                >
                  +
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
