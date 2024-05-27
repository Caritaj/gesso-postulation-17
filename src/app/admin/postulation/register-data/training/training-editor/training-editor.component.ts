import { CommonModule, DatePipe } from '@angular/common';
import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CboModel } from '../../../../../core/models/cbo-model';
import { PostulationService } from '../../../../../core/services/postulation.service';
import { FormFields } from '../../../../../shared/form-builder-helper';
import { FormDialogComponent } from '../../../../../shared/form-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogFormatModule } from '../../../../../shared/dialog-format.module';
import { MaterialModule } from '../../../../../shared/material.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from '../../../../../core/types/custom-date-format';

@Component({
  selector: 'app-training-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    DialogFormatModule,
  ],
  templateUrl: './training-editor.component.html',
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    DatePipe,
  ],
})
export class TrainingEditorComponent extends FormDialogComponent<any> implements OnInit{

  public static readonly maxWidth: number = 7 * 80 + 44;
  capacitationType: CboModel[];
  trainingLevel: CboModel[];
  personId: number;

  protected override formFields: FormFields = {
    personId: {},
    id: {},
    typeId: {
      required: true,
    },
    levelId: {
      required: true,
    },
    institution: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    description: {
      required: true,
      minLength: 4,
      maxLength: 200,
    },
    date_start: {
      required: true,
    },
    date_end: {
      required: true,
    },
    hours: {
      required: true,
    },
    is_internal: {
      required: true,
    },
  };

  constructor(
    injector: Injector,
    override dialogRef: MatDialogRef<TrainingEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private datePipe: DatePipe,
    private service: PostulationService,
  ) {
    super(injector, dialogRef, data);
    this.capacitationType = data.capacitationType;
    this.trainingLevel = data.trainingLevel;
    this.personId = data.personId
  }

  override ngOnInit(): void {
    super.ngOnInit();
    if (this.isEditionMode()) {
      this.getFormControl('date_start')?.setValue(this.datePipe
        .transform(this.data.model.date_start, 'yyyy-MM-dd'));
      this.getFormControl('date_end')?.setValue(this.datePipe
        .transform(this.data.model.date_end, 'yyyy-MM-dd'));
    }
  }

  override getPostData() {
    const model = super.getPostData();
    return {
      ...model,
      personId: this.personId
    }
  }

  getSaveService(model: any): Observable<any> {
    return this.service.saveTraining(model);
  }
}
