import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { AccordionModule } from 'primeng/accordion';
import { TabViewModule } from 'primeng/tabview';
import { FileUploadModule } from 'primeng/fileupload';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { EditorModule } from 'primeng/editor';
import { SharedModule } from 'primeng/api';
import { FieldsetModule } from 'primeng/fieldset';
import { ProgressBarModule } from 'primeng/progressbar';
import { TooltipModule } from 'primeng/tooltip';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { TableModule } from 'primeng/table';
import { DropdownModule } from 'primeng/dropdown';


@NgModule({
  declarations: [],
  imports: [
    CommonModule, InputTextModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    AccordionModule,
    TabViewModule,
    FileUploadModule,
    ToggleButtonModule,
    MenuModule,
    PanelModule,
    RadioButtonModule,
    CheckboxModule,
    InputTextareaModule,
    OverlayPanelModule,
    EditorModule,
    SharedModule,
    FieldsetModule,
    ProgressBarModule,
    TooltipModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule
  ],
  exports: [
    InputTextModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    AccordionModule,
    TabViewModule,
    FileUploadModule,
    ToggleButtonModule,
    MenuModule,
    PanelModule,
    RadioButtonModule,
    CheckboxModule,
    InputTextareaModule,
    OverlayPanelModule,
    EditorModule,
    SharedModule,
    FieldsetModule,
    ProgressBarModule,
    TooltipModule,
    ConfirmDialogModule,
    TableModule,
    DropdownModule
  ]
})
export class PrimengModule { }
