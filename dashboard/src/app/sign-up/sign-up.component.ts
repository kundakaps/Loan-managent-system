import { UsersService } from 'app/services/users.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  constructor(private useData: UsersService, private router:Router) { }

  ngOnInit(): void {
  }
  getUserFormdata(data:any){
    let jsonData = JSON.stringify(data)
    // console.warn(data1)
  this.useData.registerUser(data).subscribe( (result:any)=>{
    if(result['success']==true){
      console.log(result['data']['id'])
      this.router.navigate(['/dashboard']);
      localStorage.setItem("userId",result['data']['id'])
      localStorage.setItem("is_admin",result['data']['is_admin'])
    }else{
      console.log(result)

        Swal.fire('Oops','Something went wrong','error');


    }
  },
  (error)=>{
    console.log(error)
  })

    }

}
