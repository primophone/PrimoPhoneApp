/* eslint-disable @typescript-eslint/no-explicit-any */
import { formatToReal } from "@/lib/formatters";
import { infoFormSchema } from "@/schema/info";
import { PDFDocument, StandardFonts, PDFPage, PDFFont } from "pdf-lib";
import { z } from "zod";

// Função para centralizar texto
function drawTextCentered(
  page: PDFPage,
  text: string,
  font: any,
  fontSize: number,
  xStart: number,
  xEnd: number,
  y: number
): void {
  const textWidth = font.widthOfTextAtSize(text, fontSize);
  const centeredX = xStart + (xEnd - xStart - textWidth) / 2;

  page.drawText(text, {
    x: centeredX,
    y,
    size: fontSize,
    font,
  });
}

// Função para desenhar uma linha
function drawLine(
  page: PDFPage,
  start: { x: number; y: number },
  end: { x: number; y: number },
  thickness: number
): void {
  page.drawLine({
    start,
    end,
    thickness,
  });
}

// Função para desenhar uma linha
function drawText(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  size: number,
  font: any
): void {
  page.drawText(text, {
    x,
    y,
    size,
    font,
  });
}

function drawTextWithWrap(
  page: PDFPage,
  text: string,
  x: number,
  y: number,
  fontSize: number,
  font: PDFFont,
  maxWidth: number,
  lineHeight: number
): string[] {
  const words = text.split(" ");
  let currentLine = "";
  const lines: string[] = [];

  for (const word of words) {
    const testLine = currentLine + (currentLine ? " " : "") + word;
    const testLineWidth = font.widthOfTextAtSize(testLine, fontSize);

    if (testLineWidth > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine) {
    lines.push(currentLine); // Adiciona a última linha
  }

  // Renderizar cada linha e ajustar a posição vertical (Y)
  for (const line of lines) {
    page.drawText(line, {
      x,
      y,
      size: fontSize,
      font,
    });
    y -= lineHeight; // Move a posição Y para a próxima linha
  }

  return lines; // Retorna as linhas renderizadas
}

export async function generatePdf(
  values: z.infer<typeof infoFormSchema>
): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();
  const timesRomanFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const page = pdfDoc.addPage([600, 850]);

  // Carregando e inserindo o logo
  const logoUrl = "/logo.png";
  const logoImageBytes = await fetch(logoUrl).then((res) => res.arrayBuffer());
  const logoImage = await pdfDoc.embedPng(logoImageBytes);

  const logoWidth = 150;
  const logoHeight = 100;

  // Desenhando a primeira linha de divisão
  drawLine(page, { x: 20, y: 830 }, { x: 580, y: 830 }, 1);
  drawLine(page, { x: 20, y: 830 }, { x: 20, y: 800 }, 1);
  page.drawText(
    "RECEBI DE PRIMOPHONE OS PRDUTOS E/OU SERVIÇOS CONSTANTES NO PEDIDO",
    {
      x: 25,
      y: 810,
      size: 10,
      font: boldFont,
    }
  );
  drawLine(page, { x: 580, y: 830 }, { x: 580, y: 800 }, 1);
  drawLine(page, { x: 20, y: 800 }, { x: 580, y: 800 }, 1);

  // Desenhando a seção de data e assinatura
  drawLine(page, { x: 20, y: 800 }, { x: 20, y: 770 }, 1);
  page.drawText("Data de recebimento", {
    x: 25,
    y: 790,
    size: 8,
    font: timesRomanFont,
  });
  drawLine(page, { x: 250, y: 800 }, { x: 250, y: 770 }, 1);
  page.drawText("Identificação e assinatura do recebedor", {
    x: 252,
    y: 790,
    size: 8,
    font: timesRomanFont,
  });
  drawLine(page, { x: 580, y: 800 }, { x: 580, y: 770 }, 1);
  drawLine(page, { x: 20, y: 770 }, { x: 580, y: 770 }, 1);

  // Desenhando a seção da logo e informações da loja
  drawLine(page, { x: 20, y: 750 }, { x: 580, y: 750 }, 1);
  drawLine(page, { x: 20, y: 650 }, { x: 20, y: 750 }, 1);
  page.drawImage(logoImage, {
    x: 20,
    y: 650,
    width: logoWidth,
    height: logoHeight,
  });
  drawLine(page, { x: 175, y: 650 }, { x: 175, y: 750 }, 1);
  drawLine(page, { x: 465, y: 650 }, { x: 465, y: 750 }, 1);

  drawTextCentered(page, "PEDIDO DE VENDA", boldFont, 10, 465, 580, 729);
  drawTextCentered(page, "0 - ENTRADA", boldFont, 10, 465, 580, 714);
  drawTextCentered(page, "1 - SAÍDA", boldFont, 10, 465, 580, 699);

  // Desenhando o quadrinho com o número
  drawLine(page, { x: 515, y: 680 }, { x: 530, y: 680 }, 1);
  drawLine(page, { x: 515, y: 665 }, { x: 530, y: 665 }, 1);
  drawTextCentered(page, "1", boldFont, 10, 465, 580, 669);
  drawLine(page, { x: 515, y: 680 }, { x: 515, y: 665 }, 1);
  drawLine(page, { x: 530, y: 680 }, { x: 530, y: 665 }, 1);
  drawLine(page, { x: 580, y: 650 }, { x: 580, y: 750 }, 1);
  drawLine(page, { x: 20, y: 650 }, { x: 580, y: 650 }, 1);

  // Desenhando as informações da loja
  drawTextCentered(page, "PrimoPhone", timesRomanFont, 10, 175, 465, 729);
  drawTextCentered(
    page,
    "Rua Aluízio de Azevedo, 200   Sala 10 05",
    timesRomanFont,
    10,
    175,
    465,
    714
  );
  drawTextCentered(
    page,
    "Santo Amaro, Recife, PE - CEP 50100-090",
    timesRomanFont,
    10,
    175,
    465,
    699
  );
  drawTextCentered(page, "(81) 99999-9999", timesRomanFont, 10, 175, 465, 684);
  drawTextCentered(
    page,
    "primophone@email.com",
    timesRomanFont,
    10,
    175,
    465,
    669
  );

  // DESTINATÁRIO/REMETENTE

  drawText(page, "DESTINATÁRIO/REMETENTE", 20, 630, 10, boldFont);

  const yPosition = 625;

  drawLine(page, { x: 20, y: yPosition }, { x: 580, y: yPosition }, 1);
  drawLine(page, { x: 20, y: yPosition }, { x: 20, y: yPosition - 20 }, 1);
  drawText(page, "Nome/Razão social", 25, yPosition - 15, 10, boldFont);
  drawLine(page, { x: 220, y: yPosition }, { x: 220, y: yPosition - 20 }, 1);
  drawText(page, "Nascimento", 225, yPosition - 15, 10, boldFont);
  drawLine(page, { x: 315, y: yPosition }, { x: 315, y: yPosition - 20 }, 1);
  drawText(page, "Telefone", 320, yPosition - 15, 10, boldFont);
  drawLine(page, { x: 415, y: yPosition }, { x: 415, y: yPosition - 20 }, 1);
  drawText(page, "CPF/CNPJ", 420, yPosition - 15, 10, boldFont);
  drawLine(page, { x: 497, y: yPosition }, { x: 497, y: yPosition - 20 }, 1);
  drawText(page, "Data da Venda", 502, yPosition - 15, 10, boldFont);
  drawLine(page, { x: 580, y: yPosition }, { x: 580, y: yPosition - 20 }, 1);

  drawLine(
    page,
    { x: 20, y: yPosition - 20 },
    { x: 580, y: yPosition - 20 },
    1
  );

  //info primeira linha

  drawLine(page, { x: 20, y: yPosition }, { x: 20, y: yPosition - 40 }, 1);
  drawText(page, values.name, 25, yPosition - 35, 8, timesRomanFont);
  drawLine(page, { x: 220, y: yPosition }, { x: 220, y: yPosition - 40 }, 1);
  drawText(
    page,
    values.dateOfBirth.toLocaleDateString(),
    225,
    yPosition - 35,
    8,
    timesRomanFont
  );
  drawLine(page, { x: 315, y: yPosition }, { x: 315, y: yPosition - 40 }, 1);
  drawText(
    page,
    values.phone as string,
    320,
    yPosition - 35,
    8,
    timesRomanFont
  );
  drawLine(page, { x: 415, y: yPosition }, { x: 415, y: yPosition - 40 }, 1);
  drawText(page, values.cpf, 420, yPosition - 35, 8, timesRomanFont);
  drawLine(page, { x: 497, y: yPosition }, { x: 497, y: yPosition - 40 }, 1);
  drawText(
    page,
    values.dateOfSell.toLocaleDateString(),
    502,
    yPosition - 35,
    8,
    timesRomanFont
  );
  drawLine(page, { x: 580, y: yPosition }, { x: 580, y: yPosition - 40 }, 1);

  drawLine(
    page,
    { x: 20, y: yPosition - 40 },
    { x: 580, y: yPosition - 40 },
    1
  );

  //DESTINATÁRIO/REMETENTE 2

  drawLine(page, { x: 20, y: yPosition }, { x: 20, y: yPosition - 60 }, 1);
  drawText(page, "Endereço", 25, yPosition - 55, 10, boldFont);
  drawLine(page, { x: 315, y: yPosition }, { x: 315, y: yPosition - 60 }, 1);
  drawText(page, "CEP", 320, yPosition - 55, 10, boldFont);
  drawLine(page, { x: 415, y: yPosition }, { x: 415, y: yPosition - 60 }, 1);
  drawText(page, "Cidade", 420, yPosition - 55, 10, boldFont);
  drawLine(page, { x: 497, y: yPosition }, { x: 497, y: yPosition - 60 }, 1);
  drawText(page, "Estado", 502, yPosition - 55, 10, boldFont);
  drawLine(page, { x: 580, y: yPosition }, { x: 580, y: yPosition - 60 }, 1);

  drawLine(
    page,
    { x: 20, y: yPosition - 60 },
    { x: 580, y: yPosition - 60 },
    1
  );

  //info primeira linha

  drawLine(page, { x: 20, y: yPosition }, { x: 20, y: yPosition - 80 }, 1);
  drawText(
    page,
    values.address as string,
    25,
    yPosition - 75,
    8,
    timesRomanFont
  );
  drawLine(page, { x: 315, y: yPosition }, { x: 315, y: yPosition - 80 }, 1);
  drawText(page, values.cep as string, 320, yPosition - 75, 8, timesRomanFont);
  drawLine(page, { x: 415, y: yPosition }, { x: 415, y: yPosition - 80 }, 1);
  drawText(page, values.city, 420, yPosition - 75, 8, timesRomanFont);
  drawLine(page, { x: 497, y: yPosition }, { x: 497, y: yPosition - 80 }, 1);
  drawText(page, values.state, 502, yPosition - 75, 8, timesRomanFont);
  drawLine(page, { x: 580, y: yPosition }, { x: 580, y: yPosition - 80 }, 1);

  drawLine(
    page,
    { x: 20, y: yPosition - 80 },
    { x: 580, y: yPosition - 80 },
    1
  );

  // PRODUTOS
  drawText(page, "DADOS DOS PRODUTOS", 20, yPosition - 100, 10, boldFont);
  drawLine(
    page,
    { x: 20, y: yPosition - 105 },
    { x: 580, y: yPosition - 105 },
    1
  ); // Linha superior
  drawLine(
    page,
    { x: 20, y: yPosition - 105 },
    { x: 20, y: yPosition - 125 },
    1
  ); // Borda esquerda
  drawText(page, "Descrição", 25, yPosition - 120, 10, boldFont);
  drawLine(
    page,
    { x: 315, y: yPosition - 105 },
    { x: 315, y: yPosition - 125 },
    1
  ); // Coluna Garantia
  drawTextCentered(page, "Garantia", boldFont, 10, 315, 385, yPosition - 120);
  drawLine(
    page,
    { x: 385, y: yPosition - 105 },
    { x: 385, y: yPosition - 125 },
    1
  ); // Coluna Qtd
  drawTextCentered(page, "Qtd", boldFont, 10, 385, 420, yPosition - 120);
  drawLine(
    page,
    { x: 420, y: yPosition - 105 },
    { x: 420, y: yPosition - 125 },
    1
  ); // Coluna Valor Unit
  drawTextCentered(page, "Valor Unit", boldFont, 10, 420, 500, yPosition - 120);
  drawLine(
    page,
    { x: 500, y: yPosition - 105 },
    { x: 500, y: yPosition - 125 },
    1
  ); // Coluna Total
  drawTextCentered(page, "Total", boldFont, 10, 500, 580, yPosition - 120);
  drawLine(
    page,
    { x: 580, y: yPosition - 105 },
    { x: 580, y: yPosition - 125 },
    1
  ); // Borda direita
  drawLine(
    page,
    { x: 20, y: yPosition - 125 },
    { x: 580, y: yPosition - 125 },
    1
  ); // Linha inferior do cabeçalho

  // Adicionar os produtos
  const productStartY = yPosition - 140; // Ajustar a posição inicial abaixo do cabeçalho
  values.products.forEach((product, index) => {
    const rowHeight = 20; // Altura de cada linha
    const currentY = productStartY - index * rowHeight;

    // Desenhar os dados nas colunas
    page.drawText(product.description, {
      x: 25,
      y: currentY,
      size: 8,
      font: timesRomanFont,
    });
    // page.drawText(product.warranty, { x: 325, y: currentY, size: 8, font: timesRomanFont });
    drawTextCentered(
      page,
      product.warranty,
      timesRomanFont,
      8,
      320,
      385,
      currentY
    );

    // Centralizar as colunas de Qtd, Valor Unit e Total
    drawTextCentered(
      page,
      String(product.quantity),
      timesRomanFont,
      8,
      385,
      420,
      currentY
    );
    drawTextCentered(
      page,
      formatToReal(product.unitPrice),
      timesRomanFont,
      8,
      420,
      500,
      currentY
    );
    drawTextCentered(
      page,
      formatToReal(product.quantity * product.unitPrice),
      timesRomanFont,
      8,
      500,
      580,
      currentY
    );

    // Desenhar as linhas horizontais para separar as linhas dos produtos
    drawLine(page, { x: 20, y: currentY - 5 }, { x: 580, y: currentY - 5 }, 1);
  });

  // Desenhar as linhas verticais da tabela (para cada produto)
  values.products.forEach((_, index) => {
    const currentY = productStartY - index * 20;

    drawLine(page, { x: 20, y: currentY + 15 }, { x: 20, y: currentY - 5 }, 1); // Esquerda
    drawLine(
      page,
      { x: 315, y: currentY + 15 },
      { x: 315, y: currentY - 5 },
      1
    ); // Descrição
    drawLine(
      page,
      { x: 385, y: currentY + 15 },
      { x: 385, y: currentY - 5 },
      1
    ); // Garantia
    drawLine(
      page,
      { x: 420, y: currentY + 15 },
      { x: 420, y: currentY - 5 },
      1
    ); // Qtd
    drawLine(
      page,
      { x: 500, y: currentY + 15 },
      { x: 500, y: currentY - 5 },
      1
    ); // Valor Unit
    drawLine(
      page,
      { x: 580, y: currentY + 15 },
      { x: 580, y: currentY - 5 },
      1
    ); // Direita
  });

  // Calcular o total de todos os produtos
  const totalAmount = values.products.reduce((sum, product) => {
    return sum + product.quantity * product.unitPrice;
  }, 0);

  // Linha para o total
  const totalRowY = productStartY - values.products.length * 20; // A posição da linha total, ajustando o Y

  // Desenhar o texto "Total" na coluna "Valor Unit"
  drawTextCentered(page, "Total", boldFont, 8, 420, 500, totalRowY);

  // Desenhar o total na coluna "Total"
  drawTextCentered(
    page,
    formatToReal(totalAmount),
    boldFont,
    8,
    500,
    580,
    totalRowY
  );

  // Linha horizontal abaixo do total
  drawLine(page, { x: 420, y: totalRowY - 5 }, { x: 580, y: totalRowY - 5 }, 1);

  const paymentStartY = productStartY - values.products.length * 20

  // Desenhar título da nova tabela
  drawText(page, "PAGAMENTO", 20, paymentStartY - 20, 10, boldFont);
  drawLine(
    page,
    { x: 20, y: paymentStartY - 25 },
    { x: 580, y: paymentStartY - 25 },
    1
  );
  drawLine(
    page,
    { x: 20, y: paymentStartY - 25 },
    { x: 20, y: paymentStartY - 45 },
    1
  );

  // Títulos das colunas
  drawTextCentered(
    page,
    "Forma de pagamento",
    boldFont,
    10,
    20,
    420,
    paymentStartY - 40
  );
  drawLine(
    page,
    { x: 420, y: paymentStartY - 25 },
    { x: 420, y: paymentStartY - 45 },
    1
  );
  drawTextCentered(page, "Valor pago", boldFont, 10, 420, 580, paymentStartY - 40);
  drawLine(
    page,
    { x: 580, y: paymentStartY - 25 },
    { x: 580, y: paymentStartY - 45 },
    1
  );
  drawLine(
    page,
    { x: 20, y: paymentStartY - 45 },
    { x: 580, y: paymentStartY - 45 },
    1
  );

  values.payments.forEach((payment, index) => {
    const rowHeight = 20; // Altura de cada linha
    const currentY = paymentStartY  - 65 - index * rowHeight;
    // Desenhar os dados nas colunas
    drawLine(page, { x: 20, y: currentY }, { x: 20, y: currentY + 20 }, 1);
    page.drawText(payment.type, {
      x: 25,
      y: currentY + 5,
      size: 8,
      font: timesRomanFont,
    });
    // Desenhar as linhas horizontais para separar as linhas dos produtos
    drawLine(page, { x: 20, y: currentY }, { x: 580, y: currentY }, 1);
    drawLine(page, { x: 420, y: currentY }, { x: 420, y: currentY + 20 }, 1);
    drawTextCentered(
      page,
      formatToReal(payment.value),
      timesRomanFont,
      8,
      420,
      580,
      currentY + 5
    );
    drawLine(page, { x: 580, y: currentY }, { x: 580, y: currentY + 20 }, 1);
  });

  // Informação garantia

  const infoStartY0 = productStartY - values.products.length * 20;
  const infoStartY = infoStartY0 - values.payments.length * 20 - 80;

  {
    /* 
    
    const garantiaText = `
    1. Em caso de quedas, esmagamentos, sobrecarga elétrica, exposição do aparelho a altas temperaturas, umidade ou líquidos, exposição do aparelho à poeira, pó e/ou limalha de metais; ou ainda quando atestado mau uso do aparelho pelo comprador; instalações, modificações ou atualizações no seu sistema operacional; abertura do equipamento ou tentativa de conserto por terceiros. Tela do aparelho que apresente mau uso, trincados ou quebrados, riscados, manchados, descolados ou com cabo flex rompido não fazem parte desta garantia.
    2. A garantia é contada a partir da data de compra do aparelho e tem sua duração conforme a tabela acima.
    3. Funcionamento, instalação e atualização de aplicativos, sistema operacional e SAÚDE DA BATERIA do aparelho NÃO FAZEM parte desta garantia.
    4. Limpeza e conservação do aparelho NÃO FAZEM parte desta garantia assim como qualquer risco, arranhado, marca de queda ou algo do tipo que não havia no aparelho na hora da compra INVIABILIZARÁ ESTA GARANTIA.
    5. A não apresentação deste documento que comprove o serviço INVALIDA a garantia.
    6. Qualquer mal funcionamento APÓS ATUALIZAÇÕES do sistema operacional ou aplicativos NÃO FAZEM PARTE DESSA GARANTIA. 
    7. A GARANTIA é válida somente para o item descrito neste termo e dentro das condições aqui descritas, NÃO ABRANGENDO OUTRAS PARTES.
    5. TROCAS somente serão efetuadas após análise técnica dos aparelhos eletrônicos pela assistência técnica de nossa escolha com prazo máximo de 30 dias.
    6. Após 30 dias, caso não seja possível a resolução do problema pela assistência técnica, o comprador receberá o reembolso do valor pago (SOMENTE O VALOR ORIGINAL DO PRODUTO, NÃO INCLUINDO TAXAS E JUROS DE PARCELAMENTOS EM CARTÃO DE CREDITO OU BOLETO VIA CREDIÁRIO).
    `;
    */
  }

  const garantiaText = `
1. Em caso de quedas, esmagamentos, sobrecarga elétrica, exposição do aparelho a altas temperaturas, umidade ou líquidos, exposição do aparelho à poeira, pó e/ou limalha de metais; ou ainda quando atestado mau uso do aparelho pelo comprador; instalações, modificações ou atualizações no seu sistema operacional; abertura do equipamento ou tentativa de conserto por terceiros. Tela do aparelho que apresente mau uso, trincados ou quebrados, riscados, manchados, descolados ou com cabo flex rompido não fazem parte desta garantia.
2. A garantia é contada a partir da data de compra do aparelho e tem sua duração conforme a tabela acima.
3. Funcionamento, instalação e atualização de aplicativos, sistema operacional e SAÚDE DA BATERIA do aparelho NÃO FAZEM parte desta garantia.
4. Limpeza e conservação do aparelho NÃO FAZEM parte desta garantia assim como qualquer risco, arranhado, marca de queda ou algo do tipo que não havia no aparelho na hora da compra INVIABILIZARÁ ESTA GARANTIA.
5. A não apresentação deste documento que comprove o serviço INVALIDA a garantia.
6. Qualquer mal funcionamento APÓS ATUALIZAÇÕES do sistema operacional ou aplicativos NÃO FAZEM PARTE DESSA GARANTIA. 
7. A GARANTIA é válida somente para o item descrito neste termo e dentro das condições aqui descritas, NÃO ABRANGENDO OUTRAS PARTES.
5. TROCAS somente serão efetuadas após análise técnica dos aparelhos eletrônicos pela assistência técnica de nossa escolha com prazo máximo de 30 dias.
6. Após 30 dias, caso não seja possível a resolução do problema pela assistência técnica, o comprador receberá o reembolso do valor pago (SOMENTE O VALOR ORIGINAL DO PRODUTO, NÃO INCLUINDO TAXAS E JUROS DE PARCELAMENTOS EM CARTÃO DE CREDITO OU BOLETO VIA CREDIÁRIO).
8. **Aparelhos Lacrados e Garantia Apple:** Para aparelhos lacrados e originais, a garantia é conforme estabelecido pela Apple. Após a abertura da embalagem, a Apple se responsabiliza pelos defeitos de fabricação do aparelho, conforme os termos de sua garantia. É fundamental que o consumidor consulte os termos da garantia da Apple para obter informações detalhadas sobre cobertura, prazos e procedimentos. 
`;

  // Função para dividir texto em blocos separados por números (1., 2., 3., ...)
  const splitIntoItems = (text: string) => {
    return text
      .trim()
      .split(/(?=\d+\.)/g) // Quebra antes de cada número (1., 2., etc.)
      .map((line) => line.trim());
  };

  drawText(page, "DADOS ADICIONAIS", 20, infoStartY, 10, boldFont);
  drawLine(
    page,
    { x: 20, y: infoStartY - 5 },
    { x: 580, y: infoStartY - 5 },
    1
  ); // Linha superior
  drawLine(
    page,
    { x: 20, y: infoStartY - 230 },
    { x: 580, y: infoStartY - 230 },
    1
  ); // Linha inferior
  drawLine(page, { x: 20, y: infoStartY - 5 }, { x: 20, y: infoStartY - 230 }, 1); // Borda esquerda
  drawLine(page, { x: 580, y: infoStartY - 5 }, { x: 580, y: infoStartY - 230 }, 1); // Borda direita
  drawText(
    page,
    "A GARANTIA É CANCELADA AUTOMATICAMENTE NOS SEGUINTES CASOS:",
    25,
    infoStartY - 20,
    10,
    boldFont
  );
  // Obtém os itens como linhas separadas
  const items = splitIntoItems(garantiaText);

  // Posição inicial para desenhar o texto
  let currentY = infoStartY - 20;
  const lineHeight = 10; // Altura de cada linha de texto

  for (const item of items) {
    const wrappedLines = drawTextWithWrap(
      page,
      item,
      25, // X inicial
      currentY - 20, // Y inicial
      8, // Tamanho da fonte
      timesRomanFont, // Fonte
      550, // Largura máxima
      lineHeight // Espaçamento entre linhas
    );

    if (!wrappedLines || wrappedLines.length === 0) {
      throw new Error("wrappedLines retornou vazio ou indefinido");
    }

    // Ajusta a posição Y com base no número de linhas renderizadas
    currentY -= wrappedLines.length * lineHeight; // Sem espaçamento extra
  }
  

// Calculando o meio entre as linhas
const meio = 20 + (580 - 20) / 2;

drawLine(
    page,
    { x: 20, y: infoStartY - 270 },
    { x: meio - 50, y: infoStartY - 270 },
    1
); // Assinatura cliente

drawLine(
    page,
    { x: meio + 50, y: infoStartY - 270 },
    { x: 580, y: infoStartY - 270 },
    1
); // Assinatura loja

  // Serializando o documento em bytes
  const pdfBytes = await pdfDoc.save();

  return pdfBytes;
}
