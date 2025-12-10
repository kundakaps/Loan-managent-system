import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BusesService {

  constructor(private  http: HttpClient) { }
  base_url='https://traveller-api.kapakalatech.com'

  public addingBus(busData:any){
    return this.http.post(this.base_url+'/api/companies/bus/add',busData)
  }

  public getBuses(companyId:any){
   let id =companyId.toString()
    return this.http.get(this.base_url+'/api/companies/bus/all/'+id)

  }
}
