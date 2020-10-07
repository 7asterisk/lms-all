import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StudentModule } from 'projects/student/src/app/app.module';
import { TeacherModule } from 'projects/teacher/src/app/app.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { AuthInterceptor } from './auth/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';
import { FormsModule } from '@angular/forms';
import { PrimengModule } from './primeng/primeng.module';
import { MessageService } from 'primeng/api';
import { NgProgressModule } from 'ngx-progressbar';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    StudentModule.forRoot(),
    TeacherModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule,
    PrimengModule,
    NgProgressModule,
    NgProgressModule.withConfig({
      spinnerPosition: 'right',
      color: '#673AB7'
    }),
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
