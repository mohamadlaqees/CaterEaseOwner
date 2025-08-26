import { z } from "zod";
const timeStringSchema = z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, {
  message: "Invalid time format (HH:MM).",
});

export const branchSchema = z.object({
  description: z.string().min(1, "Branch Description is required."),
  manager_id: z.string().min(1, "Please select a Manager."),
  governorate_id: z.string().min(1, "Please select a Governorate."),
  location_note: z.string().min(1, "loacation Note is required."),
  latitude: z
    .union([
      z.number(), // Allows numbers from handleFetchLocation
      z
        .string()
        .min(1, "Latitude is required.")
        .transform((v) => parseFloat(v)),
    ])
    .refine((v) => v >= -90 && v <= 90, "Latitude must be between -90 and 90."),

  longitude: z
    .union([
      z.number(), // Allows numbers from handleFetchLocation
      z
        .string()
        .min(1, "Longitude is required.")
        .transform((v) => parseFloat(v)),
    ])
    .refine(
      (v) => v >= -180 && v <= 180,
      "Longitude must be between -180 and 180."
    ),

  working_hours: z.array(
    z.object({
      day: z.string().min(1, "Day is required."),
      // Allows a valid time string OR the exact word "Closed"
      open_time: z.union([timeStringSchema, z.literal("Closed")]),
      // Allows a valid time string, the word "Closed", or an empty string
      close_time: z.union([
        timeStringSchema,
        z.literal("Closed"),
        z.literal(""),
      ]),
    })
  ),

  delivery_regions: z.array(
    z.object({
      governorate_id: z.string().min(1, "Governorate name is required."),
      cityName: z.string().min(1, "Region name is required."),
      city_id: z.coerce.number(),
      district_id: z.coerce.number().min(1, "District is required."),
      delivery_price: z.coerce.number().min(1, "Price is required."),
    })
  ),
  categories: z.array(z.string()).min(1, "Please add at least one category."),

  services: z.array(
    z.object({
      name: z.string().min(1, "Region name is required."),
      price: z.coerce.number().min(1, "Price is required."),
      description: z.string().min(1, "Description is required."),
    })
  ),
});
