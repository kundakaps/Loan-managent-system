import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoutesService {

  constructor(private  http: HttpClient) { }
  base_url='https://traveller-api.kapakalatech.com'

  public addingRoute(routeData:any){
    return this.http.post(this.base_url+'/api/companies/route/add',routeData)
  }

  public getRoutes(companyId:any){
   let id =companyId.toString()
    return this.http.get(this.base_url+'/api/companies/route/all/'+id)

  }
}
