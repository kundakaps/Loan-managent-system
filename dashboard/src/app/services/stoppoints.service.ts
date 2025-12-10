import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StoppointsService {

  constructor(private http: HttpClient) { }
  base_url='https://traveller-api.kapakalatech.com'

  public addStopPoints(data:any){
    return this.http.post(this.base_url+'/api/companies/stoppoints/add', data);

  }



  public getStopPoint(companyId:any){
    let id =companyId.toString()
     return this.http.get(this.base_url+'/api/companies/stoppoints/all/'+id)

   }

   public getRoutes(companyId:any){
    let id =companyId.toString()
     return this.http.get(this.base_url+'/api/companies/route/all/'+id)

   }
}
