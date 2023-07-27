import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';


@Component({
  selector: 'app-assigned-dropdown',
  templateUrl: './assigned-dropdown.component.html',
  styleUrls: ['./assigned-dropdown.component.scss']
})
export class AssignedDropdownComponent implements OnInit {

  @Input() parentForm: FormGroup
  @Input() teamMembers: any[];

  constructor() { }

  ngOnInit(): void {
  }

}
