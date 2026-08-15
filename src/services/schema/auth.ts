import { z } from "zod";

// Base sanitized string to prevent basic XSS patterns
const sanitizedString = z.string().refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), {
  message: "Entrada inválida detectada.",
});

export const authSchema = z.object({
  fullName: sanitizedString.min(3, "Nome muito curto").max(100, "Nome muito longo").optional(),
  email: z.string().email("Email inválido").max(100, "Email muito longo"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .max(50, "A senha é muito longa")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
});

export type AuthSchema = z.infer<typeof authSchema>;