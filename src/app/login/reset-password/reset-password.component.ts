import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from 'projects/student/src/app/data.service';

declare var UIkit;
@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {
  hash;
  constructor(private dataServie: DataService, private router: ActivatedRoute, private route: Router) {
    this.router.params.subscribe(parms => {
      this.hash = parms.id;
    });
  }
  onSubmit(form) {
    if (form.value.password.length < 6) {
      UIkit.notification({
        message: 'password must be atlist 6  charecter !',
        status: 'danger',
        pos: 'top-center'
      });
    } else if (form.value.password !== form.value.repassword) {
      UIkit.notification({
        message: 'password dont match !',
        status: 'danger',
        pos: 'top-center'
      });
    } else {
      const data = { to: 'student', password: form.value.password, hash: this.hash };
      this.dataServie.resetPassword(data).subscribe(data => {
        UIkit.notification({
          message: 'password reset successfully !',
          status: 'success',
          pos: 'top-center'
        });
        this.route.navigate(['/login']);
      });
    }


  }
  ngOnInit(): void {
  }

}
