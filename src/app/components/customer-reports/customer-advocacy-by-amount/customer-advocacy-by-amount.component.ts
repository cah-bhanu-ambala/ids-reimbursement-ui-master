import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CustomerReportsService } from 'src/app/common/services/http/customer-reports.service';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import html2canvas from 'html2canvas';
import * as pdfMake from 'pdfmake/build/pdfmake'

@Component({
  selector: 'app-customer-advocacy-by-amount',
  templateUrl: './customer-advocacy-by-amount.component.html',
  styleUrls: ['./customer-advocacy-by-amount.component.scss']
})

export class CustomerAdvocacyByAmountComponent implements OnInit {

  reportsForm: FormGroup;
  searched: boolean;
  showChart: boolean;
  showError: boolean;
  userId: number = 1;


  single: any[];
  view: any[] = [800, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  advocacyTypedata: any[] = [];
  showXAxis = true;
  showYAxis = true;
  showXAxisLabel = true;
  facilitiesList: any[];
  // customerFacilityId: number;
  // customerFacilityName: string;
  docDefinition: any;
  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#add8e6', '#ff4500']
  };

  constructor(
    private formBuilder: FormBuilder,
    private reportsService: ReportsService,
    private change: ChangeDetectorRef,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.buildSearchForm();
    this.change.markForCheck();
    this.userId = parseInt(localStorage.getItem("userId"));
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.reportsForm = this.formBuilder.group({
      facilityIds: 0,
      facilityId: 0,
      facilityName: {value:'', disabled: true},
      dateCreatedFrom: ['', Validators.compose([Validators.required])],
      dateCreatedTo: ['', Validators.compose([Validators.required])],
      intFacilityId: ['', Validators.compose([Validators.required])]
    });
  }

  // getFacilityList() {
  //   this.reportsService.getAllFacilities().subscribe(
  //     (result) => {
  //       this.facilitiesList = result;
  //     }
  //   );
  // }

  get sf() {
    return this.reportsForm != null ? this.reportsForm.controls : null;
  }

  getAdvocacyIdentifiedReport() {
    this.showChart = false;
    let selectedDateFrom = this.reportsForm.value.dateCreatedFrom;
    let selectedDateTo = this.reportsForm.value.dateCreatedTo;
    let formattedDateFrom = selectedDateFrom != null ? moment(selectedDateFrom).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;
    let formattedDateTo = selectedDateTo != null ? moment(selectedDateTo).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;
    let params = {
      advocacyTypeIds: [1,2,3,4,5,6,7,8,9,10,11,12],     
      facilityIds: this.reportsForm.get('intFacilityId').value,
      dateCreatedFrom: formattedDateFrom,
      dateCreatedTo: formattedDateTo,
      userId: this.userId
    };

    if (this.reportsForm.invalid) {
      this.showError = true;
      // this.showFailure('Please select any advocacy type, facility, valid date created from or date created to')
      this.searched = true;
      this.showChart = false;
      return false;
    }
    else {
      //this.showError = false;
      this.showChart = true;
      var advocacyTypedata = [];
      this.reportsService.getAdvocacyAlalysisDetails(params).subscribe(resp => {
        if (resp.details.length > 0) {
          resp.details.forEach(element => {
            advocacyTypedata.push({ 'name': element.name, 'value': element.amount });
            Object.assign(this, { advocacyTypedata });
          });
        }
        else {
          this.showError = true;
          this.showChart = false;
        }

      });
    }
  }

  formatDataLabel(value )
  {
    return '$' + value;
  }

  onReset() {
    this.reportsForm.patchValue({
      dateCreatedFrom: null,
      dateCreatedTo: null
    });
    this.showChart = false;
    this.showError = false;
    this.searched = false;
  }

  downloadChart() {
    this.loadChartForExport();
  }

  loadChartForExport(){
    setTimeout(() => {
      // Charts are now rendered
      const chart = document.getElementById('chart');
      html2canvas(chart, {
        height: 500,
        width: 1000,
        scale: 3,
        backgroundColor: null,
        logging: false,
        onclone: (document) => {
          document.getElementById('chart').style.visibility = 'visible';
        }
      }).then((canvas) => {
        // Get chart data so we can append to the pdf
        const chartData = canvas.toDataURL();
        // Prepare pdf structure
        const docDefinition = { content: [],
        styles: {
          tableHeader: {
            bold: true,
            fontSize: 13,
            color: 'black'
          },
          subheader: {
            fontSize: 16,
            bold: true,
            margin: [0, 10, 0, 5],
            alignment: 'left'
          },
          subsubheader: {
            fontSize: 12,
            italics: true,
            margin: [0, 10, 0, 25],
            alignment: 'left'
          },
          table: {
            margin: [0, 5, 0, 15]
          }
        },
        defaultStyle: {
          // alignment: 'justify'
        },
        pageOrientation: 'landscape',
      };
        docDefinition.content.push({image: chartData, width: 500});
        this.docDefinition = docDefinition;      
        if (this.docDefinition) {
          pdfMake.createPdf(this.docDefinition).download('customer-advocacy-by-amount' + '.pdf');
      } else {
        console.log('Chart is not yet rendered!');
      }
      });
    }, 1100);

  }

  showSuccess(msg) {
    this.toastr.success(msg);
  }

  showFailure(msg) {
    this.toastr.error(msg);
  }
}
