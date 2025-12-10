import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'app/services/events.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-passwordreset',
  templateUrl: './passwordreset.component.html',
  styleUrls: ['./passwordreset.component.scss']
})
export class PasswordresetComponent implements OnInit {

  isLoading=false;

  form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder,private route: ActivatedRoute,private eventService: EventsService,private router: Router) {
    this.form = this.fb.group({
      email: ['', Validators.required],
    }, { validator: this.passwordMatchValidator });
  }


  passwordMatchValidator(g: UntypedFormGroup) {

  }


  ngOnInit(): void {
  }


  submitPassword() {
    if (this.form.valid) {
      this.isLoading = true;
      this.eventService.sendemailLink(this.form.value).subscribe((res:any)=>{
        console.log(res);
        Swal.fire({
          title: res['message'],
          // text: res['message'],
          // icon: 'success',
          confirmButtonText: 'Ok',
        });
        this.isLoading = true;
        this.router.navigate(['/home']);
      }
      )

      console.log(this.form.value);
      // Add your logic to handle password update
    }
  }
}
