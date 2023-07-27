import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-input-modal',
  templateUrl: './input-modal.component.html',
  styleUrls: ['./input-modal.component.scss'],
})
export class InputModalComponent implements OnInit {
  @Output() confirm: EventEmitter<any> = new EventEmitter();
  @Input() label: string;
  @Input() buttonText: string;
  @Input() title: string;

  submitted = false;
  notes: string = '';
  error = false;
  maxLength: number = 1000;

  constructor(public activeModal: NgbActiveModal) {}

  ngOnInit(): void {}

  onChange(notes){
    this.notes = notes;
    this.error = this.notes == ''?  true: false;
  }

  close() {
    this.activeModal.close();
  }

  proceed() {
    if (this.notes == '') {
      this.error= true;
      return null;
    } else {
      this.error = false;
      this.confirm.emit(this.notes);
      this.activeModal.close();
    }
  }
}
