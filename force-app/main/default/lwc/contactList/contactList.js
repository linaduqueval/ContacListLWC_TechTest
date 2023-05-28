import { LightningElement, wire, api, track } from 'lwc';
import queryContLst from '@salesforce/apex/contacListHandler.queryContLst';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const columns = [
    { label: 'Name', fieldName: 'FirstName' , fixedWidth: 160},
    { label: 'Last Name', fieldName: 'LastName', fixedWidth: 160 },
    { label: 'Email', fieldName: 'Email', type: 'email'},
    { label: 'Phone', fieldName: 'Phone', type: 'phone'},
];

export default class ContactList extends LightningElement {
    error;
    contactData;
    columns = columns;

    currentPage = 1;
    pageSize = 5;
    totalContacts;
    totalPages;
    recordsToDisplay = [];
    disablenext;
    disableprevious;

    get pageOptions() {
        return [
            { label: '5', value: '5' },
            { label: '10', value: '10' },
            { label: '20', value: '20' },
        ];
    }


    @wire(queryContLst)
    wiredContactLst({error, data}){
        if(data){
            this.contactData = data;
            this.totalContacts = this.contactData.length;
            this.error = undefined;
            this.showSuccessToast();
            this.paginationHandler();
        } else if(error){
            this.error = error;
            this.contactData = undefined;
            this.showErrorToast();
        }
    }

    showSuccessToast() {
        const e = new ShowToastEvent({
            title: 'Success',
            message: 'Contact datatable loaded successfully!',
            variant: 'success',
            mode: 'pester'
        });
        this.dispatchEvent(e);
    }

    showErrorToast() {
        const e = new ShowToastEvent({
            title: 'Error',
            message: 'Unexpected error occured. Contact info did not load correctly.',
            variant: 'error',
            mode: 'sticky'
        });
        this.dispatchEvent(e);
    }

    previousPage() {
        this.currentPage = this.currentPage - 1;
        this.paginationHandler();
    }

    disPrevious() {
        if(this.currentPage == 1){
            this.disablenext = true;
        } else{
            this.disablenext = false;
        }
    }

    nextPage() {
        this.currentPage = this.currentPage + 1;
        this.paginationHandler();
    }

    disNext() {
        if(this.currentPage == this.totalPages){
            this.disableprevious = true;
        } else{
            this.disableprevious = false;
        }
    }

    paginationHandler(){
        this.recordsToDisplay = [];
        this.totalPages = Math.ceil(this.totalContacts / this.pageSize);
        if (this.currentPage <= 1) {
            this.currentPage = 1; 
        } else if (this.currentPage >= this.totalPages) {
            this.currentPage = this.totalPages;
        }
        for (let i = (this.currentPage - 1) * this.pageSize; i < this.currentPage * this.pageSize; i++) {
            if (i === this.totalContacts) {
                break;
            }
            this.recordsToDisplay.push(this.contactData[i]);
        }
        this.disPrevious();
        this.disNext();
    }

    handleChange(e) {
        this.value = e.detail.value;
        this.pageSize = this.value;
        this.paginationHandler();
    }
}