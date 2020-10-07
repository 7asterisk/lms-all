import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth/auth.service';

import { MessageService } from 'primeng/api';

import { HttpClient } from '@angular/common/http';
import { NgProgressComponent } from 'ngx-progressbar';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  forgotEmail;

  display: boolean = false;
  @ViewChild(NgProgressComponent) progressBar: NgProgressComponent;


  // apiUrl = 'http://localhost:5000';
  apiUrl = 'https://coursebackend.herokuapp.com';



  constructor(private http: HttpClient, private auth: AuthService, private router: Router, private messageService: MessageService) { }
  onSubmit(form) {
    const values = form.value;


    this.progressBar.start();


    // console.log(values);
    this.addItem('auth', { to: 'student', credential: values }).subscribe(data => {
      this.auth.setToken(data['token'], data['userId'], 'st');
      this.router.navigate(['/st/home']);
      this.progressBar.complete()
    }, err => {
      if (err.error.msg === 'user not found!') {
        this.addItem('auth', { to: 'teacher', credential: values }).subscribe(data => {
          // console.log(data);
          this.auth.setToken(data['token'], data['userId'], 'tr');
          this.router.navigate(['/tr/home']);
        }, err => {
          this.addTost('error', err.error.msg,)
        });
      } else {
        this.addTost('error', err.error.msg,)
      }
    });
  }

  resetRequest() {
    if (this.forgotEmail.length > 1) {
      const data = { to: 'teacher', forgotEmail: this.forgotEmail };
      this.forgotPassword(data).subscribe(data => {
        this.display = false;
        this.addTost('success', 'Reset link is send to your email.')
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

  showDialog() {
    this.display = true;
  }
  addTost(type, msg) {
    this.messageService.add({ severity: type, detail: msg });
  }

  clear() {
    this.messageService.clear();
  }

}
