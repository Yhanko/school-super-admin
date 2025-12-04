import { z } from "zod";

export const authSchema = z.object({
  fullName: z.string().min(3, "Nome muito curto").optional(),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
});

export type AuthSchema = z.infer<typeof authSchema>;