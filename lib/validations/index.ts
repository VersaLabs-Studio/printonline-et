// lib/validations/index.ts
// Barrel export for all validation schemas

// Checkout & Order flow
export {
  customerInfoSchema,
  deliveryAddressSchema,
  orderSubmissionSchema,
  contactFormSchema,
  type CustomerInfoFormData,
  type DeliveryAddressFormData,
  type OrderSubmissionFormData,
  type ContactFormData,
} from "./checkout";

// Dynamic product option schemas
export {
  buildProductOptionsSchema,
  buildQuantitySchema,
  buildAddToCartSchema,
  getDefaultOptionValues,
} from "./product-options";

// CMS admin schemas
export {
  categoryFormSchema,
  productFormSchema,
  productOptionSchema,
  productOptionValueSchema,
  orderStatusUpdateSchema,
  type CategoryFormData,
  type ProductFormData,
  type ProductOptionFormData,
  type ProductOptionValueFormData,
  type OrderStatusUpdateFormData,
} from "./cms";

// Design file upload
export {
  designFileSchema,
  designFileMetadataSchema,
  ALLOWED_EXTENSIONS,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE,
  type DesignFileFormData,
  type DesignFileMetadata,
} from "./design-upload";

// Authentication schemas
export {
  signUpSchema,
  signInSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  profileUpdateSchema,
  type SignUpInput,
  type SignInInput,
  type ForgotPasswordInput,
  type ResetPasswordInput,
  type ProfileUpdateInput,
} from "./auth";
