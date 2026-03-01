// components/product/ProductFormSchemas.ts
// Form schemas for each product type

import { ProductFormSchema, FormField } from "./ProductFormTypes";

// Paper Products Schema
export const paperProductSchema: ProductFormSchema = {
  type: "paper",
  tabs: ["Product Details", "Paper Stocks", "File Setup", "Templates"],
  fields: {
    size: {
      key: "size",
      type: "select",
      label: "Size",
      required: true,
      options: [
        { value: "2x3.5", label: '2" x 3.5" Standard' },
        { value: "2x3", label: '2" x 3"' },
        { value: "1.75x3.5", label: '1.75" x 3.5"' },
        { value: "3.5x2", label: '3.5" x 2" (Vertical)' },
        { value: "custom", label: "Custom Size" },
      ],
    },
    orientation: {
      key: "orientation",
      type: "radio",
      label: "Orientation",
      required: true,
      options: [
        { value: "horizontal", label: "Horizontal" },
        { value: "vertical", label: "Vertical" },
      ],
    },
    paper: {
      key: "paper",
      type: "select",
      label: "Paper Stock",
      required: true,
      grouped: true,
      groups: {
        Standard: [
          { value: "14pt-gloss", label: "14 pt. Gloss" },
          { value: "14pt-uncoated", label: "14 pt. Uncoated" },
          { value: "100lb-matte", label: "100 lb. Matte Cover" },
        ],
        Premium: [
          { value: "13pt-linen", label: "13 pt. Premium Linen" },
          { value: "16pt-matte", label: "16 pt. Premium Matte" },
          { value: "18pt-kraft", label: "18 pt. Premium Kraft" },
        ],
        "Ultra Premium": [
          { value: "18pt-pearl", label: "18 pt. Ultra Premium Pearl" },
          { value: "18pt-smooth", label: "18 pt. Ultra Premium Smooth White" },
        ],
        "Ultra Thick": [
          { value: "24pt-green", label: "24 pt. Trifecta Green" },
          { value: "38pt-black", label: "38 pt. Trifecta Black" },
        ],
      },
    },
    color: {
      key: "color",
      type: "select",
      label: "Print Color",
      required: true,
      options: [
        { value: "front-only", label: "Full Color Front, No Back" },
        { value: "front-gray-back", label: "Full Color Front, Grayscale Back" },
        { value: "both-sides", label: "Full Color Both Sides" },
      ],
    },
    quantity: {
      key: "quantity",
      type: "select",
      label: "Quantity",
      required: true,
      options: Array.from({ length: 20 }, (_, i) => {
        const qty =
          [
            50, 100, 250, 500, 1000, 2500, 5000, 10000, 15000, 20000, 25000,
            30000, 40000, 50000, 75000, 100000,
          ][i] || (i + 1) * 1000;
        return { value: qty.toString(), label: qty.toLocaleString() };
      }),
    },
    roundedCorners: {
      key: "roundedCorners",
      type: "select",
      label: "Rounded Corner",
      options: [
        { value: "none", label: "None", price: 0 },
        { value: "rounded", label: "Round Corners", price: 5.0 },
      ],
    },
    coating: {
      key: "coating",
      type: "select",
      label: "Coating",
      options: [
        { value: "none", label: "No Coating" },
        { value: "gloss", label: "High Gloss UV Coating Front" },
        { value: "matte", label: "Matte Coating" },
      ],
    },
    productionTime: {
      key: "productionTime",
      type: "radio",
      label: "Production Time",
      required: true,
      options: [
        {
          value: "regular",
          label: "Regular",
          description: "2-4 Business Days",
        },
        {
          value: "rush",
          label: "Rush",
          description: "2 Business Days",
          priceModifier: 1.5,
        },
      ],
    },
  },
};

