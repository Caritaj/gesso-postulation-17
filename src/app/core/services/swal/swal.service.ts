import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';

@Injectable({
    providedIn: 'root'
})
export class SwalService {

    constructor(private toastr: ToastrService) { }

    showAlert(
        title: string,
        text: string,
        icon: SweetAlertIcon,
        confirmButtonText: string = 'Aceptar',
        cancelButtonText: string = 'Cancelar',
        confirmCallback?: () => void,
        confirmButtonColor: string = '#004e8b',
        cancelButtonColor: string = '#343a40',
    ): Promise<any> {
        return Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: !!confirmCallback,
            confirmButtonText: confirmButtonText,
            cancelButtonText: cancelButtonText,
            confirmButtonColor: confirmButtonColor,
            cancelButtonColor: cancelButtonColor,
            allowOutsideClick: false,
        }).then((result) => {
            if (result.isConfirmed && confirmCallback) {
                confirmCallback();
            }
        });
    }

    showSuccessToast(message: string): void {
        this.toastr.success(message);
    }

    showErrorToast(message: string): void {
        this.toastr.error(message);
    }

    showInfoToast(message: string): void {
        this.toastr.info(message);
    }

    showWarningToast(message: string): void {
        this.toastr.warning(message);
    }
}
