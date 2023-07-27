export class Facility {
    facilityId: number;
    systemId: number;
    facilityName: string;
    facilityNickName: string;
    ein: string;
    facilityNPI: string;
    contact1: string;
    contactRole1: string;
    contact2: string;
    contactRole2: string;
    contact3: string;
    contactRole3: string;
    contact4: string;
    contactRole4: string;
    address: string;
    phone: string;
    fax: string;
    active: boolean;
    createdBy: number;
    modifiedBy: number;
    status: string;
    isUpdate?: boolean;
    facilityBillingDetails: any[];
    wbsName: string;
    facilityWbsDetails: facilityWbsDetails[];

    constructor(facility?: any) {
		Object.assign(this, facility);
	}
}
export class BillingInformation {
    facilityId: number;
    facilityBillingDetailId: number;
    billingLevelId: number;
    facilityBillingLevelName: string;
    billingAmount: number;

    constructor(billingInformation?: any) {
		Object.assign(this, billingInformation);
	}

}

export class facilityWbsDetails {
    createdBy: number;
    modifiedBy: number;
    wbsName: string;
    contractStartDate: Date;
    contractEndDate: Date;
    facilityId: number;
    wbsId: number;

    constructor(facilitywbsdetails?: any) {
		Object.assign(this, facilitywbsdetails);
	}
}


