import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Gateways } from '../modals/gateway.model';
import { Projects } from '../modals/projects.model';
import { ProjectData } from '../modals/report.model';
import { Users } from '../modals/users.model';


const usersEndpoint = '/users';
const projetsEndpoint = '/projects';
const gatewaysEndpoint = '/gateways';
const reportsEndpoint = '/report'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  };

  // service to get all users 
  getAllUsers(): Observable<Users> {
    return this.http.get<Users>(environment.baseUrl + usersEndpoint);
  }
  // service to get all projects
  getAllProjects(): Observable<Projects> {
    return this.http.get<Projects>(environment.baseUrl + projetsEndpoint);
  }

  //service to get all gateways
  getAllGateways(): Observable<Gateways> {
    return this.http.get<Gateways>(environment.baseUrl + gatewaysEndpoint);
  }

  // service to get reports of the basis of selected prject, gateway, fromdate and todate.
  getAllReports(projectId: string, gatewayId: string, from?: string, to?: string): Observable<ProjectData> {
    return this.http.post<ProjectData>(environment.baseUrl + reportsEndpoint,
      JSON.stringify({
        'projectId': projectId === 'allProjects' ? '' : projectId
        , 'gatewayId': gatewayId === 'allGateways' ? '' : gatewayId, from, to
      }), this.httpOptions);
  }
}
