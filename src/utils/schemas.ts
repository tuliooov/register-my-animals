import { z } from "zod";

export const animalSchema = z.object({
  categoria: z
    .string()
    .min(1, "Categoria é obrigatória")
    .max(40, "Categoria deve ter no máximo 40 caracteres"),

  especie: z
    .string()
    .min(1, "Espécie é obrigatória")
    .max(50, "Espécie deve ter no máximo 50 caracteres"),

  quantidade: z
    .number()
    .int("Quantidade deve ser um número inteiro")
    .positive("Quantidade deve ser um número positivo"),

  dataCompra: z.date(),

  dataNascimento: z.date().optional(),

  valor: z.number().positive("Valor deve ser um número positivo"),

  tamanho: z.number().positive("Tamanho deve ser um número positivo"),

  origem: z
    .string()
    .min(1, "Origem é obrigatória")
    .max(100, "Origem deve ter no máximo 100 caracteres"),

  observacao: z
    .string()
    .max(254, "Observação deve ter no máximo 254 caracteres")
    .optional(),
  imageUrl: z.string().url("URL da imagem inválida").optional().nullable(),
});

export type AnimalFormData = z.infer<typeof animalSchema>;

export const importSchema = z.object({
  importText: z
    .string()
    .min(1, "Texto de importação é obrigatório")
    .refine(
      (text) => text.startsWith("ANIMAL::"),
      'Formato de importação inválido. Deve começar com "ANIMAL::"'
    ),
});

export type ImportFormData = z.infer<typeof importSchema>;


