"use server";

import { z } from "zod";

const apiKey = process.env.GOOGLE_API_KEY;

const suggestionSchema = z.object({
  predictions: z
    .object({ description: z.string(), place_id: z.string() })
    .array()
    .optional(),
  status: z.string(),
});

export async function getGooglePlaces(query: string) {
  const components = "country:US"; // TODO: change country
  const types = "route";
  const language = "en"; // TODO: change language
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(query)}&key=${apiKey}&components=${components}&types=${types}&language=${language}`;
  const response = await fetch(url);
  const data = (await response.json()) as unknown;

  console.log(data);

  const validation = suggestionSchema.safeParse(data);
  if (!validation.success) {
    return [];
  }

  if (validation.data.status !== "OK") {
    return [];
  }

  return validation.data.predictions;
}

const placeSchema = z.object({
  result: z.object({
    address_components: z
      .object({
        long_name: z.string(),
        short_name: z.string(),
        types: z.string().array(),
      })
      .array(),
  }),
  status: z.string(),
});

export async function getGooglePlaceById(id: string) {
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&key=${apiKey}`;
  const response = await fetch(url);
  const data = (await response.json()) as unknown;
  const validation = placeSchema.safeParse(data);

  if (!validation.success) {
    return null;
  }

  if (validation.data.status !== "OK") {
    return null;
  }

  const place: Record<
    "street" | "postal_code" | "city" | "house_number",
    string | undefined
  > = {
    street: undefined,
    postal_code: undefined,
    city: undefined,
    house_number: undefined,
  };

  validation.data.result.address_components.forEach((component) => {
    if (component.types.includes("route")) {
      place.street = component.long_name;
    }
    if (component.types.includes("postal_code")) {
      place.postal_code = component.long_name;
    }
    if (component.types.includes("locality")) {
      place.city = component.long_name;
    }
    if (component.types.includes("street_number")) {
      place.house_number = component.long_name;
    }
  });

  return place;
}
