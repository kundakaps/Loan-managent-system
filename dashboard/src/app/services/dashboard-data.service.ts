import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardDataService {

  constructor(private  http: HttpClient) { }
  base_url='https://traveller-api.kapakalatech.com'

  public getDashboardData(companyId:any){
    let id =companyId.toString()
     return this.http.get(this.base_url+'/api/companies/dashboardData/get/'+id)

   }
}
