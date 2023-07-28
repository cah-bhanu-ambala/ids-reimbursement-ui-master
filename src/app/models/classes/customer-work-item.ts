import { Diagnosis } from './diagnosis';
import { DrugOrProc } from './drug-or-proc';

export class CustomerWorkItem {
	patientMrn: string;
	providerId: number;
	facilityId: number;
	customerWorkItemId: number;
	workItemStatusId: number;
	dos: Date;
	active: boolean;
	createdBy: number;
	modifiedBy: number;
	notes: string;
	drugCodes: Array<DrugOrProc>;
	icdCodes: Array<Diagnosis>;

	patientId: number;
	status: string;

	facilityBillingTypeId: number;
	billingLevelId: number;
	referralNumber: string;

	internalWorkItemId: number;
	attachments: any;
	constructor(customerWorkItem?: any) {
		Object.assign(this, customerWorkItem);
	}
}
