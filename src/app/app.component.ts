import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgxSpinnerModule, NgxSpinnerService } from 'ngx-spinner';
import { AlertDialogService } from './core/services/confirmation/alert.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(
    private spinner: NgxSpinnerService,
    private alertDialogService: AlertDialogService
  ) { }

  showSpinner() {
    this.spinner.show();
    setTimeout(() => {
      this.spinner.hide();
    }, 3000);
  }

  open(): void {
    this.alertDialogService.open({
      title: 'Cuidado!',
      message: '¿Estás seguro de eliminar el registro seleccionado?',
      icon: { name: "check_circle", color: 'success' },
      actions: {
        confirm: {
          show: true,
          label: 'Confirmar'
        },
        cancel: {
          show: true,
          label: 'Cancelar'
        }
      },
      dismissible: true
    });
  }
}
