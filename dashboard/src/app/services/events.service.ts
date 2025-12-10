import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private  http: HttpClient) { }
  base_url='https://evaluation-api.bytewavetechnologieszm.com'
  // base_url='http://127.0.0.1:8000'

  public addEvent(EventData:any){
    return this.http.post(this.base_url+'/api/v1/addevent',EventData)
  }

  public getEvents(userId:any){
   let id = userId.toString()
    return this.http.get(this.base_url+'/api/v1/getevents/'+id)

  }


  public getEventDetails(id:any){
    return this.http.get(this.base_url+'/api/v1/getsingleevent/'+id)

  }


  public getInvites(id:any){
    return this.http.get(this.base_url+'/api/v1/getinvites/'+id)

  }

  public senInvites(id:any){
    return this.http.get(this.base_url+'/api/v1/sendinvites/'+id)

  }
  public getcashapprovals(){
    return this.http.get(this.base_url+'/api/v1/getcashapproval')

  }

  public approvecash(id){
    return this.http.get(this.base_url+'/api/v1/approvecash'+id)

  }

  public cash(id:any){
    return this.http.get(this.base_url+'/api/v1/cash/'+id)

  }



  public sendinvite(file: File, id:any){
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(this.base_url+'/api/v1/addinvites/'+id,formData)
  }

  public editsingleinvite(editSingleData:any){

    return this.http.post(this.base_url+'/api/v1/editsingleinvite',editSingleData)
  }


  public sendinviteSingle(singledata:any){
    return this.http.post(this.base_url+'/api/v1/addsingleinvite',singledata)

  }


  public getSingleInvite(id:any){
    return this.http.get(this.base_url+'/api/v1/getsingleinvite/'+id)

  }

  public deleteSingleInvite(id:any){
    return this.http.get(this.base_url+'/api/v1/deletesingleinvite/'+id)

  }

  public deletebulkInvite(selectedInvites:any){
    return this.http.post(this.base_url+'/api/v1/deletebulkinvite',selectedInvites)

  }

  public sendinvitefree(invitedata:any){
    return this.http.post(this.base_url+'/api/v1/sendinvitefree',invitedata)

  }

  public getfreeinviteCount(id:any){
    return this.http.get(this.base_url+'/api/v1/getfreeinvitecount/'+id)

  }

  public pdfpriview(eventId: any): Observable<Blob> {
    let id = eventId.toString();
    let url = `${this.base_url}/api/v1/sendinvitespreview/${id}`;

    // Set the responseType to 'blob'
    let options = {
      responseType: 'blob' as 'json',
    };

    return this.http.get<Blob>(url, options);
  }


  public getpackages(){
    return this.http.get(this.base_url+'/api/v1/getpackages')

  }


  public addPayment(paymentData:any){
    return this.http.post(this.base_url+'/api/v1/addpayment',paymentData)

  }

  public cashaddPayment(paymentData:any){
    return this.http.post(this.base_url+'/api/v1/makecashpayment',paymentData)

  }

  public getpayments(id){
    return this.http.get(this.base_url+'/api/v1/getpayments/'+id)

  }

  public getDashboardData(){
    const userId = localStorage.getItem('userId')??0;
    let id = userId
    return this.http.get(this.base_url+'/api/v1/dashboard/'+id)

  }

  public editEventData(eventData:any, id:any){
    return this.http.post(this.base_url+'/api/v1/updateevent/'+id,eventData)

  }

  public sendemailLink(emaillinkdata:any){
    return this.http.post(this.base_url+'/api/v1/passwordlink',emaillinkdata)

  }

  public resetPassword(passworddata:any){
    return this.http.post(this.base_url+'/api/v1/resetpassword',passworddata)

  }

  public sendgratitude(gratitudedata:any, id:any){
    return this.http.post(this.base_url+'/api/v1/sendgratitude/'+id,gratitudedata)

  }

}
