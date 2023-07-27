export class Advocacy {
	patientMrn: string;
	facilityId: number;
	advocacyStatusId: number;
	advocacyTypeId: number;
	advocacySource: string;
	icdCode: string;
	icdDescription: string;
	drugProcCode: string;
	drugId: number;
	startDate: any;
	endDate: any;
	maxAmountAvail: number;
	lookBack: string;
	lookBackStartDate: any;
	notes: string;
	active: boolean;
	advocacyId: number;
	createdBy: number;
	patientId: number;
	facilityName: string;
	icdId: number;
	workItemId: number;
	attachments: any;
	drugAdvocacyId?: number;
	drugAdvocacyWebsites?: any;
	drugAdvocacy?: any;
	advocacySources?: any;
  followUpNotification?:any;

	constructor(advocacy?: any) {
		Object.assign(this, advocacy);
	}
}

