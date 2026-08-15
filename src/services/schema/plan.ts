import { z } from "zod";

const sanitizedString = z.string().refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), {
  message: "Entrada inválida detectada.",
});

export const planSchema = z.object({
  name: sanitizedString.min(3, "Nome do plano deve ter no mínimo 3 caracteres").max(100, "Nome do plano muito longo"),
  price: z.number({ message: "Preço deve ser um número válido" }).min(0, "O preço não pode ser negativo"),
  maxStudents: z.number({ message: "Insira um número válido" }).min(1, "Deve ser no mínimo 1").nullable(),
  maxTeachers: z.number({ message: "Insira um número válido" }).min(1, "Deve ser no mínimo 1").nullable(),
  maxParents: z.number({ message: "Insira um número válido" }).min(1, "Deve ser no mínimo 1").nullable(),
  maxStaff: z.number({ message: "Insira um número válido" }).min(1, "Deve ser no mínimo 1").nullable(),
});

export type PlanSchema = z.infer<typeof planSchema>;
