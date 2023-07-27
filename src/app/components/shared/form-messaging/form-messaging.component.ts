import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-messaging',
  templateUrl: './form-messaging.component.html',
  styleUrls: ['./form-messaging.component.scss']
})
export class FormMessagingComponent implements OnInit {

  @Input() success = false;
  @Input() innerHtml = null;

  constructor() { }

  ngOnInit(): void {
  }

}
