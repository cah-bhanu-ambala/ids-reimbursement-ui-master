import { Diagnosis } from './diagnosis';
import { DrugOrProc } from './drug-or-proc';

export class WorkItem {
	workItemId:number;
	facilityBillingTypeId:number;
	billingLevelId:number;
	facilityId:number;
	referralNumber:string;
	providerId:number;
	patientId:number;
	orderDate:Date;
	notes:string;
	active:boolean;
	createdBy:number;
	modifiedBy:number;
	status:string;
	drugCodes:Array<DrugOrProc>;
	icdCodes:Array<Diagnosis>;

	constructor(workItem?: any) {
		Object.assign(this, workItem);
	}
}
export class Attachment {
    createdBy:number;
    modifiedBy:number;
    files:FormData;
    workItemId:number;
}