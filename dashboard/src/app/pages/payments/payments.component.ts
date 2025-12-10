import { Component, OnInit } from '@angular/core';
import { EventsService } from 'app/services/events.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  constructor(private eventServices: EventsService) { }

  ngOnInit(): void {
    this.getPackage()
    this.getPayments()
  }
showaddpayment=false;
showpayment=true;
showpricing=false;
packages:any=[]
payments:any=[]
loading=false
packageId:any

isPaymentModalOpen: boolean = false;
modalTitle: string = 'Select Payment Method';


openPaymentModal(): void {
  this.isPaymentModalOpen = true;
}

closePaymentModal(): void {
  this.isPaymentModalOpen = false;
}

stopPropagation(event: Event): void {
  event.stopPropagation();
}


  showAddPayments(){

  }

  showPayments(){

    this.showpricing=false;
    this.showpayment=true;

  }
  showPrcing(){
    // console.log('show pricing')
    this.showpricing=true;
    this.showpayment=false;

  }
  SelectPayment(){
    this.showpricing=true;
    this.showpayment=false;
  }


getPackage(){
  this.loading=true

  this.eventServices.getpackages().subscribe((res:any)=>{
    this.packages=res.packages
    this.loading = false;
    // console.log(this.packages)
  })

}

submit(id){
this.packageId=id
console.log(this.packageId)
this.openPaymentModal()
}


cashpayment(){
  this.loading=true
  const userId = localStorage.getItem('userId')

  const data={
    user_id:userId,
    package_id:this.packageId,
  }
  this.eventServices.cashaddPayment(data).subscribe((res:any)=>{
    if(res['identifier']=='url'){
      console.log(res)

      window.location.href=res['data']
      }else{
        Swal.fire(res['message'])

        this.loading = false;
        //delay 5 seconds then reload
        setTimeout(function(){
          window.location.reload();
        }, 5000);



      }
    })
}

submitPaymentonline(){
  this.loading=true
  const userId = localStorage.getItem('userId')

  const data={
    user_id:userId,
    package_id:this.packageId,
  }

 this.eventServices.addPayment(data).subscribe((res:any)=>{
  if(res['identifier']=='url'){
    console.log(res)

    window.location.href=res['data']
    }else{
      Swal.fire(res['message'])

      this.loading = false;
    }
  })


}

getPayments(){
  this.loading=true
  const userId = localStorage.getItem('userId')

  this.eventServices.getpayments(userId).subscribe((res:any)=>{
    this.payments=res.payments
    // console.log(this.payments)
    this.loading = false;
  })
}


}
