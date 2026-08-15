import { z } from "zod";

const sanitizedString = z.string().refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), {
  message: "Entrada inválida detectada.",
});

export const schoolSchema = z.object({
  schoolName: sanitizedString.min(3, "Nome da escola deve ter no mínimo 3 caracteres").max(100, "Nome da escola muito longo"),
  adminName: sanitizedString.min(3, "Nome do diretor deve ter no mínimo 3 caracteres").max(100, "Nome do diretor muito longo"),
  email: z.string().email("Email inválido").max(100, "Email muito longo"),
  phone: z.string().regex(/^\d{9,15}$/, "O telefone deve conter apenas números e ter entre 9 e 15 dígitos").or(z.literal("")),
  address: sanitizedString.max(255, "Endereço muito longo").or(z.literal("")),
  planId: z.string().min(1, "O plano é obrigatório"),
  password: z
    .string()
    .min(8, "A senha deve ter no mínimo 8 caracteres")
    .max(50, "A senha é muito longa")
    .regex(/[A-Z]/, "A senha deve conter pelo menos uma letra maiúscula")
    .regex(/[a-z]/, "A senha deve conter pelo menos uma letra minúscula")
    .regex(/[0-9]/, "A senha deve conter pelo menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha deve conter pelo menos um caractere especial"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"]
});

export type SchoolSchema = z.infer<typeof schoolSchema>;
