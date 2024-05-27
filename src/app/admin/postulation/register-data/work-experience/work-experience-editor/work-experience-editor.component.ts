import { Component, Inject, Injector, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { CboModel } from '../../../../../core/models/cbo-model';
import { PostulationService } from '../../../../../core/services/postulation.service';
import { FormFields } from '../../../../../shared/form-builder-helper';
import { FormDialogComponent } from '../../../../../shared/form-dialog.component';
import { CommonModule, DatePipe } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogFormatModule } from '../../../../../shared/dialog-format.module';
import { MaterialModule } from '../../../../../shared/material.module';
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS } from '@angular/material/core';
import { MY_FORMATS } from '../../../../../core/types/custom-date-format';

@Component({
  selector: 'app-work-experience-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    DialogFormatModule,
  ],
  templateUrl: './work-experience-editor.component.html',
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
export class WorkExperienceEditorComponent extends FormDialogComponent<any> implements OnInit {

  public static readonly maxWidth: number = 8 * 80 + 44;
  molType: CboModel[];
  personId: number;

  protected override formFields: FormFields = {
    personId: {},
    id: {},
    companyName: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    typeId: {
      required: true,
    },
    areaName: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    positionName: {
      required: true,
      minLength: 4,
      maxLength: 100,
    },
    start_date: {
      required: true,
    },
    end_date: {},
    description: {
      required: true,
      minLength: 4,
      maxLength: 200,
    },
  };

  constructor(
    injector: Injector,
    override dialogRef: MatDialogRef<WorkExperienceEditorComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private service: PostulationService,
  ) {
    super(injector, dialogRef, data);
    this.molType = data.molType;
    this.personId = data.personId;
  }

  override getPostData() {
    const model = super.getPostData();
    return {
      ...model,
      personId: this.personId
    }
  }

  getSaveService(model: any): Observable<any> {
    return this.service.saveWorkExperience(model);
  }
}
