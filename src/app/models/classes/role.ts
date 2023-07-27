import { Menu } from "./menu";

export class Role {
    userRoleId: number;
    userRoleName: string;
    roleDescription: string;
    roleMenus : Menu[];

    constructor(role?: any) {
		Object.assign(this, role);
	}
}
