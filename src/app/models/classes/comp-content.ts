import { ComponentFactoryResolver, ViewContainerRef } from "@angular/core";

export abstract class CompContent {

    constructor(protected componentFactoryResolver: ComponentFactoryResolver) { }

    /**
     * Dynamically create component to container reference
     * @param dynamicComponent Component to be created
     * @param viewContainerRef View Contianer Reference
     * @param callback Callback to interact with created component
     */
    protected resolveComp(dynamicComponent: any, viewContainerRef: ViewContainerRef, callback?: (comp: any) => void): void {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory<any>(dynamicComponent);

        viewContainerRef.clear();

        const component = viewContainerRef.createComponent(componentFactory);

        if (callback) {
            callback(component);
        }
    }
}
