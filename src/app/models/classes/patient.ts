export class Patient {
	patientId:number;
	contactStatusId:number;
	facilityId:number;
	facilityName:string;
	firstContactDate:Date;
	firstContactOutcome:number;
	householdSize:number;
	mrn:string;
	notes:string;
	primaryInsuranceId:number;
	proofOfIncome:number;
	secondContactDate:Date;
	secondContactOutcome:number;
	secondaryInsuranceId:number;
	thirdContactDate:Date;
	thirdContactOutcome:number;
	active:boolean;
	createdBy:number;
	modifiedBy:number;
	status:string;
	isUpdate?:boolean;

	constructor(patient?: any) {
		Object.assign(this, patient);
	}
}