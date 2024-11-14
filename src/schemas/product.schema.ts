import { z } from "zod";

export const variantSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  title: z.string(),
  price: z.string().transform((n) => parseInt(n)),
  inventory_policy: z.string().optional(),
  compare_at_price: z.string().transform((n) => parseInt(n)).optional(),
  option1: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const imageSchema = z.object({
  id: z.number().optional(),
  product_id: z.number().optional(),
  src: z.string().optional()
});

export const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  variants: z.array(variantSchema),
  image: imageSchema.optional(),
  vendor: z.string().optional(),


});

export const apiResponseSchema = z.array(productSchema);


export type ApiResponse = z.TypeOf<typeof apiResponseSchema>;
export type Product = z.TypeOf<typeof productSchema>;
export type Variant = z.TypeOf<typeof variantSchema>;
export type Image = z.TypeOf<typeof imageSchema>;
