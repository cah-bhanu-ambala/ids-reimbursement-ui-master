import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.scss']
})
export class ConfirmModalComponent implements OnInit {

  @Output() delete : EventEmitter<any> = new EventEmitter();
  @Input() textMessage:string;
  @Input() needConfirm: boolean = false;
  confirmDelete: FormControl;

  constructor( public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
    this.confirmDelete = new FormControl("", [Validators.required, Validators.pattern("DELETE")]);
  }
  Close()
  {
    this.activeModal.close();
  }
  Delete()
  {
    this.delete.emit();
    this.activeModal.close();
  }
}
