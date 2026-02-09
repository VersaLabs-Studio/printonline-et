// components/product/ProductDetailPage.tsx
"use client";

import { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Share2,
  Shield,
  Truck,
  Clock,
  CheckCircle,
  Ruler,
  ArrowRight,
  X,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { getProductFormType } from "./ProductFormTypes";
import { getProductFormSchema } from "./ProductFormSchemas";
import {
  SelectField,
  RadioField,
  RadioVisualField,
  CheckboxField,
  MultiSelectField,
} from "./FormFields";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProductTabContent, ProductTabContent } from "./ProductTabContent";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  images: string[];
  badge?: string;
  features?: string[];
  description: string;
  inStock: boolean;
  discount?: number;
  designStyles: string[];
  templates: string[];
  specifications: {
    label: string;
    value: string;
  }[];
  tabs?: ProductTabContent;
}

interface ProductDetailPageProps {
  product: Product;
}

const ProductDetailPage = ({ product }: ProductDetailPageProps) => {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [activeTab, setActiveTab] = useState("product-details");
  const [showSizeChart, setShowSizeChart] = useState(false);

  // Get form schema based on product name
  const formSchema = useMemo(
    () => getProductFormSchema(product.name),
    [product.name],
  );
  const formType = useMemo(
    () => getProductFormType(product.name),
    [product.name],
  );
  const tabContent = useMemo(
    () => product.tabs ?? getProductTabContent(product.name),
    [product],
  );

  // Form state management
  const [formData, setFormData] = useState<Record<string, unknown>>(() => {
    const initial: Record<string, unknown> = {};
    Object.values(formSchema.fields).forEach((field: unknown) => {
      const f = field as {
        key: string;
        type: string;
        defaultChecked?: boolean;
      };
      if (f.type === "checkbox" && f.defaultChecked) {
        initial[f.key] = f.defaultChecked;
      } else if (f.type === "multi-select") {
        initial[f.key] = {};
      }
    });
    return initial;
  });

  // Field enabled/disabled state based on conditional logic
  const [fieldStates, setFieldStates] = useState<Record<string, boolean>>(
    () => {
      const states: Record<string, boolean> = {};
      Object.values(formSchema.fields).forEach((field: unknown) => {
        const f = field as { key: string; disabled?: boolean };
        states[f.key] = !f.disabled;
      });
      return states;
    },
  );

  // Update field states based on conditional logic
  useEffect(() => {
    if (!formSchema.conditionalLogic) return;

    const newStates = { ...fieldStates };
    Object.entries(formSchema.conditionalLogic).forEach(
      ([fieldKey, conditions]) => {
        (
          conditions as Array<{
            dependsOn: string;
            condition: (val: unknown) => boolean;
            action: string;
          }>
        ).forEach((condition) => {
          const dependsOnValue = formData[condition.dependsOn];
          const shouldEnable = condition.condition(dependsOnValue);

          if (condition.action === "enable") {
            newStates[fieldKey] = shouldEnable;
          } else if (condition.action === "disable") {
            newStates[fieldKey] = !shouldEnable;
          }
        });
      },
    );

    // Handle field dependencies (disablesOtherFields)
    Object.values(formSchema.fields).forEach((field: unknown) => {
      const f = field as { key: string; disablesOtherFields?: string[] };
      if (f.disablesOtherFields && formData[f.key]) {
        f.disablesOtherFields.forEach((otherFieldKey: string) => {
          newStates[otherFieldKey] = false;
        });
      }
    });

    setFieldStates(newStates);
  }, [formData, formSchema]);

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    setFormData((prev) => ({
      ...prev,
      [fieldKey]: value,
    }));

    // Enable dependent fields when parent field is selected
    const field = formSchema.fields[fieldKey] as
      | { disablesOtherFields?: string[] }
      | undefined;
    if (field?.disablesOtherFields && value) {
      setFieldStates((prev) => {
        const newStates = { ...prev };
        field.disablesOtherFields!.forEach((otherKey: string) => {
          newStates[otherKey] = true;
        });
        return newStates;
      });
    }
  };

  const validateForm = () => {
    const errors: string[] = [];

    Object.values(formSchema.fields).forEach((field: unknown) => {
      const f = field as { key: string; required?: boolean; label: string };
      if (f.required && !formData[f.key]) {
        errors.push(`${f.label} is required`);
      }
    });

    return errors;
  };

  const handleProceedToOrder = () => {
    const errors = validateForm();
    if (errors.length > 0) {
      toast.error("Please complete all required fields", {
        description: errors.join(", "),
      });
      return;
    }

    // Store order data in sessionStorage
    const orderData = {
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      category: product.category,
      customOptions: formData,
    };

    sessionStorage.setItem("pendingOrder", JSON.stringify(orderData));

    toast.success("Proceeding to order summary...", {
      description: "Review your selections before placing the order",
    });

    router.push("/order-summary");
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  const shareProduct = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: product.description,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
    }
  };

  const renderFormField = (fieldKey: string) => {
    const field = formSchema.fields[fieldKey];
    if (!field) return null;

    const value = formData[fieldKey];
    const disabled = !fieldStates[fieldKey];
    const f = field as { type: string; label: string };

    switch (f.type) {
      case "select":
        return (
          <SelectField
            key={fieldKey}
            field={field}
            value={value}
            onChange={(val) => handleFieldChange(fieldKey, val)}
            disabled={disabled}
          />
        );
      case "radio":
        return (
          <RadioField
            key={fieldKey}
            field={field}
            value={value}
            onChange={(val) => handleFieldChange(fieldKey, val)}
            disabled={disabled}
          />
        );
      case "radio-visual":
        return (
          <RadioVisualField
            key={fieldKey}
            field={field}
            value={value}
            onChange={(val) => handleFieldChange(fieldKey, val)}
            disabled={disabled}
          />
        );
      case "checkbox":
        return (
          <CheckboxField
            key={fieldKey}
            field={field}
            value={value}
            onChange={(val) => handleFieldChange(fieldKey, val)}
            disabled={disabled}
          />
        );
      case "multi-select":
        return (
          <MultiSelectField
            key={fieldKey}
            field={field}
            value={formData}
            onChange={(val) => setFormData(val)}
            disabled={disabled}
          />
        );
      case "modal-link":
        if (fieldKey === "sizeChart") {
          return (
            <div key={fieldKey} className="space-y-1">
              <label className="block text-xs font-medium text-foreground">
                {f.label}
              </label>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowSizeChart(true)}
                className="btn-pana px-3 py-1.5 text-xs inline-flex items-center gap-1"
              >
                <Ruler className="h-3 w-3" />
                View Size Chart
              </motion.button>
            </div>
          );
        }
        return null;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Product Images - Compact */}
        <div className="space-y-2">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative h-64 md:h-80 rounded-lg overflow-hidden bg-gray-50"
          >
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              fill
              className="object-contain"
              priority
            />

            {/* Badge */}
            {product.badge && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring" }}
                className="absolute top-3 left-3 z-10"
              >
                <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full shadow-lg">
                  {product.badge}
                </span>
              </motion.div>
            )}
          </motion.div>

          {/* Thumbnail Gallery - Compact */}
          <div className="flex space-x-1.5 overflow-x-auto pb-1">
            {product.images.map((image, index) => (
              <motion.button
                key={index}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedImage(index)}
                className={`relative w-14 h-14 rounded-md overflow-hidden border-2 transition-all shrink-0 ${
                  selectedImage === index
                    ? "border-primary ring-1 ring-primary/30"
                    : "border-transparent hover:border-primary/50"
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </div>

          {/* Information Tabs - Compact */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full gap-0"
          >
            <TabsList className="w-full grid grid-cols-2 lg:grid-cols-4 gap-1 p-0 bg-transparent rounded-none border-b border-border mb-1">
              {formSchema.tabs.map((tab) => {
                const tabValue = tab.toLowerCase().replace(/\s+/g, "-");
                return (
                  <TabsTrigger
                    key={tab}
                    value={tabValue}
                    className="relative text-xs data-[state=active]:bg-background/90 data-[state=active]:shadow-none data-[state=active]:text-primary/90 hover:bg-muted/50 transition-colors py-2"
                  >
                    {tab}
                    {activeTab === tabValue && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full transition-all duration-300" />
                    )}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            <div className="relative border-x border-b border-border bg-card p-3 h-[200px] overflow-hidden rounded-b-md">
              {formSchema.tabs.includes("Product Details") && (
                <TabsContent
                  forceMount
                  value="product-details"
                  className="transition-opacity duration-300 mt-0 pt-0 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 data-[state=inactive]:pointer-events-none data-[state=active]:pointer-events-auto absolute inset-0 p-3 overflow-y-auto"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-2"
                  >
                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-1">
                        Description
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {product.description}
                      </p>
                    </div>

                    {tabContent?.productDetails && (
                      <div className="space-y-3">
                        {tabContent.productDetails.sections.map(
                          (section, sectionIndex) => (
                            <motion.div
                              key={sectionIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: sectionIndex * 0.1 }}
                              className="p-3 rounded-md border border-border bg-card"
                            >
                              <h4 className="text-sm font-semibold text-foreground mb-2">
                                {section.heading}
                              </h4>
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-1">
                                {section.items.map((item, itemIndex) => (
                                  <div
                                    key={itemIndex}
                                    className="flex items-center space-x-1 p-1 rounded hover:bg-secondary/50 transition-colors"
                                  >
                                    <CheckCircle className="h-3 w-3 text-primary shrink-0" />
                                    <span className="text-xs text-foreground">
                                      {item}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </motion.div>
                          ),
                        )}
                      </div>
                    )}

                    {product.features && product.features.length > 0 && (
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-2">
                          Key Features
                        </h3>
                        <ul className="grid grid-cols-2 gap-1">
                          {product.features.map((feature, index) => (
                            <motion.li
                              key={index}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.1 }}
                              className="flex items-start space-x-1"
                            >
                              <CheckCircle className="h-3 w-3 text-primary mt-0.5 shrink-0" />
                              <span className="text-xs text-muted-foreground">
                                {feature}
                              </span>
                            </motion.li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div>
                      <h3 className="text-sm font-semibold text-foreground mb-2">
                        Specifications
                      </h3>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                        {product.specifications.map((spec, index) => (
                          <div
                            key={index}
                            className="flex justify-between py-1 border-b border-border/50 text-xs"
                          >
                            <span className="text-muted-foreground">
                              {spec.label}
                            </span>
                            <span className="text-foreground font-medium">
                              {spec.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </TabsContent>
              )}

              {formSchema.tabs.includes("Paper Stocks") && (
                <TabsContent
                  forceMount
                  value="paper-stocks"
                  className="transition-opacity duration-300 mt-0 pt-0 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 data-[state=inactive]:pointer-events-none data-[state=active]:pointer-events-auto absolute inset-0 p-3 overflow-y-auto"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-2"
                  >
                    {tabContent?.paperStocks ? (
                      <>
                        {tabContent.paperStocks.categories.map(
                          (category, catIndex) => (
                            <motion.div
                              key={catIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: catIndex * 0.1 }}
                              className="space-y-2"
                            >
                              <h3 className="text-sm font-bold text-foreground border-b border-primary/30 pb-1">
                                {category.name}
                              </h3>
                              <div className="grid grid-cols-2 gap-2">
                                {category.materials.map(
                                  (material, matIndex) => (
                                    <motion.div
                                      key={matIndex}
                                      className="p-2 rounded-md border border-border bg-card hover:border-primary/50 transition-all"
                                    >
                                      <div className="space-y-0.5 text-xs text-muted-foreground">
                                        <p className="font-semibold text-foreground">
                                          {material.name}
                                        </p>
                                        {material.thickness && (
                                          <p>
                                            <span className="font-medium">
                                              Thickness:
                                            </span>{" "}
                                            {material.thickness}
                                          </p>
                                        )}
                                        <p>
                                          <span className="font-medium">
                                            Finish:
                                          </span>{" "}
                                          {material.finish}
                                        </p>
                                      </div>
                                    </motion.div>
                                  ),
                                )}
                              </div>
                            </motion.div>
                          ),
                        )}
                      </>
                    ) : (
                      <div className="text-center py-4 text-xs text-muted-foreground">
                        Paper stock information not available.
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              )}

              {formSchema.tabs.includes("File Setup") && (
                <TabsContent
                  forceMount
                  value="file-setup"
                  className="transition-opacity duration-300 mt-0 pt-0 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 data-[state=inactive]:pointer-events-none data-[state=active]:pointer-events-auto absolute inset-0 p-3 overflow-y-auto"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-3"
                  >
                    {tabContent?.fileSetup ? (
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold text-foreground">
                          File Setup Guidelines
                        </h3>
                        <div className="p-2 rounded-md border border-border bg-card space-y-1">
                          {tabContent.fileSetup.specs.map((spec, specIndex) => (
                            <motion.div
                              key={specIndex}
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: specIndex * 0.05 }}
                              className="flex items-start justify-between py-1 border-b border-border/50 last:border-0 text-xs"
                            >
                              <p className="font-semibold text-foreground">
                                {spec.label}
                              </p>
                              <p className="font-medium text-primary ml-2">
                                {spec.value}
                              </p>
                            </motion.div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-xs text-muted-foreground">
                        File setup information not available.
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              )}

              {formSchema.tabs.includes("Templates") && (
                <TabsContent
                  forceMount
                  value="templates"
                  className="transition-opacity duration-300 mt-0 pt-0 data-[state=inactive]:opacity-0 data-[state=active]:opacity-100 data-[state=inactive]:pointer-events-none data-[state=active]:pointer-events-auto absolute inset-0 p-3 overflow-y-auto"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-2"
                  >
                    {tabContent?.templates ? (
                      <div className="space-y-3">
                        {tabContent.templates.instruction && (
                          <div className="p-2 rounded-md border border-primary/20 bg-primary/5">
                            <p className="text-xs text-foreground">
                              {tabContent.templates.instruction}
                            </p>
                          </div>
                        )}
                        <div className="space-y-2">
                          <h3 className="text-sm font-bold text-foreground">
                            Available Templates
                          </h3>
                          <div className="grid grid-cols-2 gap-2">
                            {tabContent.templates.sizes.map(
                              (template, templateIndex) => (
                                <motion.div
                                  key={templateIndex}
                                  initial={{ opacity: 0, y: 10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  transition={{ delay: templateIndex * 0.1 }}
                                  className="p-2 rounded-md border border-border bg-card hover:border-primary/50 transition-all"
                                >
                                  <h4 className="font-semibold text-xs text-foreground mb-1">
                                    {template.size}
                                  </h4>
                                  <div className="flex flex-wrap gap-1">
                                    {template.formats.map(
                                      (format, formatIndex) => (
                                        <span
                                          key={formatIndex}
                                          className="px-1.5 py-0.5 rounded bg-secondary text-foreground text-[10px] font-medium"
                                        >
                                          {format}
                                        </span>
                                      ),
                                    )}
                                  </div>
                                </motion.div>
                              ),
                            )}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-xs text-muted-foreground">
                        Templates not available.
                      </div>
                    )}
                  </motion.div>
                </TabsContent>
              )}

              {formSchema.tabs.includes("Size Chart") && (
                <TabsContent value="size-chart" className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-2"
                  >
                    <h3 className="text-sm font-semibold text-foreground">
                      Size Chart
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Select your size based on measurements.
                    </p>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowSizeChart(true)}
                      className="btn-pana px-4 py-2 text-xs"
                    >
                      View Full Size Chart
                    </motion.button>
                  </motion.div>
                </TabsContent>
              )}
            </div>
          </Tabs>
        </div>

        {/* Product Details & Form - Compact */}
        <div className="space-y-3">
          {/* Header - Compact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <p className="text-xs text-muted-foreground mb-1 uppercase tracking-wide">
              {product.category}
            </p>
            <h1 className="text-xl md:text-2xl font-bold text-foreground mb-2">
              {product.name}
            </h1>

            {/* Stock Status */}
            <div className="flex items-center space-x-2">
              <div
                className={`w-2 h-2 rounded-full ${product.inStock ? "bg-green-500" : "bg-red-500"}`}
              ></div>
              <span
                className={`text-xs font-medium ${product.inStock ? "text-green-600" : "text-red-600"}`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </motion.div>

          {/* Order Form - Compact with reduced spacing */}
          <div className="space-y-2.5 p-3 bg-secondary/20 rounded-lg border border-border/50">
            {Object.keys(formSchema.fields).map((fieldKey) => {
              if (fieldKey === "sizeChart") return null;
              return renderFormField(fieldKey);
            })}
          </div>

          {/* Proceed to Order & Actions - Compact */}
          <div className="space-y-2 pt-3 border-t border-border/50">
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleProceedToOrder}
                disabled={!product.inStock}
                className="flex-1 btn-pana py-2.5 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-semibold inline-flex items-center justify-center gap-2"
              >
                Proceed to Order
                <ArrowRight className="h-4 w-4" />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleWishlist}
                className="p-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                <Heart
                  className={`h-4 w-4 ${isWishlisted ? "fill-red-500 text-red-500" : ""}`}
                />
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={shareProduct}
                className="p-2 border border-border rounded-md hover:bg-secondary transition-colors"
              >
                <Share2 className="h-4 w-4" />
              </motion.button>
            </div>
          </div>

          {/* Trust Indicators - Compact */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-border/50">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Quality</p>
                <p className="text-[10px] text-muted-foreground">Guaranteed</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Truck className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Fast</p>
                <p className="text-[10px] text-muted-foreground">24-48hrs</p>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <Clock className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs font-medium text-foreground">Same Day</p>
                <p className="text-[10px] text-muted-foreground">Printing</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Size Chart Modal */}
      <AnimatePresence>
        {showSizeChart && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowSizeChart(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-lg p-4 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-foreground">
                  Size Chart
                </h3>
                <button
                  onClick={() => setShowSizeChart(false)}
                  className="p-1.5 rounded-md hover:bg-secondary transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-3">
                <p className="text-xs text-muted-foreground">
                  Size measurements in inches
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-2 font-semibold">Size</th>
                        <th className="text-left p-2 font-semibold">Chest</th>
                        <th className="text-left p-2 font-semibold">Length</th>
                        <th className="text-left p-2 font-semibold">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody>
                      {["S", "M", "L", "XL", "2XL", "3XL"].map((size) => (
                        <tr key={size} className="border-b border-border/50">
                          <td className="p-2 font-medium">{size}</td>
                          <td className="p-2 text-muted-foreground">38-40"</td>
                          <td className="p-2 text-muted-foreground">28"</td>
                          <td className="p-2 text-muted-foreground">8.5"</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailPage;
