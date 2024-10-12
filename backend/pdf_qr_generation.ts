import qrcode from 'qrcode';
import { Ticket } from './src/models/Ticket';
import PDFDocument from 'pdfkit';
import fs from 'fs';

async function generateTicketPDF(ticket: Ticket): Promise<string> {
    const doc = new PDFDocument();
    
    // Path to save the PDF locally or stream to response in a real case
    const pdfPath = `./tickets/${ticket.ticket_id}.pdf`;
    doc.pipe(fs.createWriteStream(pdfPath));

    // Add ticket details
    doc.fontSize(20).text(`Ticket ID: ${ticket.ticket_id}`, 100, 100);
    doc.fontSize(16).text(`Type of service: ${ticket.service_type_id}`, 100, 150);
    doc.fontSize(16).text(`Issued at: ${ticket.issued_at}`, 100, 180);

    // Generate QR code that links to your backend's download endpoint
    //const qrCodeData = await qrcode.toDataURL(`https://your-backend.com/download/${ticket.ticket_id}`);
    
    // Add QR code image to the PDF
    /*
    doc.image(qrCodeData, {
        fit: [100, 100],
        align: 'center',
        valign: 'center',
    });
    */
    // Finalize PDF file
    doc.end();

    return pdfPath;
}

/*
 *
 * backend should generate a pdf containing ticket info and associated link
 * link should be embedded in qrcode
 */

async function generateQrCode(ticket: Ticket): Promise<string> {
    const qr = await qrcode.toDataURL(`http://127.0.0.1:3001/tickets/${ticket.ticket_id}`);
    return qr;
}

export {generateTicketPDF, generateQrCode};
