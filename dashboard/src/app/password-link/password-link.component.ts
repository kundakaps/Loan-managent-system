import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'app/services/events.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-password-link',
  templateUrl: './password-link.component.html',
  styleUrls: ['./password-link.component.scss']
})
export class PasswordLinkComponent implements OnInit {


  Linkid;
  isLoading=false;

  form: UntypedFormGroup;

  constructor(private fb: UntypedFormBuilder,private route: ActivatedRoute,private eventService: EventsService,private router: Router) {
    this.form = this.fb.group({
      password: ['', Validators.required],
      verifyPassword: ['', Validators.required]
    }, { validator: this.passwordMatchValidator });
  }


  passwordMatchValidator(g: UntypedFormGroup) {
    return g.get('password').value === g.get('verifyPassword').value
      ? null
      : { 'mismatch': true };
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.Linkid = params["link"];
       console.log(this.Linkid );



     });
  }

  updatePassword() {
    if (this.form.valid) {
      this.isLoading = true;
  const data = {
       password: this.form.value.password,
        link: this.Linkid
      }
    this.eventService.resetPassword(data).subscribe((res:any)=>{
      // console.log(res);
      Swal.fire({
        title: res['message'],
        // text: res['message'],
        // icon: 'success',
        confirmButtonText: 'Ok',
      });
      this.isLoading = false;
      this.router.navigate(['/home']);
    }
    )


  }
}

}
