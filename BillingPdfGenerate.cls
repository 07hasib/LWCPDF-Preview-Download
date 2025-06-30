public with sharing class BillingPdfGenerate {
    @AuraEnabled
    public static String generatePDF(String accountId) {
        try {
            Account acc = [SELECT Id, Name, BillingStreet, BillingCity, BillingState, BillingPostalCode, BillingCountry 
                           FROM Account WHERE Id = :accountId LIMIT 1];

            PageReference pdfPage = Page.BillingPdfTemplate;
            pdfPage.getParameters().put('accountId', accountId);
            pdfPage.getParameters().put('accountName', acc.Name);
            pdfPage.getParameters().put('billingStreet', acc.BillingStreet);
            pdfPage.getParameters().put('billingCity', acc.BillingCity);
            pdfPage.getParameters().put('billingState', acc.BillingState);
            pdfPage.getParameters().put('billingPostalCode', acc.BillingPostalCode);
            pdfPage.getParameters().put('billingCountry', acc.BillingCountry);

            Blob pdfBlob = pdfPage.getContentAsPDF();

            Attachment pdfAttachment = new Attachment();
            pdfAttachment.Name = 'GeneratedPDF.pdf';
            pdfAttachment.Body = pdfBlob;
            pdfAttachment.ParentId = accountId;
            insert pdfAttachment;

            return EncodingUtil.base64Encode(pdfBlob);
        } catch (QueryException e) {
            throw new AuraHandledException('No Account record found with the provided ID.');
        } catch (Exception e) {
            throw new AuraHandledException('An unexpected error occurred: ' + e.getMessage());
        }
    }
}