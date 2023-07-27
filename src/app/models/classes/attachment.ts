export class Attachment {
    createdBy:number;
    modifiedBy:number;
    files:FormData;
    advocacyId:number;

    constructor(attachment?: any) {
		Object.assign(this, attachment);
	}
}