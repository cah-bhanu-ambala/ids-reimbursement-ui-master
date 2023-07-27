import {Component, Input} from '@angular/core';
import {CustomerWorkitemService} from "../../../common/services/http/customer-workitem.service";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-facility-list',
  templateUrl: './facility.component.html'
})

export class FacilityComponent
{
  systemId: number =0;
  facilities: any[];
  @Input() form! : FormGroup;
  controlName ="intFacilityId";
  @Input() submitEvent: boolean;


  constructor( private cwiService: CustomerWorkitemService ) { }

  ngOnInit(): void {
    this.systemId = parseInt(localStorage.systemId);
    this.getFacilityList();
  }

  getFacilityList() {
    this.cwiService.getApprovedFacilities().subscribe(
      (result) => {
        this.facilities = this.systemId > 0 ?result.filter(x => x.systemId == this.systemId) : result;
        this.setDropDownVisibility();
        this.setFacilitNameObserver();
      })
  }

  setDropDownVisibility() {
    if (this.facilities.length <= 1) {
      this.form.get("intFacilityId").setValue(this.facilities[0].facilityId,  {onlySelf: true});
      this.setFacilityDetail(this.facilities[0])
      this.form.controls['intFacilityId'].disable();
    }
  }

  isInValid(): boolean{
    return this.submitEvent && this.form.controls['intFacilityId'].errors != null;
  }

  setFacilitNameObserver() {
    this.form.get('intFacilityId').valueChanges.subscribe(value => {
      let facility = this.facilities.find(s => s.facilityId == value)
      this.setFacilityDetail(facility)
    });
  }
  private setFacilityDetail(facility: any){
    this.form.get("facilityName").setValue(facility?facility.facilityName:'');
    this.form.get("facilityId").setValue(facility?facility.facilityId:0);
  }


}






