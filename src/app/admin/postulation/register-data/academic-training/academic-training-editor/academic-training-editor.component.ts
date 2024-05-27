import { Component, Inject, Injector, OnInit } from '@angular/core';
import { FormFields } from '../../../../../shared/form-builder-helper';
import { CommonModule, DatePipe } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { AcademicTraining } from '../../../../../core/models/academic-training';
import { CboModel } from '../../../../../core/models/cbo-model';
import { PostulationService } from '../../../../../core/services/postulation.service';
import { FormDialogComponent } from '../../../../../shared/form-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material.module';
import { DialogFormatModule } from '../../../../../shared/dialog-format.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from '../../../../../core/types/custom-date-format';

@Component({
  selector: 'app-academic-training-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    DialogFormatModule,
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
  templateUrl: './academic-training-editor.component.html',
})
export class AcademicTrainingEditorComponent extends FormDialogComponent<AcademicTraining> implements OnInit {

  public static readonly maxWidth: number = 7 * 80 + 44;
  educationLevels: CboModel[];
  educationLevel!: string;
  personId: number;

  protected override formFields: FormFields = {
    id_person: {},
    id: {},
    id_level: {
      required: true,
    },
    specialty: {
      minLength: 4,
      maxLength: 100,
    },
    center: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    date_start: {
      required: true,
    },
    date_end: {
      required: true,
    }
  };

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.isEditionMode()) {
      this.getFormControl('date_start')?.setValue(this.datePipe
        .transform(this.data.model.date_start, 'yyyy-MM-dd'));
      this.getFormControl('date_end')?.setValue(this.datePipe
        .transform(this.data.model.date_end, 'yyyy-MM-dd'));
    }
  }

  constructor(
    injector: Injector,
    override dialogRef: MatDialogRef<AcademicTrainingEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: PostulationService,
    private datePipe: DatePipe,
  ) {
    super(injector, dialogRef, data);
    this.educationLevels = data.educationLevels;
    this.personId = data.personId;
  }

  override getPostData(): any {
    const model = super.getPostData();
    return {
      ...model,
      id_person: this.personId,
    }
  }
  getSaveService(model: any): Observable<any> {
    return this.service.saveAcademicTraining(model);
  }
}
