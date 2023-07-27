import { Role } from "./role";

export class User {
	userId: number;
	userName: string;
	firstName: string;
	lastName: string;
	userEmail: string;
	teamLeadId: number;
	createdBy: number;
	active: boolean;
	createdDate: Date;
	modifiedBy: number;
	modifiedDate: Date;
	userRoleId: number;
	reportingTo: string;
	facilityId: string;
	systemId: string;
	facilityName: string;
	password: string;
	token?: string;
	userRole: Role

  constructor(user?: any) {
      Object.assign(this, user);
  }

}
