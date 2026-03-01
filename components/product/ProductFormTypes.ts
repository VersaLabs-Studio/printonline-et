// components/product/ProductFormTypes.ts
// Type definitions for dynamic product forms

export type ProductFormType =
  | "paper"
  | "large-format"
  | "apparel"
  | "gift"
  | "board";

export type FieldType =
  | "select"
  | "radio"
  | "radio-visual"
  | "checkbox"
  | "multi-select"
  | "modal-link";

export interface FormFieldOption {
  value: string;
  label: string;
  price?: number;
  priceModifier?: number;
  description?: string;
  hexColor?: string;
  disabled?: boolean;
  styleRestrictions?: string[];
  specs?: string;
  properties?: string[];
}

export interface FormFieldGroup {
  label: string;
  options: FormFieldOption[];
}

export interface FormField {
  key: string;
  type: FieldType;
  label: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  options?: FormFieldOption[];
  grouped?: boolean;
  groups?: Record<string, FormFieldOption[]>;
  defaultChecked?: string[];
  dynamicOptions?: Record<string, FormFieldOption[]>;
  affectsField?: string;
  disablesOtherFields?: string[];
  quantityOptions?: number[];
}

export interface ProductFormSchema {
  type: ProductFormType;
  fields: Record<string, FormField>;
  tabs: string[];
  conditionalLogic?: {
    [key: string]: {
      dependsOn: string;
      condition: (value: any) => boolean;
      action: "enable" | "disable" | "show" | "hide";
    }[];
  };
}

// Product Type Mappings
export const PRODUCT_TYPE_MAP: Record<string, ProductFormType> = {
  // Paper Products
  "Business Cards": "paper",
  Flyers: "paper",
  Postcards: "paper",
  Brochures: "paper",
  "Rack Cards": "paper",
  "Table Tents": "paper",
  "Door Hangers": "paper",
  Booklets: "paper",
  "Event Tickets": "paper",
  "Greeting Cards": "paper",
  "Mini Menus": "paper",
  Notepads: "paper",
  Catalogs: "paper",
  Letterheads: "paper",
  "Blank Letterheads": "paper",
  "Envelopes - Custom": "paper",
  "Envelopes - Logo": "paper",
  "Digital Paper Prints": "paper",

  // Large Format
  Banners: "large-format",
  "A-Frame Signs": "large-format",
  "Retractable Banners": "large-format",
  "Window Clings": "large-format",
  "Window Decals": "large-format",
  "Window Perfs": "large-format",
  "Floor Decals": "large-format",
  "Yard Signs": "large-format",
  "Flex Banners": "large-format",
  "Signage Solutions": "large-format",

  // Apparel
  "T-Shirts": "apparel",
  "Sweatshirts - Crewnecks": "apparel",
  "Sweatshirts - Hoodies": "apparel",
  "Sweatshirts - Full Zip Hoodies": "apparel",
  Polos: "apparel",
  Hats: "apparel",

  // Gift/Novelty
  Mugs: "gift",
  "Mouse Pads": "gift",
  Puzzles: "gift",
  "Photo Plaques": "gift",
  "Photo Book": "gift",
  "Framed Prints": "gift",
  Calendars: "gift",

  // Board/Material
  "Acrylic Boards": "board",
  "Aluminum Boards": "board",
  "Canvas Prints": "board",
  "Foam Boards": "board",
  "Corrugated Boards": "board",
  "PVC Boards": "board",
  "Metal Wall Prints": "board",
  "Mounted Wall Prints": "board",
  Cardboards: "board",
};

// Helper function to get product form type
export function getProductFormType(productName: string): ProductFormType {
  return PRODUCT_TYPE_MAP[productName] || "paper";
}
