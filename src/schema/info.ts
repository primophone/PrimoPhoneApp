import { z } from "zod";

export const productSchema = z.object({
    description: z.string().min(1, "Descrição é obrigatória."),
    warranty: z.string(),
    quantity: z.number().min(1, "Quantidade deve ser pelo menos 1."),
    unitPrice: z.number().min(0, "Valor unitário deve ser maior ou igual a 0."),
    totalPrice: z.number().min(0, "Valor total deve ser maior ou igual a 0."),
  });
  export const paymentSchema = z.object({
    type: z.string().min(1, "Forma de pagamento é obrigatória"),
    value: z.number().min(0, "Valor unitário deve ser maior ou igual a 0.")
  })

export const infoFormSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório"),
    dateOfBirth: z
        .date()
        .max(new Date(), "Data de nascimento não pode ser no futuro"),
    phone: z.string().optional(),
    cpf: z.string()
        .min(1, "CPF é obrigatório")
        .regex(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/, "CPF deve estar no formato XXX.XXX.XXX-XX"),
    dateOfSell: z.date(),
    address: z.string().optional(),
    cep: z.string().min(1, "CEP é obrigátorio"),
    city: z.string().min(1, "Cidade é obrigato´rio"),
    state: z.string().min(1, "Estado é obrigatório"),
    products: z.array(productSchema).min(1, "Adicione pelo menos um produto."),
    payments: z.array(paymentSchema).min(1,"Adicione pelo menos um metodo de pagamento.")
});