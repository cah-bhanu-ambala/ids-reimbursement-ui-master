export class Provider {
	providerId:number;
	provider:string;
	npi:string;
	active:boolean;
	createdBy:number;
	modifiedBy:number;
	status:string;
	isUpdate?:boolean;

	constructor(provider?: any) {
		Object.assign(this, provider);
	}
}