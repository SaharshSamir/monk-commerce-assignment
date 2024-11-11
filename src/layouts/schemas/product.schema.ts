import { z } from "zod";

const variantSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  title: z.string(),
  price: z.string().transform((n) => parseInt(n))
});

const imageSchema = z.object({
  id: z.number(),
  product_id: z.number(),
  src: z.string()
});

const productSchema = z.object({
  id: z.number(),
  title: z.string(),
  variants: z.array(variantSchema),
  image: imageSchema as z.ZodType<Image>

});

export type Product = z.TypeOf<typeof productSchema>;
export type Variant = z.TypeOf<typeof variantSchema>;
export type Image = z.TypeOf<typeof imageSchema>;
