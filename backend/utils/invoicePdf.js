const PDFDocument = require('pdfkit');
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');
const { LOGO_FILE_PATH } = require('./enums');
const { invoiceEnum } = require('./deliveryStatus');

exports.generateInvoice = async (orderData) => {
  const doc = new PDFDocument({ margin: 50 });
  const fileName = `Invoice-${orderData?.invoiceNumber || '000000IA'}.pdf`;
  const filePath = path.join('public', 'uploads', fileName);
  const stream = fs.createWriteStream(filePath);
  doc.pipe(stream);

  const pageWidth = doc.page.width;
  const margin = 50;

  // Draw horizontal line
  const drawLine = () => {
    const y = doc.y + 5;
    doc.strokeColor('#000').lineWidth(2).moveTo(margin, y).lineTo(pageWidth - margin, y).stroke();
    doc.moveDown(1);
  };

  const deliveryHistory = orderData?.orderDetails?.deliveryHistory || [];
  const lastStatus = deliveryHistory.length > 0 ? deliveryHistory[deliveryHistory.length - 1]?.status : 'placed';

  // --- Header Title + Logo ---
  const logoWidth = 80;
  const logoHeight = 50;
  const headerY = doc.y;

  // Title aligned left
  doc
    .fontSize(22)
    .font('Helvetica-Bold')
    .text(`ORDER ${invoiceEnum[lastStatus].toUpperCase()} INVOICE`, margin, headerY, { align: 'left' });

  if (fs.existsSync(LOGO_FILE_PATH)) {
    doc.image(LOGO_FILE_PATH, pageWidth - margin - logoWidth, headerY - 10, {
      fit: [logoWidth, logoHeight],
    });
  }

  doc.moveDown(2);
  drawLine();

  // Invoice Info
  doc
    .fontSize(12)
    .font('Helvetica')
    .text(`Invoice Number: ${orderData?.invoiceNumber || '000000IA'}`)
    .text(`Order Number: ${orderData?.orderNumber || '00000000'}`)
    .text(`Date: ${new Date(orderData?.createdAt || new Date()).toLocaleDateString()}`);
  drawLine();

  // Bill To
  const addr = orderData?.address || {};
  doc
    .moveDown()
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Bill To:')
    .moveDown(0.5)
    .fontSize(12)
    .font('Helvetica')
    .text(`${addr?.name || ''} ${addr?.mainAddress1 || ''}`)
    .text(`${addr?.mainAddress2 || ''}`)
    .text(`Mobile: ${addr?.mobileNumber || ''}`)
    .text(`Landmark: ${addr?.landmark || ''}`);
  drawLine();

  // Order Details
  const details = orderData?.orderDetails || {};
  doc
    .moveDown()
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Order Details:')
    .moveDown(0.5)
    .fontSize(12)
    .font('Helvetica')
    .text(`1. Product: ${details?.productName || ''}`)
    .text(`2. Quantity: ${details?.productQuantity || 0}  Price: AED ${details?.productPrice || 0}`)
    .text(`3. Discount: AED ${details?.productDiscount || 0}`)
    .text(
      `4. Delivery Fee: ${
        details?.deliveryFee === 0 ? 'No Delivery Fee' : `AED ${details?.deliveryFee || 0}`
      }`
    )
    .text(
      `5. Handling Charges: ${
        details?.handlingCharges === 0 ? 'No Handling Charges' : `AED ${details?.handlingCharges || 0}`
      }`
    );
  drawLine();

  // Delivery Status
  doc
    .moveDown()
    .fontSize(14)
    .font('Helvetica-Bold')
    .text('Delivery Status:')
    .moveDown(0.5)
    .fontSize(12)
    .font('Helvetica');

  (details?.deliveryHistory || []).forEach((history, index) => {
    doc.text(
      `${index + 1}. ${invoiceEnum[history.status].toUpperCase()}: ${
        history.isCurrentActive ? 'Current Status' : 'Past'
      } (On: ${new Date(history.createdAt).toLocaleString()})`
    );
  });
  drawLine();

  // Total
  doc
    .moveDown()
    .fontSize(16)
    .font('Helvetica-Bold')
    .text(`Total Amount: AED ${details?.totalPrice || 0}`, { align: 'right' });
  drawLine();

  // Footer
  doc
    .moveDown(2)
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Thank you for shopping with us! GreenDose', { align: 'center' })
    .fontSize(10)
    .font('Helvetica')
    .text('Affordable. Sustainable. For Everyone.', { align: 'center' });

  doc.end();

  const reportPath = `${process.env.BACK_END_BASE_URL}/uploads/${fileName}`;
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(reportPath));
    stream.on('error', reject);
  });
};

exports.createInvoicePDF = async(orderData) => {
  let html = fs.readFileSync(path.join('utils','invoiceTemplate','index.html'), 'utf8');
  const css = fs.readFileSync(path.join('utils','invoiceTemplate','invoice.css'), 'utf8');

  html = html.replace('</head>', `<style>${css}</style></head>`);
  const fileName = `Invoice-${orderData?.invoiceNumber || 'INVOICE'}.pdf`;
  const replacements = {
    '{{LOGO_URL}}': `data:image/png;base64,${fs.readFileSync(LOGO_FILE_PATH, 'base64')}`,
    '{{CUSTOMER_NAME}}': orderData?.address?.name || 'CUSTOMER NAME',
    '{{CUSTOMER_ADDRESS}}': orderData?.address?.mainAddress2 || 'Main Address 2',
    '{{CUSTOMER_MOBILE}}': orderData?.address?.mobileNumber || 'No Mobile Number',
    '{{ORDER_NUMBER}}': orderData?.orderNumber || '000000',
    '{{INVOICE_NUMBER}}': orderData?.invoiceNumber || 'INVOICE',
    '{{INVOICE_DATE}}': new Date(orderData?.createdAt || new Date).toLocaleDateString(),
    '{{INVOICE_TIME}}': new Date(orderData?.createdAt || new Date).toLocaleTimeString(),
    '{{PRODUCT_NAME}}': orderData?.orderDetails?.productName || 'Product Name',
    '{{PRODUCT_DESCRIPTION}}': orderData?.orderDetails?.description || '',
    '{{PRODUCT_QUANTITY}}': orderData?.orderDetails?.productQuantity || 0,
    '{{PRODUCT_PRICE}}': orderData?.orderDetails?.productPrice || '0',
    '{{PRODUCT_DISCOUNT}}': orderData?.orderDetails?.productDiscount || '10',
    '{{TOTAL_PRICE}}': orderData?.orderDetails?.totalPrice || '0',
    '{{SUBTOTAL}}': orderData?.orderDetails?.productPrice || 0,
    '{{DELIVERY_FEE}}': orderData?.orderDetails?.deliveryFee || 0,
    '{{HANDLING_CHARGES}}': orderData?.orderDetails?.handlingCharges || 0,
  };

  for (const key in replacements) {
    html = html.replace(new RegExp(key, 'g'), replacements[key]);
  }

   const browser = await puppeteer.launch({
    headless: "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
    ],
  });
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });

  const pdfPath = path.join('public','uploads', fileName);
  await page.pdf({ path: pdfPath, format: 'A4', printBackground: true });

  await browser.close();

  return `${process.env.BACK_END_BASE_URL}/uploads/${fileName}`;
}