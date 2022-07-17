import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Gateway } from '../modals/gateway.model';
import { Project } from '../modals/projects.model';
import { FormValues, innerTableData, Report, ReportData } from '../modals/report.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';


import { DataService } from '../services/data.service';
import { DatePipe } from '@angular/common';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ReportsComponent implements OnInit {
  dataSource: MatTableDataSource<ReportData>;
  projects: Project[] = [];
  gateways: Gateway[] = [];
  selectedProject: string = '';
  selectedGateway: string = '';
  selectionform: FormGroup;
  tableData: ReportData[] = [];
  formValues: FormValues;
  columnsToDisplay = ['groupId', 'total'];
  innerDisplayedColumns = ['created', 'gatewayId', 'paymentId', 'amount'];
  expandedElement: ReportData | null;
  populateTableData: ReportData[] =[];
  selectedGatewayValue: string = 'Select Gateway';
  selectedProjectValue: string = 'Select Project';
  fromDate:  NgbDateStruct;
  toDate: NgbDateStruct;

  constructor(private dataSvc: DataService,
    private formBuilder: FormBuilder,
    private cd: ChangeDetectorRef,
    private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.selectionform = this.formBuilder.group({
      projectId: ['', Validators.required],
      gatewayId: ['', Validators.required],
      fromDate: [''],
      toDate: ['']
    });

    this.dataSvc.getAllUsers().subscribe((data) => console.log('all users', data.data[0]));
    this.dataSvc.getAllProjects().subscribe(project => {
      console.log('All projects', project.data);
      this.projects = project.data;
    });
    console.log('project names', this.projects);
    this.dataSvc.getAllGateways().subscribe(gateway => {
      console.log('All gateways', gateway.data);
      this.gateways = gateway.data;
    });
    console.log('project names', this.gateways);
  }


  onFormSubmit() {
    this.tableData = [];
    if (this.selectionform.invalid) {
      return;
    }
    else {
      this.formValues = this.selectionform.value;
   let  fromDate= this.datePipe.transform(this.formValues.fromDate,'yyyy-MM-dd');
   let toDate = this.datePipe.transform(this.formValues.toDate,'yyyy-MM-dd');
      console.log('form value', this.formValues);
      this.dataSvc.getAllReports(this.formValues, fromDate, toDate).subscribe(reportData => {

        if (this.formValues.projectId === 'allProjects') {

          this.projects.forEach(project => {
            this.tableData.push({
              'groupId': project.projectId,
              'innerTable': reportData.data.filter(data => data.projectId === project.projectId)
                .map(filteredReportData => {
                  return {
                    'created': filteredReportData.created,
                    'paymentId': filteredReportData.paymentId,
                    'gatewayId': filteredReportData.gatewayId,
                    'amount': filteredReportData.amount,
                  }
                })
            })
          })
        }else if (this.formValues.gatewayId === 'allGateways') {
          this.gateways.forEach(gateway => {
            this.tableData.push({
              'groupId': gateway.gatewayId,
              'innerTable': reportData.data.filter(data => data.gatewayId === gateway.gatewayId)
                .map(filteredReportData => {
                  return {
                    'created': filteredReportData.created,
                    'paymentId': filteredReportData.paymentId,
                    'amount': filteredReportData.amount,
                  }
                })
            })
          })
        } else {
          this.tableData.push({
            'groupId': this.formValues.projectId,
            'innerTable': reportData.data.filter(data => data.projectId === this.formValues.projectId)
              .map(filteredReportData => {
                return {
                  'created': filteredReportData.created,
                  'paymentId': filteredReportData.paymentId,
                  'gatewayId': filteredReportData.gatewayId,
                  'amount': filteredReportData.amount,
                }
              })
          })
        }
        console.log('my table data ', this.tableData);
      this.generateTableData(this.tableData);
      });
    }
  }


  toggleRow(element: ReportData) {
    element.innerTable && (element.innerTable as MatTableDataSource<innerTableData>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
   // this.innerTable.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[index]);
  }


  generateTableData(tableData: ReportData[]){
    tableData.forEach(user => {
      if (user.innerTable && Array.isArray(user.innerTable) && user.innerTable.length) {
        this.populateTableData = [...this.populateTableData, {...user,  innerTable: new MatTableDataSource(user.innerTable)}];
      } else {
        this.populateTableData = [...this.populateTableData, user];
      }
    });
    this.dataSource = new MatTableDataSource(this.populateTableData);
    console.log('data source data', this.dataSource)
   // this.dataSource.sort = this.sort;
  }
  changeSelectedGateway(selectedValue: string){
 this.selectedGatewayValue = selectedValue;
 this.selectionform.setValue({gatewayID:selectedValue});
  }

  changeSelectedProject(selectedValue: string){
    this.selectedProjectValue = selectedValue;
    this.selectionform.setValue({projectID:selectedValue});
  }
}
