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
    total?: number;
    innerTable: innerTableData[] | MatTableDataSource<innerTableData>
}


export class innerTableData{
    created: string;
    paymentId: string;
    amount: number;
    gatewayId?: string;
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



