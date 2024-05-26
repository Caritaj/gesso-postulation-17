import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/header/header.component';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserLogin } from '../../core/models/user-login';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { PostulationService } from '../../core/services/postulation.service';
import { ToastrService } from 'ngx-toastr';
import { NotificationService } from '../../core/services/notification/notification.service';
import { DialogService } from '../../core/services/dialog/dialog.service';
import { RegisterDialogComponent } from '../register-dialog/register-dialog.component';
import moment from 'moment';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from "@angular/material/form-field";
import { FooterComponent } from '../../shared/footer/footer.component';
import { MaterialModule } from '../../shared/material.module';
import { ForgetPasswordComponent } from '../forget-password/forget-password.component';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    HeaderComponent,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
    FooterComponent,
    CommonModule,
    FooterComponent,
    MaterialModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {

  animal: string = "";
  name: string = "";
  userLoginForm!: FormGroup;
  userLogin: UserLogin = { number: '', date: '' };
  userInfo: any;

  constructor(public dialog: MatDialog,
    private router: Router,
    private service: PostulationService,
    private toastr: ToastrService,
    private notificationService: NotificationService,
    private dialogService: DialogService,
    private fb: FormBuilder,
  ) {
    this.createForm();
  }

  createForm() {
    this.userLoginForm = this.fb.group({
      number: [this.userLogin.number, [Validators.required, Validators.maxLength(8)]],
      date: [this.userLogin.date, Validators.required]
    });
  }

  openDialog(): void {
    this.dialogService.openFormDialog(RegisterDialogComponent, {
      maxWidth: RegisterDialogComponent.maxWidth,
    }).subscribe({
      next: (_) => { },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }


  login() {
    if (this.userLoginForm.invalid) {
      this.toastr.warning("Todos los campos son requeridos", 'Inicio de sesión');
      return;
    }
    const credentials = this.userLoginForm.value;
    credentials.date = this.formatDate(credentials.date);

    this.service.authentication(credentials).subscribe({
      next: (data: any) => {
        this.userInfo = data.data;
        localStorage.setItem("userInfo", JSON.stringify(this.userInfo));
        this.redirectToRegister();
      },
      error: (xhr: any) => {
        this.notificationService.handleXhrError(xhr);
      }
    });
  }


  openDialogForget(event: Event): void {
    event.preventDefault();
    this.dialog.open(ForgetPasswordComponent, {
      maxWidth: ForgetPasswordComponent.maxWidth,
    });
  }

  redirectToRegister() {
    this.router.navigate(['/register']);
  }

  redirectToInit() {
    this.router.navigate(['/']);
  }

  private formatDate(value: string): string {
    return moment(value, 'YYYY-MM-DD').format('DD/MM/YYYY');
  }
}