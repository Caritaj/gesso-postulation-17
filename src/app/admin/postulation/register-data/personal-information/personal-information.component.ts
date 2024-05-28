import { Component, OnInit, input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Person } from '../../../../core/models/persona';
import { NotificationService } from '../../../../core/services/notification/notification.service';
import { PostulationService } from '../../../../core/services/postulation.service';
import { FormBuilderHelper } from '../../../../shared/form-builder-helper';
import { PERSON_DATA_FIELDS } from './register-data.fields';
import { MaterialModule } from '../../../../shared/material.module';
import { DatePipe } from '@angular/common';
import { AlertDialogService } from '../../../../core/services/confirmation/alert.service';
import { ToastrService } from 'ngx-toastr';
import { DirectivesModule } from '../../../../core/directives/directives.module';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { MY_FORMATS } from '../../../../core/types/custom-date-format';
import { CboModel } from '../../../../core/models/cbo-model';

@Component({
  selector: 'app-personal-information',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    DirectivesModule,
  ],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
  ],
  templateUrl: './personal-information.component.html',
})
export class PersonalInformationComponent implements OnInit {

  licenseDrives = input<CboModel[]>();
  genders = input<CboModel[]>();
  documentTypes = input<CboModel[]>();
  civilStates = input<CboModel[]>();
  personId = input<Person>();

  personDataFormGroup!: FormGroup;
  msgError = 'Los datos ingresados no son válidos. Por favor, revisa los campos del formulario e inténtalo nuevamente';

  constructor(
    private notificationService: NotificationService,
    private formBuilderHelper: FormBuilderHelper,
    private service: PostulationService,
    private alertDialogService: AlertDialogService,
    private toastr: ToastrService,
  ) {
    this.defineFormGroups();
  }
  
  ngOnInit() {
    this._SetData();
  }

  defineFormGroups(): void {
    const values = {};
    this.personDataFormGroup = this.formBuilderHelper.buildFormGroup(PERSON_DATA_FIELDS, values);
  }

  _SetData(): void {
    this.setPersonaForm(this.personId()!);
  }
  setPersonaForm(person: Person): void {
    if (!person) return;
    this.personDataFormGroup.patchValue(person);
  }

  updateInfoPersona() {
    if (this.personDataFormGroup.valid) {
      const dialog = this.alertDialogService.open({
        title: 'Información Personal!',
        message: '¿Está seguro que desea actualizar la información?',
        icon: { name: 'help', color: 'info' },
        actions: {
          confirm: {
            show: true,
            label: 'Confirmar',
          },
          cancel: {
            show: true,
            label: 'Cancelar',
          },
        },
        dismissible: true,
      });

      dialog.afterClosed().subscribe((result) => {
        if (result === 'confirmed') {
          this.handleUpdateConfirmation();
        }
      });
    } else {
      this.showInvalidValuesMessage();
    }
  }

  handleUpdateConfirmation(): void {
    const personData = this.personDataFormGroup.getRawValue();
    const person = {
      ...personData,
    };
    this.service.updateInfoPersona(person, person.id)
      .subscribe({
        next:
          (res: any) => {
            this.toastr.success('Actualizado correctamente!');
            this.setPersonaForm(res.data);
          },
        error: (xhr: any) => {
          this.notificationService.handleXhrError(xhr);
        }
      });
  }

  showInvalidValuesMessage(): void {
    this.alertDialogService.open({
      title: '¡Error!',
      message: this.msgError,
      icon: {
        name: 'error',
        color: 'error'
      },
      actions: {
        confirm: {
          show: true,
          label: 'ACEPTAR',
        },
        cancel: {
          show: false,
        },
      },
      dismissible: true,
    });
  }
}