// Large Format Schema
export const largeFormatSchema: ProductFormSchema = {
  type: "large-format",
  tabs: ["Product Details", "File Setup", "Templates"],
  fields: {
    size: {
      key: "size",
      type: "select",
      label: "Size",
      required: true,
      grouped: true,
      groups: {
        "Popular Sizes": [
          { value: "2x4", label: "2 ft x 4 ft" },
          { value: "3x6", label: "3 ft x 6 ft" },
          { value: "4x8", label: "4 ft x 8 ft" },
          { value: "4x10", label: "4 ft x 10 ft" },
        ],
        "Custom Sizes": [
          { value: "1x2", label: "1 ft x 2 ft" },
          { value: "1x3", label: "1 ft x 3 ft" },
          { value: "6x20", label: "6 ft x 20 ft" },
          { value: "custom", label: "Custom Size" },
        ],
      },
      disablesOtherFields: ["material", "color"],
    },
    material: {
      key: "material",
      type: "select",
      label: "Material",
      required: true,
      disabled: true,
      options: [
        { value: "8oz-mesh", label: "8 oz. Premium Mesh Vinyl" },
        { value: "13oz-glossy", label: "13 oz. Premium Scrim Glossy Vinyl" },
        { value: "13oz-matte", label: "13 oz. Premium Scrim Matte Vinyl" },
      ],
      disablesOtherFields: ["color"],
    },
    color: {
      key: "color",
      type: "select",
      label: "Color",
      required: true,
      disabled: true,
      options: [{ value: "full-color", label: "Full Color Front, No Back" }],
    },
    quantity: {
      key: "quantity",
      type: "select",
      label: "Quantity",
      options: [
        { value: "1", label: "1" },
        { value: "5", label: "5" },
        { value: "10", label: "10" },
        { value: "25", label: "25" },
        { value: "50", label: "50" },
        { value: "100", label: "100" },
      ],
    },
    grommets: {
      key: "grommets",
      type: "select",
      label: "Grommets (Optional)",
      description: "Add every 2 feet for hanging",
      options: [
        { value: "none", label: "None" },
        { value: "every-2ft", label: "Every 2 feet", price: 15.0 },
      ],
    },
  },
  conditionalLogic: {
    material: [
      {
        dependsOn: "size",
        condition: (value) => !!value,
        action: "enable",
      },
    ],
    color: [
      {
        dependsOn: "material",
        condition: (value) => !!value,
        action: "enable",
      },
    ],
  },
};

// Apparel Schema
export const apparelSchema: ProductFormSchema = {
  type: "apparel",
  tabs: [
    "Product Details",
    "Print Guidelines",
    "Size Chart",
    "File Setup",
    "Templates",
  ],
  fields: {
    style: {
      key: "style",
      type: "select",
      label: "Style",
      required: true,
      options: [
        { value: "crew-neck", label: "Crew Neck" },
        { value: "v-neck", label: "V-Neck" },
        { value: "hoodie", label: "Hoodie" },
        { value: "full-zip", label: "Full Zip Hoodie" },
      ],
    },
    color: {
      key: "color",
      type: "radio-visual",
      label: "Color",
      required: true,
      options: [
        { value: "white", label: "White", hexColor: "#FFFFFF" },
        { value: "black", label: "Black", hexColor: "#000000" },
        { value: "navy", label: "Navy", hexColor: "#001F3F" },
        { value: "red", label: "Red", hexColor: "#FF4136" },
        { value: "blue", label: "Blue", hexColor: "#0074D9" },
        {
          value: "athletic-heather",
          label: "Athletic Heather",
          hexColor: "#999999",
        },
        { value: "cream", label: "Cream/Natural", hexColor: "#FFFDD0" },
        { value: "charcoal", label: "Charcoal", hexColor: "#36454F" },
      ],
    },
    material: {
      key: "material",
      type: "select",
      label: "Material",
      required: true,
      options: [
        {
          value: "cotton",
          label: "100% Cotton",
          specs: "100% Combed Ring-Spun Cotton (4.5 oz)",
          properties: [
            "Ultra Soft",
            "Stretchable",
            "Side Seamed",
            "Pre-shrunk",
          ],
        },
      ],
    },
    printLocation: {
      key: "printLocation",
      type: "checkbox",
      label: "Print Location (Select all that apply)",
      defaultChecked: ["front"],
      options: [
        { value: "front", label: "Front" },
        { value: "back", label: "Back" },
      ],
    },
    genderStyle: {
      key: "genderStyle",
      type: "radio",
      label: "Style Type",
      required: true,
      options: [
        { value: "mens", label: "Men/Unisex" },
        { value: "womens", label: "Women" },
        { value: "youth", label: "Youth" },
        { value: "toddler", label: "Toddler" },
      ],
      affectsField: "sizes",
    },
    sizes: {
      key: "sizes",
      type: "multi-select",
      label: "Quantity by Size",
      description:
        "Choose your desired size(s) and quantities below & click ADD",
      dynamicOptions: {
        mens: [
          { value: "S", label: "Small" },
          { value: "M", label: "Medium" },
          { value: "L", label: "Large" },
          { value: "XL", label: "X-Large" },
          { value: "2XL", label: "2X-Large" },
          { value: "3XL", label: "3X-Large" },
        ],
        womens: [
          { value: "XS", label: "X-Small" },
          { value: "S", label: "Small" },
          { value: "M", label: "Medium" },
          { value: "L", label: "Large" },
          { value: "XL", label: "X-Large" },
          { value: "2XL", label: "2X-Large" },
        ],
        youth: [
          { value: "XS", label: "X-Small" },
          { value: "S", label: "Small" },
          { value: "M", label: "Medium" },
          { value: "L", label: "Large" },
          { value: "XL", label: "X-Large" },
        ],
        toddler: [
          { value: "2T", label: "2T" },
          { value: "3T", label: "3T" },
          { value: "4T", label: "4T" },
        ],
      },
      quantityOptions: Array.from({ length: 51 }, (_, i) => i),
    },
    sizeChart: {
      key: "sizeChart",
      type: "modal-link",
      label: "Size Chart",
    },
  },
};

