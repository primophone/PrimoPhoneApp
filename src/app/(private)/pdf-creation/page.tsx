import { ProductForm } from "@/components/form/Form_pdf";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function PdfCreationPage() {
  return (
    <Card>
    <CardHeader>
      <CardTitle className="text-primary pb-4">Gerar PDF de Garantia</CardTitle>
    </CardHeader>
    <CardContent>
      <ProductForm />
    </CardContent>
  </Card>
  );
}
