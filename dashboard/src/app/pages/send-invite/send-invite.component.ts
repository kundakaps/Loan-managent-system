import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'app/services/events.service';
import Swal from 'sweetalert2';
import { DomSanitizer } from '@angular/platform-browser';


@Component({
  selector: 'app-send-invite',
  templateUrl: './send-invite.component.html',
  styleUrls: ['./send-invite.component.scss']
})
export class SendInviteComponent implements OnInit {


  pdfSrc: any;
  id: any;
  event=<any>[]
  invites =<any>[];
  builk=true
  single=false
  required = false;
  invitesToDelete: any[] = [];

  selectedFile: File | null = null;
  selectedFileName: string = '';
  fileSelected: boolean = false;
  free:any=0;
  userId:any

  selectedPaymentMethod: string = "online";
  selectAll: boolean = false;
  title="Send Invites"




  isLoading = false;
  constructor(private route: ActivatedRoute,private eventService: EventsService,private router: Router,public sanitizer: DomSanitizer) {
    this.userId= JSON.parse(localStorage.getItem('userId') || '{}');
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.id = params["id"];
       // console.log(userId);
       this.getEvent();
       this.getinvites();
       this.getfreeinvitecount()
       this.getPDFpreview()
     });
  }

  switchSingle(){
    this.builk=false;
    this.single=true
  }
  switchbulk(){
    this.builk=true;
    this.single=false
  }

  public getEvent(){  //get event details
    this.isLoading = true;
    this.eventService.getEventDetails(this.id).subscribe(
      (result)=>{
        this.event=result['data'][0]
        // console.log(this.event['event_name'])
        this.isLoading = false;
      },
      (error)=>{
        console.log(error);
        this.isLoading = false;
      }
    )
  }
  addsingleinvite(addsingleinviteForm:any){

 if(addsingleinviteForm.value.full_name=='' || addsingleinviteForm.value.full_name==null
 || addsingleinviteForm.value.email=='' || addsingleinviteForm.value.email==null
 || addsingleinviteForm.value.phone=='' || addsingleinviteForm.value.phone==null

 ){
  this.required=true
 }else{
  this.isLoading = true;
  const eventId = this.id;
  addsingleinviteForm.value.inviteId = eventId;

  // console.log(addsingleinviteForm.value);

  this.eventService.sendinviteSingle(addsingleinviteForm.value).subscribe(
    (result)=>{
      if(result['success']==true){
        Swal.fire('Successfully added invite')
        this.getinvites();
        this.isLoading=false
        }else{
          Swal.fire('Oops','Something went wrong please try again','error');
          this.isLoading=false
        }
    },
    (error)=>{
      console.log(error);
      Swal.fire('Oops','Something went wrong please try again','error');
      this.isLoading=false
    }
  )}


  }


  public getPDFpreview() {
    this.eventService.pdfpriview(this.id).subscribe(
      (result) => {
        // Create a SafeResourceUrl from the Blob URL
        this.pdfSrc = this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(result));
        console.log(this.pdfSrc)
      },
      (error) => {
        console.log(error);
      }
    );
  }





  public editInvite(id:any){
    this.router.navigate(['/edit'],{queryParams:{id:id,e:this.id}})
  }


  public getinvites(){  //get event details
    this.isLoading = true;
    this.eventService.getInvites(this.id).subscribe(
      (result)=>{
        this.invites=result['data']
        // console.log(this.invites)
        this.isLoading = false;
      },
      (error)=>{
        console.log(error);
        this.isLoading = false;
      }
    )

  }


 public getfreeinvitecount(){
    this.isLoading = true;
    this.eventService.getfreeinviteCount(this.userId).subscribe(
      (result)=>{
      //  console.log(result['count'])
        this.free=result['count']
        this.isLoading = false;
      },
      (error)=>{
        console.log(error);
        this.isLoading = false;
      }
    )


 }


  public sendinvites(){
    if(this.free!=3){
      // console.log("send free invite")
      this.isLoading = true;

      const body = {
        userId:this.userId,
        eventId:this.id
      }
     this.eventService.sendinvitefree(body).subscribe(
        (result)=>{
          Swal.fire(result['message'])
          this.getinvites();
          this.isLoading = false;
          this.getfreeinvitecount()
        },
        (error)=>{
          console.log(error);
          Swal.fire('Oops','Something went wrong please try again','error');
          this.isLoading=false
        }
      )


    }else{

      // console.log("pay with cash or e money")

    if (this.selectedPaymentMethod === 'cash') {

      this.isLoading = true;
      this.eventService.cash(this.id).subscribe(
        (result)=>{
            Swal.fire(result['message'])
            this.isLoading = false;
        },
        (error)=>{
          console.log(error);
          this.isLoading = false;
        }
      )

    } else if (this.selectedPaymentMethod === 'online') {

    this.isLoading = true;
    this.eventService.senInvites(this.id).subscribe(
      (result)=>{


        if(result['identifier']=='url'){
        console.log(result)

        window.location.href=result['data']
        }else{
          Swal.fire(result['message'])
          this.getinvites();
          this.isLoading = false;
        }

      },
      (error)=>{
        console.log(error);
        this.isLoading = false;
      }
    )

    }

  }
  }


  selectAllInvites() {
    // Update the 'selected' property for each invite based on 'selectAll' value
    this.invites.forEach((invite) => {
      invite.selected = this.selectAll;
    });
  }

  //send selected invites
  sendSelectedInvites(){
    this.isLoading = true;
    const selectedInviteIds = this.invites
      .filter((invite) => invite.selected)
      .map((invite) => invite.id);

    if (selectedInviteIds.length === 0) {
      // No invites selected, show an error message or handle it accordingly
      Swal.fire('Oops','No invites selected .','error');
      this.isLoading = false;
      // console.log('No invites selected for deletion.');
    } else {
      // You can send the selectedInviteIds to your API for bulk deletion
      console.log('Selected invite IDs for deletion:', selectedInviteIds);



    }

  }



  bulkDelete() {


    this.isLoading = true;
    const selectedInviteIds = this.invites
      .filter((invite) => invite.selected)
      .map((invite) => invite.id);

    if (selectedInviteIds.length === 0) {
      // No invites selected, show an error message or handle it accordingly
      Swal.fire('Oops','No invites selected for deletion.','error');
      this.isLoading = false;
      // console.log('No invites selected for deletion.');
    } else {
      // You can send the selectedInviteIds to your API for bulk deletion
      // console.log('Selected invite IDs for deletion:', selectedInviteIds);




      this.eventService.deletebulkInvite(selectedInviteIds).subscribe(
        (result)=>{
          console.log(result)
          Swal.fire(result['message'])

          this.getinvites();
          this.isLoading = false;
      },
      (error)=>{
        console.log(error);
        this.isLoading = false;
      }
      )




      this.getEvent();
      this.getinvites();

    }
  }

  // public addinvite(addinvite:any){
  //   this.isLoading=true

  //   // console.log(addeventForm.value);
  //   this.eventService.sendinvite(addinvite.value, this.id).subscribe(
  //     (response)=>{


  //       if(response['success']==true){
  //       Swal.fire('Successfully uploaded invite')
  //       this.getinvites();
  //       this.isLoading=false
  //       }else{
  //         Swal.fire('Oops','Something went wrong please try again','error');
  //         this.isLoading=false
  //       }
  //     },
  //     (error)=>{
  //       // console.log(error);
  //       Swal.fire('Oops','Something went wrong please try again','error');
  //       this.isLoading=false
  //     }
  //         );
  //    }





  onFileSelected(event: any) {
    // console.log(event.target.files[0]);
    this.selectedFile = event.target.files[0];
    this.selectedFileName = this.selectedFile?.name || '';
    this.fileSelected = true;
  }




  public addinvite() {
    this.isLoading = true;

    if (!this.selectedFile) {
      Swal.fire('Oops', 'No file select', 'error');
      this.isLoading = false;
        return; // Exit the function early if no file is selected
    }

    this.eventService.sendinvite(this.selectedFile, this.id)
        .subscribe(
            response => {
                if (response['success'] === true) {
                    Swal.fire('Successfully uploaded invite');
                    this.getinvites();
                    this.isLoading = false;
                } else {
                    Swal.fire('Oops', 'Something went wrong. Please try again', 'error');
                    this.isLoading = false;
                }
            },
            error => {
                // Handle errors here
                console.error('Error uploading file:', error);
            }
        );
}

}
