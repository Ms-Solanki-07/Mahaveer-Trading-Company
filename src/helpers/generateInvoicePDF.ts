import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import path from "path";
import fs from "fs"; 
import { User } from '@/models/User.model';
import { Shop } from '@/models/Shop.model';
import { OrderItem } from '@/models/OrderItem.model';
import { Product } from '@/models/Product.model';

export interface GenerateInvoiceArgs { 
  user: User; 
  shop: Shop;
  items: (OrderItem & { product: Product })[]; // items MUST include the joined product info
  totalAmount: number;
  orderDate: Date;
  orderId: string;
}

export async function generateInvoicePDF({ user, shop, items, totalAmount, orderDate, orderId}: GenerateInvoiceArgs): Promise<string> { 
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([595.28, 841.89]); // A4

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  let y = 800;

  // Logo (optional)
  const logoPath = path.join(process.cwd(), "public", "mtc-logo.png");
  let companyLogoBuffer: Buffer | undefined = undefined;
  if (fs.existsSync(logoPath)) {
    companyLogoBuffer = fs.readFileSync(logoPath);
  }
  if (companyLogoBuffer) {
    try {
      let logo;
      if (companyLogoBuffer.slice(0, 4).toString('hex') === '89504e47') {
        logo = await pdfDoc.embedPng(companyLogoBuffer);
      } else {
        logo = await pdfDoc.embedJpg(companyLogoBuffer);
      }
      page.drawImage(logo, { x: 50, y: y - 60, width: 70, height: 70 });
    } catch {}
  }

  // Company Details (Professional Header)
  page.drawText('MAHAVEER TRADING COMPANY', {
    x: 140, y: y - 10, font: fontBold, size: 20, color: rgb(0.1, 0.1, 0.1)
  });
  page.drawText('Wholesaler & Distributor', {
    x: 140, y: y - 34, font: fontRegular, size: 11, color: rgb(0.5, 0.5, 0.5)
  });
  page.drawText('Jodhpur, Rajasthan, Pin: 342001', {
    x: 140, y: y - 48, font: fontRegular, size: 10, color: rgb(0.4, 0.4, 0.4)
  });
  page.drawText('Phone: +91-XXXXXXXXXX | Email: info@mahaveertrading.com', {
    x: 140, y: y - 62, font: fontRegular, size: 10, color: rgb(0.4, 0.4, 0.4)
  });
  page.drawText('GSTIN: 08XXXXXXXXXX1Z2', {
    x: 140, y: y - 76, font: fontRegular, size: 10, color: rgb(0.4, 0.4, 0.4)
  });

  page.drawLine({
    start: { x: 50, y: y - 90 },
    end: { x: 545, y: y - 90 },
    thickness: 1,
    color: rgb(0.75, 0.75, 0.75),
  });

  // Invoice Info Section
  page.drawText('INVOICE', {
    x: 260, y: y - 110, font: fontBold, size: 16, color: rgb(0, 0, 0)
  });
  
  page.drawText(`Invoice No: ${orderId}`, { x: 50, y: y - 130, font: fontRegular, size: 12 });
  page.drawText(`Invoice Date: ${new Date(orderDate).toLocaleDateString()}`, {
    x: 420, y: y - 130, font: fontRegular, size: 12
  }); 

  // Customer Details Section
  let sectionY = y - 185;
  page.drawText('Customer Details', { x: 50, y: sectionY, font: fontBold, size: 13 });
  sectionY -= 18;
  page.drawText(`Name: ${user.fullName}`, { x: 50, y: sectionY, font: fontRegular, size: 12 });
  sectionY -= 16;
  page.drawText(`Phone: ${user.phone}`, { x: 50, y: sectionY, font: fontRegular, size: 12 });
  sectionY -= 16;
  page.drawText(`Email: ${user.email}`, { x: 50, y: sectionY, font: fontRegular, size: 12 });

  // Shop Details Section
  sectionY -= 30;
  page.drawText("Customer Shop Details", { x: 50, y: sectionY, font: fontBold, size: 13 });
  sectionY -= 18;
  page.drawText(`Shop Name: ${shop.shopName}`, { x: 50, y: sectionY, font: fontRegular, size: 12 });
  sectionY -= 16;
  page.drawText(`GSTIN: ${shop.GSTIN ?? 'N/A'}`, { x: 50, y: sectionY, font: fontRegular, size: 12 });
  sectionY -= 16;
  page.drawText(
    `Address: ${shop.address}, ${shop.city}, ${shop.state} - ${shop.pinCode}`,
    { x: 50, y: sectionY, font: fontRegular, size: 12 }
  );

  // Products Table
  sectionY -= 38;
  page.drawText('Product Details', { x: 50, y: sectionY, font: fontBold, size: 13 });
  sectionY -= 18;
  const tableY = sectionY;

  // Table Header
  page.drawText('S.No', { x: 50, y: tableY, font: fontBold, size: 10 });
  page.drawText('Product Name', { x: 80, y: tableY, font: fontBold, size: 10 });
  page.drawText('Unit', { x: 200, y: tableY, font: fontBold, size: 10 });
  page.drawText('Qty', { x: 250, y: tableY, font: fontBold, size: 10 });
  page.drawText('MRP', { x: 295, y: tableY, font: fontBold, size: 10 });
  page.drawText('Discount', { x: 345, y: tableY, font: fontBold, size: 10 });
  page.drawText('Price', { x: 410, y: tableY, font: fontBold, size: 10 });
  page.drawText('Amount', { x: 480, y: tableY, font: fontBold, size: 10 });

  page.drawLine({
    start: { x: 50, y: tableY - 4 },
    end: { x: 545, y: tableY - 4 },
    thickness: 1,
    color: rgb(0.65, 0.65, 0.65),
  });

  // Table Rows
  let rowY = tableY - 20;
  let subtotal = 0;
  items.forEach((item, i) => {
    // Discount calculations
    const mrp = item.product.MRP ?? item.price;
    const discountPerc = item.product.discount ?? 0;
    const discountedPrice = Math.round(mrp * (1 - discountPerc / 100));
    const amount = discountedPrice * item.quantity;
    subtotal += amount;

    page.drawText(`${i + 1}`, { x: 52, y: rowY, font: fontRegular, size: 10 });
    page.drawText(item.product.name, { x: 80, y: rowY, font: fontRegular, size: 10 });
    page.drawText(item.product.unit, { x: 200, y: rowY, font: fontRegular, size: 10 });
    page.drawText(`${item.quantity}`, { x: 250, y: rowY, font: fontRegular, size: 10 });
    page.drawText(`${mrp}/-`, { x: 295, y: rowY, font: fontRegular, size: 10 });
    page.drawText(`${discountPerc}%`, { x: 345, y: rowY, font: fontRegular, size: 10 });
    page.drawText(`${discountedPrice}/-`, { x: 410, y: rowY, font: fontRegular, size: 10 });
    page.drawText(`${amount}/-`, { x: 480, y: rowY, font: fontRegular, size: 10 });
    rowY -= 18;
  });
  // Table Line
  page.drawLine({
    start: { x: 50, y: rowY + 12 },
    end: { x: 545, y: rowY + 12 },
    thickness: 1,
    color: rgb(0.65, 0.65, 0.65),
  });

  // Totals
  rowY -= 8;
  page.drawText(`Subtotal: ${subtotal}/-`, {
    x: 400, y: rowY, font: fontBold, size: 12, color: rgb(0, 0, 0)
  });
  // Example Tax 18%
  const taxRate = 0.18;
  const taxAmount = Math.round(subtotal * taxRate);
  page.drawText(`Tax (18%): ${taxAmount}/-`, {
    x: 400, y: rowY - 16, font: fontRegular, size: 11
  });
  rowY -= 34;
  page.drawText(`Grand Total: ${subtotal + taxAmount}/-`, {
    x: 400, y: rowY, font: fontBold, size: 14, color: rgb(0.07, 0.23, 0.18)
  });

  // Footer
  page.drawText('Thank you for your purchase!', {
    x: 200, y: 40, font: fontBold, size: 12, color: rgb(0.4, 0.4, 0.4)
  });
  page.drawText('For any queries, contact: info@mahaveertrading.com', {
    x: 150, y: 24, font: fontRegular, size: 10, color: rgb(0.4, 0.4, 0.4)
  });

  const pdfBytes = await pdfDoc.save();

  // Save PDF to invoices directory
  const invoicesDir = path.join(process.cwd(), "invoices");
  if (!fs.existsSync(invoicesDir)) {
    fs.mkdirSync(invoicesDir, { recursive: true });
  }
  const invoicePath = path.join(invoicesDir, `invoice_${orderId}.pdf`);
  fs.writeFileSync(invoicePath, pdfBytes);

  return invoicePath;
}
