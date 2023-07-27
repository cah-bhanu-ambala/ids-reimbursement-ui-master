import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-leave-modal',
  templateUrl: './confirm-leave-modal.component.html',
  styleUrls: ['./confirm-leave-modal.component.scss']
})

export class ConfirmLeaveModalComponent implements OnInit {

  subject: Subject<boolean>;

  constructor(public bsModalRef: BsModalRef) { }

  action(value: boolean) {
    this.bsModalRef.hide();
    this.subject.next(value);
    this.subject.complete();
  }

  ngOnInit(): void {
  }

}