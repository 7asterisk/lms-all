import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { ResetPasswordComponent } from './login/reset-password/reset-password.component';


const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'resetpassword/:id', component: ResetPasswordComponent },
  { path: 'tr', loadChildren: '../../projects/teacher/src/app/app.module#TeacherModule' },
  { path: 'st', loadChildren: '../../projects/student/src/app/app.module#StudentModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
