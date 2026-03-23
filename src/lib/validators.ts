import { ContactCategory } from "@prisma/client";
import { z } from "zod";

const optionalText = z.string().trim().max(255).optional().or(z.literal(""));

export const loginSchema = z.object({
  email: z.email("Ingresa un correo valido").transform((value) => value.toLowerCase()),
  password: z.string().min(8, "La contraseña debe tener al menos 8 caracteres").max(72),
});

export const contactSchema = z
  .object({
    contactId: z.string().optional(),
    fullName: z.string().trim().min(3, "El nombre es obligatorio"),
    nick: optionalText,
    phone: optionalText,
    whatsapp: optionalText,
    category: z.nativeEnum(ContactCategory, {
      error: "Selecciona una categoria",
    }),
    nationality: optionalText,
    locality: optionalText,
    contactDate: z.string().optional(),
    reporterId: z.string().min(1, "Selecciona quien informa"),
    notes: z.string().trim().max(2000).optional().or(z.literal("")),
  })
  .superRefine((value, context) => {
    if (!value.phone && !value.whatsapp) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Debes indicar telefono o WhatsApp",
      });
    }
  });

export type ContactFormValues = z.infer<typeof contactSchema>;
