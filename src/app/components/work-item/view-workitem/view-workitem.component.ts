
import { ChangeDetectorRef, Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { NavigationExtras, Router} from '@angular/router';
import { WorkitemService } from 'src/app/common/services/http/workitem.service';
import { LazyLoadEvent } from 'primeng/api';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-view-workitem',
  templateUrl: './view-workitem.component.html',
  styleUrls: ['./view-workitem.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ViewWorkitemComponent implements OnInit {
  @ViewChild('viewWiTable') viewWiTable: Table;
  
  wiSearchResult: any;
  showViewWorkItemGrid: boolean = false;
  wiDatasource: any;
  wiTotalRecords: any;
  wiSearchParams: any;
  workItemsloading: boolean;
  showWorkItem: boolean = false;
  showError: boolean;

  constructor(
     private wiService: WorkitemService
    , private change: ChangeDetectorRef
    , private router: Router
  ) { }

  ngOnInit(): void {
    this.wiSearchParams = {
      "pageSize": 5,
      "pageNum": 0,
      "orderBy": ["workItemId -1"]
    };
    this.onSearch('');
  }

  ngAfterViewChecked() {
    this.change.detectChanges();
  }

  updateTable() {
    this.workItemsloading = true;
    this.wiService.getWorkItemsPage(this.wiSearchParams).subscribe(result => {
      this.wiDatasource = result.content;
      this.wiTotalRecords = result.totalElements;
      this.workItemsloading = false;
    })
  }

  onSearch(val) {
    this.showViewWorkItemGrid = false;
    this.showError = false;
    this.wiSearchParams.viewSearchParam = val;

    this.showViewWorkItemGrid = true;
    if(this.viewWiTable) {
      this.viewWiTable.reset();
    }
  }


  viewLoadWiDetails(event: LazyLoadEvent) {
    this.wiSearchParams.pageNum = event.first/event.rows;
    this.wiSearchParams.pageSize = event.rows;

    this.updateTable();
  }

  onView(workItemId) {
    let params: NavigationExtras = {
      queryParams: {
        "workItemNumber": workItemId,
        "viewOnly": true
      }
    }
    this.router.navigate(['/dashboard/workmenu/editWorkItem'], params);
  }
}

