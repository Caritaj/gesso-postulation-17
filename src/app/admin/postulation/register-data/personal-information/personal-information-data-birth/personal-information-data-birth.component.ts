import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../../../shared/material.module';
import { Person } from '../../../../../core/models/persona';
import { FormBuilderHelper } from '../../../../../shared/form-builder-helper';
import { PERSON_DATA_BIRTH_FIELDS } from '../register-data.fields';

@Component({
  selector: 'app-personal-information-data-birth',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  templateUrl: './personal-information-data-birth.component.html',
})
export class PersonalInformationDataBirthComponent {

  @Input() provinces!: any[];
  @Input() districts!: any[];
  @Input() departments!: any[];
  @Input() personId!: Person;

  personDataBirthFormGroup!: FormGroup;
  constructor(
    private formBuilderHelper: FormBuilderHelper
  ) {
    this.defineFormGroups();
  }

  defineFormGroups(): void {
    const values = {};
    this.personDataBirthFormGroup = this.formBuilderHelper.buildFormGroup(PERSON_DATA_BIRTH_FIELDS, values);
  }

  ngOnChanges() {
    this._SetData();
  }

  _SetData(): void {
    this.setPersonaForm(this.personId);
  }
  setPersonaForm(person: Person): void {
    if (person.birthUbigeo) {
      this.personDataBirthFormGroup.patchValue({ birthUbigeo: person.birthUbigeo });
    }
  }
}
