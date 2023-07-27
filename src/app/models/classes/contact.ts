export class Contact {
	contactId:number;
	contactName:string;
	contactFirstName:string;
	contactLastName: string;
	contactTypeId:number;
	contactPhone:string;
	contactFax:string;
	contactNotes:string;
	contactWebsite:string;
	active:boolean;
	createdBy:number;
	modifiedBy:number;
	status:string;
	isUpdate?:boolean;

	constructor(contact?: any) {
		Object.assign(this, contact);
	}
}