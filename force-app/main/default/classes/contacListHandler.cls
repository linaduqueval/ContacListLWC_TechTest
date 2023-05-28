public with sharing class contacListHandler {

    @AuraEnabled(cacheable=true)
    public static List<Contact> queryContLst(){
        List<Contact> contactLst = [SELECT Id, FirstName, LastName, Email, Phone FROM Contact];

        return contactLst;
    }

}