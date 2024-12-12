/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { infoFormSchema } from "@/schema/info";
import { formatCPF, formatPhone } from "@/lib/formatters";
import { ChangeEvent } from "react";
import { File, Plus, Trash2 } from "lucide-react";
//import { saveAs } from "file-saver";
import { generatePdf } from "@/server/pdfGenerator";

export function ProductForm() {
  const form = useForm<z.infer<typeof infoFormSchema>>({
    resolver: zodResolver(infoFormSchema),
    defaultValues: {
      products: [
        {
          description: "",
          warranty: "",
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0,
        },
      ],
      payments: [
        {
          type: "",
          value: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const {
    fields: paymentFields,
    append: appendPayment,
    remove: removePayment,
  } = useFieldArray({
    control: form.control,
    name: "payments",
  });

  const handleCPFChange =
    (field: any) => (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      if (inputValue.length >= 14) return;
      field.onChange(formatCPF(inputValue));
    };

  const handlePhoneChange =
    (field: any) => (event: ChangeEvent<HTMLInputElement>) => {
      const inputValue = event.target.value;
      if (inputValue.replace(/\D/g, "").length >= 12) return;
      field.onChange(formatPhone(inputValue));
    };

  const onSubmit = async (values: z.infer<typeof infoFormSchema>) => {
    const pdfBytes = await generatePdf(values);
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const pdfUrl = URL.createObjectURL(blob); // Cria uma URL temporária para o blob

    // Abre o PDF em uma nova aba ou janela
    window.open(pdfUrl, "_blank");
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        {form.formState.errors.root && (
          <div className="text-destructive text-sm">
            {form.formState.errors.root.message}
          </div>
        )}

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Nome completo</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Data de Nascimento</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      field.onChange(new Date(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Telefone</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value || ""}
                    onChange={handlePhoneChange(field)}
                    placeholder="(DD) 00000-0000"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cpf"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>CPF/CNPJ</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    value={field.value || ""}
                    onChange={handleCPFChange(field)}
                    placeholder="000.000.000-00"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="dateOfSell"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Data da venda</FormLabel>
                <FormControl>
                  <Input
                    type="date"
                    {...field}
                    value={
                      field.value
                        ? new Date(field.value).toISOString().split("T")[0]
                        : ""
                    }
                    onChange={(e) => {
                      field.onChange(new Date(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Endereço</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row">
          <FormField
            control={form.control}
            name="cep"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>CEP</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="flex gap-4 flex-col md:flex-row md:w-1/2">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormLabel>Estado</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Seção de Produtos */}
        <div>
          <h3 className="text-lg font-semibold pb-4">Produtos</h3>
          {fields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-2 md:grid-cols-6 gap-4 pb-4 items-end"
            >
              {/* Descrição */}
              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name={`products.${index}.description`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Quantidade */}
              <div>
                <FormField
                  control={form.control}
                  name={`products.${index}.quantity`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Qtd</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Garantia */}
              <div>
                <FormField
                  control={form.control}
                  name={`products.${index}.warranty`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Garantia</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Valor Unitário */}
              <div>
                <FormField
                  control={form.control}
                  name={`products.${index}.unitPrice`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Unitário</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botão de Remoção */}
              <div className="flex items-center justify-start md:justify-end">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <Trash2 className="w-6 h-6 text-red-600" />
                </Button>
              </div>
            </div>
          ))}

          {/* Botão para Adicionar Produto */}
          <Button
            className="text-green-600"
            variant="outline"
            type="button"
            onClick={() =>
              append({
                description: "",
                warranty: "",
                quantity: 1,
                unitPrice: 0,
                totalPrice: 0,
              })
            }
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>
        {/* Seção de Pagamento */}
        <div>
          <h3 className="text-lg font-semibold pb-4">Formas de Pagamento</h3>
          {paymentFields.map((field, index) => (
            <div
              key={field.id}
              className="grid grid-cols-4 md:grid-cols-6 gap-4 pb-4 items-end"
            >
              {/* Tipo de Pagamento */}
              <div className="col-span-2 md:col-span-3">
                <FormField
                  control={form.control}
                  name={`payments.${index}.type`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tipo de Pagamento</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Valor Pago */}
              <div className="col-span-1 md:col-span-2">
                <FormField
                  control={form.control}
                  name={`payments.${index}.value`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Valor Pago</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Botão de Remoção */}
              <div className="flex items-center justify-start md:justify-end">
                <Button
                  variant="ghost"
                  type="button"
                  onClick={() => removePayment(index)}
                >
                  <Trash2 className="w-6 h-6 text-red-600" />
                </Button>
              </div>
            </div>
          ))}

          {/* Botão para Adicionar Pagamento */}
          <Button
            className="text-green-600"
            variant="outline"
            type="button"
            onClick={() =>
              appendPayment({
                type: "",
                value: 0,
              })
            }
          >
            <Plus className="w-6 h-6" />
          </Button>
        </div>

        <div className="flex gap-2 justify-end">
          <Button disabled={form.formState.isSubmitting} type="submit">
            Gerar PDF
            <File className="w-6 h-6" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
