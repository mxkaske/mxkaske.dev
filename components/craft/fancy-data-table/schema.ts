import { z } from "zod";

// https://github.com/colinhacks/zod/issues/2985#issue-2008642190
const stringToBoolean = z
  .string()
  .toLowerCase()
  .transform((val) => {
    try {
      return JSON.parse(val);
    } catch (e) {
      console.log(e);
      return false;
    }
  })
  .pipe(z.boolean());

const regions = ["ams", "gru", "syd", "hkg", "fra", "iad"] as const;
const tags = ["web", "api", "enterprise", "app"] as const

export const schema = z.object({
  name: z.string().or(z.string().array()).optional(),
  p95: z.coerce.number().or(z.coerce.number().array().length(2)).optional(),
  public: stringToBoolean.or(stringToBoolean.array()).optional(),
  active: stringToBoolean.or(stringToBoolean.array()).optional(),
  regions: z.enum(regions).or(z.enum(regions).array()).optional(),
  tags: z.string().or(z.string().array()).optional(), // could use enum
});

// export const urlParamsSchema = schema.omit({"p95": true }).extend({
//   p95: z.object({
//     from: z.coerce.number().min(0).max(3000).optional(),
//     to: z.coerce.number().min(0).max(3000).optional(),
//   }).optional(),
// })

export type Schema = z.infer<typeof schema>;


/**
 * TODO: create two different schemas:
 * - columnSchema
 * - urlParamsSchema
 * That way, it allows us to validate the URL, and validate the data. Those are two different types.
 */