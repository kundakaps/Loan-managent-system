import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddBusToRouteService {


  constructor(private http: HttpClient) { }
  base_url='https://evaluation-api.bytewavetechnologieszm.com'
  public addBusToRoute(data:any){
    return this.http.post(this.base_url+'/api/busroute/add', data);
  }


  public getBusesOnRoute(companyId:any){
    let id =companyId.toString()
     return this.http.get(this.base_url+'/api/companies/getbusesontoute/all/'+id)

   }

   public getseats(seatID:any){
    let id =seatID.toString()
    return this.http.get(this.base_url+'/api/tickets/setnumbers/'+id)

   }
}
