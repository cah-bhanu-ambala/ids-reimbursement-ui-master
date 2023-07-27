import { Component, ContentChild, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'app-login-template',
  templateUrl: './login-template.component.html',
  styleUrls: ['./login-template.component.scss']
})
export class LoginTemplateComponent implements OnInit {

  @ContentChild(TemplateRef, { static: false}) contentTemplate: TemplateRef<any>;

  constructor() { }

  ngOnInit(): void {
  }

}
