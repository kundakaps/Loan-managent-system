import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  base_url ='https://evaluation-api.bytewavetechnologieszm.com'
  // base_url='http://127.0.0.1:8000'

  constructor(private http: HttpClient) { }

  registerUser(data:any){
    return this.http.post(this.base_url+'/api/v1/register',data)
  }

  loginUser(data:any){
    return this.http.post(this.base_url+'/api/v1/login',data)
  }
  getUserData(){
    const id = JSON.parse(localStorage.getItem('userId') || '{}');
    return this.http.get(this.base_url+'/api/v1/getusername/'+id)
  }
}
