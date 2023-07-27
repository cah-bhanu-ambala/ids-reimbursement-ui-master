export class Diagnosis {
    icdCode:string;
    icdId:number;
    description:string;
    icdDescription: string;
    active:boolean;
    longDesc:string;
    organ:string;
    diagnosis:string;
    createdBy:number;
    modifiedBy:number;

    constructor(diagnosis?: any) {
		Object.assign(this, diagnosis);
	}
}
