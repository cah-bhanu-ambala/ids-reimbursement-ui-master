export class Menu {
    menuId: number;
    mainMenu: string;
    subMenu: string;
    url: string;

    constructor(menu?: any) {
		Object.assign(this, menu);
	}
}
