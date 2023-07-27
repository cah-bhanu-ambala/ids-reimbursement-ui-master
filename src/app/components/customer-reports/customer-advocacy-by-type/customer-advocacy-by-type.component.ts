import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { CustomerReportsService } from 'src/app/common/services/http/customer-reports.service';
import { ReportsService } from 'src/app/common/services/http/reports.service';
import html2canvas from 'html2canvas';
import * as pdfMake from "pdfmake/build/pdfmake";

@Component({
  selector: 'app-customer-advocacy-by-type',
  templateUrl: './customer-advocacy-by-type.component.html',
  styleUrls: ['./customer-advocacy-by-type.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CustomerAdvocacyByTypeComponent implements OnInit {

  reportsForm: FormGroup;
  searched: boolean;
  showChart: boolean;
  showError: boolean;
  userId: number = 1;
  facilitiesList: any[];
  customerFacilityId: number;
  customerFacilityName: string;

  single: any[];
  view: any[] = [800, 400];

  // options
  gradient: boolean = true;
  showLegend: boolean = true;
  showLabels: boolean = true;
  isDoughnut: boolean = false;
  legendPosition: string = 'below';
  advocacyTypedata: any[] = [];
  xAxisLabel = 'Advocacy Request Status';

  docDefinitionByType: any;

  colorScheme = {
    domain: ['#5AA454', '#A10A28', '#add8e6', '#ff4500']
  };

  constructor(
    private formBuilder: FormBuilder,
    private custReportsService: CustomerReportsService,
    private reportsService: ReportsService,
    private change: ChangeDetectorRef,
    private toastr: ToastrService
  ) {

  }

  ngOnInit(): void {
    this.buildSearchForm();
    this.change.markForCheck();
  }

  ngAfterContentChecked() {
    this.change.detectChanges();
  }

  buildSearchForm() {
    this.reportsForm = this.formBuilder.group({
      facilityId: 0,
      facilityName: { value: '', disabled: true },
      dateCreatedFrom: ['', Validators.compose([Validators.required])],
      dateCreatedTo: ['', Validators.compose([Validators.required])],
      intFacilityId: ['', Validators.compose([Validators.required])]
    });
  }

  get sf() {
    return this.reportsForm != null ? this.reportsForm.controls : null;
  }


  getReportsData() {
    if (this.reportsForm.invalid) {
      this.searched = true;
      return false;
    }
    else {
      this.showChart = false;
      this.searched = false;
      var advocacyTypedata = [];
      let selectedDateFrom = this.reportsForm.value.dateCreatedFrom;
      let selectedDateTo = this.reportsForm.value.dateCreatedTo;

      let formattedDateFrom = selectedDateFrom != null ? moment(selectedDateFrom).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;
      let formattedDateTo = selectedDateTo != null ? moment(selectedDateTo).subtract(1, 'M').format('MM/DD/YYYY').toString() : null;

      let params = {
        facilityId: this.reportsForm.get('intFacilityId').value ,
        dateOutFrom: formattedDateFrom,
        dateOutTo: formattedDateTo
      };
      this.showChart = false;
      this.custReportsService.getAdvocacyOrderTypeReport(params).subscribe(resp => {
        if (resp.details.length > 0) {
          this.showChart = true;
          //console.log(resp);
          resp.details.forEach(element => {
            advocacyTypedata.push({ 'name': element.name, 'value': element.count });
          });
          Object.assign(this, { advocacyTypedata });
        }
        else {
          this.showChart = false;
          this.showError = true;
        }

      })

    }
  }

  downloadChart() {
    this.loadChartForExport();
  }

  loadChartForExport() {
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
        const chartDataByType = canvas.toDataURL();
        // Prepare pdf structure
        const docDefinitionByType = {
          content: [],
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
        docDefinitionByType.content.push({ image: chartDataByType, width: 500 });
        this.docDefinitionByType = docDefinitionByType;
        if (this.docDefinitionByType) {
          pdfMake.createPdf(this.docDefinitionByType).download('customer-advocacy-by-type' + '.pdf');
        } else {
          console.log('Chart is not yet rendered!');
        }
      });
    }, 1100);

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

  showSuccess(msg) {
    this.toastr.success(msg);
  }

  showFailure(msg) {
    this.toastr.error(msg);
  }
}
