import qrcode from 'qrcode';


/*
 *
 * backend should generate a pdf containing ticket info and associated link
 * link should be embedded in qrcode
 */

async function generateQrCode(ticketNumber: number): Promise<string> {
    const qr = await qrcode.toDataURL(ticketNumber.toString());
    return qr;
}

export {generateQrCode};
