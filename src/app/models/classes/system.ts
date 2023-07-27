export class System {
    systemId: number;
    systemName: string;

    active: boolean;
    createdBy: number;
    modifiedBy: number;
    status: string;


    constructor(system?: any) {
		Object.assign(this, system);
	}
}



