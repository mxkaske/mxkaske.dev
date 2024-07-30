import { z } from "zod";

/** Strings used to separate the URL params */
export const ARRAY_DELIMITER = ",";
export const SLIDER_DELIMITER = "-";

const REGIONS = ["ams", "gru", "syd", "hkg", "fra", "iad"] as const;
const TAGS = ["web", "api", "enterprise", "app"] as const;

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

export const schema = z.object({
  name: z.string().or(z.string().array()).optional(),
  p95: z.coerce.number().or(z.coerce.number().array().length(2)).optional(),
  public: stringToBoolean.or(stringToBoolean.array()).optional(),
  active: stringToBoolean.or(stringToBoolean.array()).optional(),
  regions: z.enum(REGIONS).or(z.enum(REGIONS).array()).optional(),
  tags: z.string().or(z.string().array()).optional(), // could use enum
});

export type Schema = z.infer<typeof schema>;

export const columnSchema = z.object({
  name: z.string(),
  p95: z.number(),
  public: z.boolean(),
  active: z.boolean(),
  regions: z.enum(REGIONS).array(),
  tags: z.enum(TAGS).array(),
});

export type ColumnSchema = z.infer<typeof columnSchema>;

// or could rename to `urlParamsSchema`
export const columnFilterSchema = z.object({
  p95: z.coerce
    .number()
    .or(
      z
        .string()
        .transform((val) => val.split(SLIDER_DELIMITER))
        .pipe(z.coerce.number().array().length(2))
    )
    .optional(), // TBD: we could transform to `{ min: x, max: y}`
  public: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(stringToBoolean.array())
    .optional(),
  active: z
    .string()
    .transform((val) => val.split(ARRAY_DELIMITER))
    .pipe(stringToBoolean.array())
    .optional(),
  regions: z
    .enum(REGIONS)
    .or(
      z
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER))
        .pipe(z.enum(REGIONS).array())
    )
    .optional(),
  tags: z
    .enum(TAGS)
    .or(
      z
        .string()
        .transform((val) => val.split(ARRAY_DELIMITER))
        .pipe(z.enum(TAGS).array())
    )
    .optional(),
});

export type ColumnFilterSchema = z.infer<typeof columnFilterSchema>;

/**
 * TODO: create two different schemas:
 * - columnSchema
 * - urlParamsSchema
 * That way, it allows us to validate the URL, and validate the data. Those are two different types.
 * We probably need a serializer, deserializer each of the schemas
 */
