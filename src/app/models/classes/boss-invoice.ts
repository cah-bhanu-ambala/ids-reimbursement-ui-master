export class BossInvoice {
    wbsNames?: string[];
    dateOutFrom: string;
    dateOutTo: string;

    constructor(bossInvoice?: any) {
		Object.assign(this, bossInvoice);
	}
}
