import { Injectable, ViewContainerRef } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { Observable, Subject } from 'rxjs';
import { ConfirmLeaveModalComponent } from 'src/app/components/shared/confirm-leave-modal/confirm-leave-modal.component';

interface IDirty {
  isDirty: boolean;
  getRef: ViewContainerRef;
}

@Injectable({
  providedIn: 'root'
})

@Injectable()
export class DirtyCheckGuard implements CanDeactivate<IDirty> {

  constructor(
    private modalService: BsModalService   
  ) { }

  canDeactivate(component: IDirty): Observable<boolean> | Promise<boolean> | boolean {
    let canLeave: boolean = component.isDirty;   
    if (canLeave) {
      const subject = new Subject<boolean>();

      const modal = this.modalService.show(ConfirmLeaveModalComponent, { 'class': 'modal-dialog-primary' });
      modal.content.subject = subject;

      this.modalService.onHide.subscribe(hide => {
        subject.next(false);
        return subject.asObservable();
      });

      return subject.asObservable();
    }

    return true;
  }
}