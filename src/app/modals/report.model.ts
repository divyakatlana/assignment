import { MatTableDataSource } from "@angular/material/table";

export class ProjectData {
 data: ProjectReport[];
}


export class ProjectReport {
    paymentId: string;
    amount: number;
    projectId: string;
    gatewayId: string;
    userIds: string[];
    modified: string;
    created: string;
    
}

export class ReportData{
    groupId: string;
    total?: string;
    innerTable: innerTableData[] | MatTableDataSource<innerTableData>
}


export class innerTableData{
    Date: string;
    TransactionId: string;
    Amount: number;
    Gateway?: string;
}

export class Report{
    reportData: ReportData[]
}

export class FormValues{
projectId: string;
gatewayId: string;
fromDate: Date;
toDate: Date;
}



