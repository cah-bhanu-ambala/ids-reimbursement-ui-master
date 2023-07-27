export class DrugOrProc {
	drugProcCode:string;
	drugId:number;
	shortDesc: string;
	longDesc:string;
	brandName:string;
	genericName:string;
	lcd:string;
	notes:string;
	active:boolean;
	createdBy:number;
	modifiedBy:number;

	constructor(drugOrProc?: any) {
		Object.assign(this, drugOrProc);
	}
}