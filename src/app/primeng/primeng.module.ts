import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { FieldsetModule } from 'primeng/fieldset';



@NgModule({
  declarations: [],
  imports: [
    CommonModule, InputTextModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    FieldsetModule
  ],
  exports: [
    InputTextModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    FieldsetModule
  ]
})
export class PrimengModule { }