// Gift/Novelty Schema
export const giftSchema: ProductFormSchema = {
  type: "gift",
  tabs: ["Product Details", "File Setup", "Templates"],
  fields: {
    size: {
      key: "size",
      type: "radio",
      label: "Size",
      options: [
        { value: "11oz", label: "11oz" },
        { value: "15oz", label: "15oz" },
        { value: "18oz", label: "18oz" },
      ],
    },
    type: {
      key: "type",
      type: "radio",
      label: "Type",
      options: [
        { value: "standard", label: "Standard" },
        { value: "heat-activated", label: "Heat Activated" },
      ],
    },
    color: {
      key: "color",
      type: "radio",
      label: "Color",
      options: [
        { value: "white", label: "White" },
        { value: "black", label: "Black" },
      ],
    },
    trim: {
      key: "trim",
      type: "radio",
      label: "Trim Color",
      options: [
        { value: "white", label: "White" },
        { value: "black", label: "Black" },
        { value: "indigo", label: "Indigo" },
        { value: "red", label: "Red" },
        { value: "blue", label: "Blue" },
        { value: "pink", label: "Pink" },
      ],
    },
    quantity: {
      key: "quantity",
      type: "select",
      label: "Quantity",
      options: [
        { value: "", label: "Please select an option" },
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "5", label: "5" },
        { value: "10", label: "10" },
        { value: "25", label: "25" },
        { value: "50", label: "50" },
      ],
    },
  },
};

// Board/Material Schema
export const boardSchema: ProductFormSchema = {
  type: "board",
  tabs: ["Product Details", "File Setup", "Templates"],
  fields: {
    material: {
      key: "material",
      type: "select",
      label: "Material",
      options: [
        { value: "acrylic", label: "Acrylic" },
        { value: "aluminum", label: "Aluminum" },
        { value: "foam", label: "Foam" },
        { value: "pvc", label: "PVC" },
        { value: "canvas", label: "Canvas" },
        { value: "corrugated", label: "Corrugated" },
      ],
    },
    thickness: {
      key: "thickness",
      type: "select",
      label: "Thickness",
      options: [
        { value: "1/8", label: '1/8"' },
        { value: "1/4", label: '1/4"' },
        { value: "3/8", label: '3/8"' },
        { value: "1/2", label: '1/2"' },
      ],
    },
    shape: {
      key: "shape",
      type: "select",
      label: "Shape",
      options: [
        { value: "rectangle", label: "Rectangle" },
        { value: "square", label: "Square" },
        { value: "circle", label: "Circle" },
      ],
    },
    size: {
      key: "size",
      type: "select",
      label: "Size",
      options: [
        { value: "8x10", label: '8x10"' },
        { value: "11x14", label: '11x14"' },
        { value: "12x18", label: '12x18"' },
        { value: "custom", label: "Custom" },
      ],
    },
    quantity: {
      key: "quantity",
      type: "select",
      label: "Quantity",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "5", label: "5" },
        { value: "10", label: "10" },
        { value: "25", label: "25" },
      ],
    },
  },
};

// Schema getter function
export function getProductFormSchema(productName: string): ProductFormSchema {
  const { getProductFormType } = require("./ProductFormTypes");
  const formType = getProductFormType(productName);

  switch (formType) {
    case "paper":
      return paperProductSchema;
    case "large-format":
      return largeFormatSchema;
    case "apparel":
      return apparelSchema;
    case "gift":
      return giftSchema;
    case "board":
      return boardSchema;
    default:
      return paperProductSchema;
  }
}
