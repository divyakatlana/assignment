import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { Gateway } from '../modals/gateway.model';
import { Project } from '../modals/projects.model';
import { innerTableData, ProjectData, ReportData } from '../modals/report.model';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatTableDataSource } from '@angular/material/table';
import { DataService } from '../services/data.service';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { ApexLegend, ApexPlotOptions, ChartComponent } from "ng-apexcharts";
import {
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexChart
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  plotOptions: ApexPlotOptions;
  legend: ApexLegend;
};



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
  tableData: ReportData[] = [];
  columnsToDisplay = ['groupId', 'total'];
  innerDisplayedColumns = ['Date', 'Gateway', 'TransactionId', 'Amount'];
  expandedElement: ReportData | null;
  populateTableData: ReportData[] = [];
  selectedGatewayName: string = 'Select Gateway';
  selectedProjectName: string = 'Select Project';
  selectedGatewayId: string = '';
  selectedProjectId: string = '';
  fromDate: NgbDateStruct;
  toDate: NgbDateStruct;
  noDataFound: boolean = true;
  error: boolean = false;
  noDataFoundMsg = 'No Reports';
  noDataCaption = 'Currently you have no data for the reports to be generated. Once you start generating traffic through the Balance application the reports will be shown.';
  showChart: boolean = false;
  allProjectTotal: number = 0;
  projectAmounts: number[] = [];

  @ViewChild("chart") chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  constructor(private dataSvc: DataService,
    private cd: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.error = false;
    this.dataSvc.getAllProjects().subscribe({
      next: (project) => { this.projects = project.data; },
      error: (err) => {
        this.noDataFound = true;
        this.error = true;
        this.noDataFoundMsg = 'Unable to get Projects.'
      }
    });
    this.dataSvc.getAllGateways().subscribe({
      next: (gateway) => { this.gateways = gateway.data; },
      error: (err) => {
        this.noDataFound = true;
        this.error = true;
        this.noDataFoundMsg = 'Unable to get Gateways.'
      }
    });
  }

  onGenerateReport() {
    this.tableData = [];
    this.noDataFound = false;
    this.allProjectTotal = 0;
    this.projectAmounts = [];
    this.showChart = false;
    this.selectedProjectName = this.selectedProjectId === '' ? 'All Projects' : this.selectedProjectName;
    this.selectedGatewayName = this.selectedGatewayId === '' ? 'All Gateways' : this.selectedGatewayName;
    let fromDate = this.fromDate ? this.fromDate.year + '-' + this.fromDate.month + '-' + this.fromDate.day : '';
    let toDate = this.toDate ? this.toDate.year + '-' + this.toDate.month + '-' + this.toDate.day : '';

    this.dataSvc.getAllReports(this.selectedProjectId, this.selectedGatewayId, fromDate, toDate).subscribe(
      {
        next:
          (reportData) => {
            this.mapResponse(reportData);
          }, error: (err) => { this.noDataFound = true; this.noDataFoundMsg = 'Unable to fetch Report' }
      });
  }

  mapResponse(reportData: ProjectData) {
    let total: number = 0;
    if (reportData && reportData.data.length <= 0) {
      this.noDataFound = true;
    } else if (this.selectedProjectId === 'allProjects' || this.selectedProjectId === '') {
      this.projects.forEach(project => {
        let filteredData = reportData.data.filter(data => data.projectId === project.projectId);
        total = filteredData.reduce((accumulator, current) => accumulator + current.amount, 0);
        this.allProjectTotal = this.allProjectTotal + total;
        this.projectAmounts.push(total);
        this.tableData.push({
          'groupId': project.name,
          'total': 'TOTAL: ' + total.toFixed(2) + ' USD',
          'innerTable': filteredData
            .map(filteredReportData => {
              return {
                'Date': filteredReportData.created,
                'TransactionId': filteredReportData.paymentId,
                'Gateway': filteredReportData.gatewayId,
                'Amount': filteredReportData.amount,
              }
            })
        })
      })
      if (this.selectedGatewayId !== 'allGateways' && this.selectedGatewayId !== '') {
        this.showChart = true;
        this.generateChart(this.projects.map(project => project.name));
      }
    } else if (this.selectedGatewayId === 'allGateways' || this.selectedGatewayId === '') {
      this.gateways.forEach(gateway => {
        let filteredData = reportData.data.filter(data => data.gatewayId === gateway.gatewayId);
        total = filteredData.reduce((accumulator, current) => accumulator + current.amount, 0);
        this.allProjectTotal = this.allProjectTotal + total;
        this.projectAmounts.push(total);
        this.tableData.push({
          'groupId': gateway.name,
          'total': 'TOTAL: ' + total.toFixed(2) + ' USD',
          'innerTable': filteredData
            .map(filteredReportData => {
              return {
                'Date': filteredReportData.created,
                'TransactionId': filteredReportData.paymentId,
                'Amount': filteredReportData.amount,
              }
            })
        })
      })
      this.showChart = true;
      this.generateChart(this.gateways.map(gateway => gateway.name));

    } else {
      let filteredData = reportData.data.filter(data => data.projectId === this.selectedProjectId)
      total = filteredData.reduce((accumulator, current) => accumulator + current.amount, 0);
      this.allProjectTotal = this.allProjectTotal + total;
      this.projectAmounts.push(total);
      this.tableData.push({
        'groupId': this.selectedProjectId,
        'total': 'TOTAL: ' + total.toFixed(2) + ' USD',
        'innerTable': filteredData
          .map(filteredReportData => {
            return {
              'Date': filteredReportData.created,
              'TransactionId': filteredReportData.paymentId,
              'Gateway': filteredReportData.gatewayId,
              'Amount': filteredReportData.amount,
            }
          })
      })
    }
    this.generateTableData(this.tableData);
  }

  generateChart(labels: string[]) {
    this.chartOptions = {
      series: this.projectAmounts,
      chart: {
        type: "donut",
        width: "430px"
      },
      legend: {
        show: true,
        position: 'top',
        horizontalAlign: 'center',
        height: 45
      },
      labels: labels,
      responsive: [
        {
          breakpoint: 480
        }
      ]
    };
  }

  toggleRow(element: ReportData) {
    element.innerTable && (element.innerTable as MatTableDataSource<innerTableData>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.cd.detectChanges();
  }


  generateTableData(tableData: ReportData[]) {
    this.populateTableData = [];
    tableData.forEach(user => {
      if (user.innerTable && Array.isArray(user.innerTable) && user.innerTable.length) {
        this.populateTableData = [...this.populateTableData, { ...user, innerTable: new MatTableDataSource(user.innerTable) }];
      } else {
        this.populateTableData = [...this.populateTableData, user];
      }
    });
    this.dataSource = new MatTableDataSource(this.populateTableData);
  }

  changeSelectedGateway(selectedGatewayName: string, selectedGatewayId?: string) {
    this.selectedGatewayName = selectedGatewayName;
    this.selectedGatewayId = selectedGatewayId;
  }

  changeSelectedProject(selectedProjectName: string, selectedProjectId: string) {
    this.selectedProjectName = selectedProjectName;
    this.selectedProjectId = selectedProjectId;
  }
}
