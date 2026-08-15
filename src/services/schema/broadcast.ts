import { z } from "zod";

const sanitizedString = z.string().refine((val) => !/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(val), {
  message: "Entrada inválida detectada.",
});

export const broadcastSchema = z.object({
  type: z.enum(['info', 'warning', 'error'], {
    message: 'Tipo inválido selecionado.'
  }),
  message: sanitizedString.min(5, "A mensagem deve ter no mínimo 5 caracteres").max(500, "A mensagem não pode exceder 500 caracteres"),
});

export type BroadcastSchema = z.infer<typeof broadcastSchema>;
