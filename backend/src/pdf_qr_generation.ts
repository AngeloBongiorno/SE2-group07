import qrcode from 'qrcode';
import { Ticket } from './models/Ticket'
import PDFDocument from 'pdfkit';
import fs from 'fs';
import * as path from 'path';

async function generateTicketPDF(ticket: Ticket): Promise<string> {
    const doc = new PDFDocument();
    
    // Path to save the PDF locally or stream to response in a real case
    const pdfPath = `./tickets/${ticket.ticket_id}.pdf`;
    doc.pipe(fs.createWriteStream(pdfPath));


    // Add ticket details
    doc.fontSize(20).text(`Ticket ID: ${ticket.ticket_id}`, 100, 100);
    doc.fontSize(16).text(`Type of service: ${ticket.service_type_id}`, 100, 150);
    doc.fontSize(16).text(`Issued at: ${ticket.issued_at.getMonth()}/${ticket.issued_at.getDate()} - ${ticket.issued_at.getHours()}:${ticket.issued_at.getMinutes()}`, 100, 180);

    // Add QR code image to the PDF
    const qr = await generateQrCode(ticket);
    doc.image(qr, {
        fit: [100, 100],
        align: 'center',
        valign: 'center',
    });
    doc.end();

    return pdfPath;
}

/*
 * Generates base64 representation of qr code 
 * It embeds link to retrieve the ticket
 */

async function generateQrCode(ticket: Ticket): Promise<string> {
    const qr = await qrcode.toDataURL(`http://127.0.0.1:3001/ticketPdfs/${ticket.ticket_id}.pdf`);
    return qr;
}

/**
 * Deletes all the ticket PDF files.
 */
function deleteTicketPdfs(): void {
    // Read the contents of the folder
    fs.readdir("./tickets/", (err, files) => {
        if (err) {
            console.error(`Error reading folder: ${err.message}`);
            return;
        }

        // Loop through each file in the folder
        files.forEach((file) => {
            const filePath = path.join("./tickets/", file);
            
            // Check if the file has a .pdf extension
            if (path.extname(file).toLowerCase() === '.pdf') {
                // Delete the file
                fs.unlink(filePath, (err) => {
                    if (err) {
                        console.error(`Error deleting file ${file}: ${err.message}`);
                    } else {
                        console.log(`Deleted PDF file: ${file}`);
                    }
                });
            }
        });
    });
}

export {generateTicketPDF, generateQrCode, deleteTicketPdfs};
