public with sharing class LwcPdfGenerateControllers {
    public Account account { get; private set; }

    public LwcPdfGenerateControllers() {
        String accountId = ApexPages.currentPage().getParameters().get('accountId');
        if (accountId != null) {
            String query = buildQueryForAccount(accountId);
            account = Database.query(query);
        }
    }

    private String buildQueryForAccount(String accountId) {
        Map<String, Schema.SObjectField> accountFields = Schema.SObjectType.Account.fields.getMap();
        List<String> fieldNames = new List<String>();
        
        for (String fieldName : accountFields.keySet()) {
            fieldNames.add(fieldName);
        }

        String query = 'SELECT ' + String.join(fieldNames, ',') + ' FROM Account WHERE Id = :accountId LIMIT 1';
        return query;
    }
}