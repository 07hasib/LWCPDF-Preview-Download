import { LightningElement, api, track } from 'lwc';
import generatePDF from '@salesforce/apex/BillingPdfGenerate.generatePDF';

export default class PdfGeneratorLWC extends LightningElement {
    @api recordId;
    @track pdfGenerated = false;
    @track error;
    pdfBase64;

    connectedCallback() {
        console.log('recordId from connectedCallback:', this.recordId);
    }

    async handleGeneratePdf() {
        this.pdfGenerated = false;
        this.error = null;

        try {
            console.log('Generating PDF for recordId:', this.recordId);
            this.pdfBase64 = await generatePDF({ accountId: this.recordId }); 
            this.pdfGenerated = true;

            this.previewPdf();
        } catch (error) {
            console.error('Error generating PDF:', error);
            this.error = 'An error occurred while generating the PDF: ' + (error.body ? error.body.message : error.message);
        }
    }

    previewPdf() {
        if (!this.pdfBase64) {
            this.error = 'No PDF available to preview.';
            return;
        }

        const byteCharacters = atob(this.pdfBase64);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        const pdfBlob = new Blob(byteArrays, { type: 'application/pdf' });

        const pdfUrl = URL.createObjectURL(pdfBlob);
        window.open(pdfUrl, '_blank');
    }

    handleDownloadPdf() {
        if (!this.pdfBase64) {
            this.error = 'No PDF available for download.';
            return;
        }

        const byteCharacters = atob(this.pdfBase64);
        const byteArrays = [];
        
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }
            byteArrays.push(new Uint8Array(byteNumbers));
        }

        const pdfBlob = new Blob(byteArrays, { type: 'application/pdf' });
        
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(pdfBlob);
        downloadLink.download = 'GeneratedPDF.pdf';
        downloadLink.click();
    }
}