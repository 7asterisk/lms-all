import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';
declare var UIkit;

import { HttpClient } from '@angular/common/http';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  forgotEmail;


  apiUrl = 'http://localhost:5000';
  // apiUrl = 'https://coursebackend.herokuapp.com';



  constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }
  onSubmit(form) {
    const values = form.value;
    // console.log(values);
    this.addItem('auth', { to: 'student', credential: values }).subscribe(data => {
      // console.log(data);
      this.auth.setToken(data['token'], data['userId'], 'st');
      this.router.navigate(['/st/home']);
    }, err => {
      if (err.error.msg === 'user not found!') {
        this.addItem('auth', { to: 'teacher', credential: values }).subscribe(data => {
          // console.log(data);
          this.auth.setToken(data['token'], data['userId'], 'tr');
          this.router.navigate(['/tr/home']);
        }, err => {
          UIkit.notification({
            message: err.error.msg,
            status: 'danger',
            pos: 'top-center'
          });
        });
      } else {
        UIkit.notification({
          message: err.error.msg,
          status: 'danger',
          pos: 'top-center'
        });
      }
    });
  }

  resetRequest() {
    if (this.forgotEmail.length > 1) {
      const data = { to: 'teacher', forgotEmail: this.forgotEmail };
      this.forgotPassword(data).subscribe(data => {
        UIkit.modal('#forgot-password').hide();
        UIkit.notification({
          message: data['message'],
          status: 'success',
          pos: 'top-center'
        });
        console.log(data);
      });
    }
  }



  addItem(to, data) {
    return this.http.post(`${this.apiUrl}/${to}`, data);
  }


  forgotPassword(data) {
    return this.http.post(this.apiUrl + '/forgotpassword', data);
  }

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      if (this.auth.getRole() === 'st') {
        this.router.navigate(['/st/home']);
      } else { this.router.navigate(['/tr/home']); }
    }
  }

}
