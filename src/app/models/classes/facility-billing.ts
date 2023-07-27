export class FacilityBilling {
    wbsNames?: string[];
    dateOutFrom: string;
    dateOutTo: string;

    constructor(facilityBilling?: any) {
		Object.assign(this, facilityBilling);
	}
}
