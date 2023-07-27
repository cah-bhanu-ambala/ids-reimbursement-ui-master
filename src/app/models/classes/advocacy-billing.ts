export class AdvocacyBilling {
    wbsNames?: string[];
    dateOutFrom: string;
    dateOutTo: string;

    constructor(advocacyBilling?: any) {
		Object.assign(this, advocacyBilling);
	}
}
