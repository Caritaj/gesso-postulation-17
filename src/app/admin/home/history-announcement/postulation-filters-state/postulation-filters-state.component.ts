import { Component } from '@angular/core';
import { FiltersContainerComponent } from '@shared/filters-container.component';
import { Filter } from '@typeModel/filter';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SearchBoxComponent } from '@shared/search-box/search-box.component';
import { MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-postulation-filters-state',
  templateUrl: './postulation-filters-state.component.html',
  styleUrls: ['./postulation-filters-state.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SearchBoxComponent,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
  ],
})
export class PostulationFiltersStateComponent extends FiltersContainerComponent  {
  textSearch: any;
  selectedState: any;
  override filters: Filter[] = [
    { id: 'stateId', type: 'string', field: 'stateId', operator: '=' },
    { id: '_query', type: 'string', field: '_query', operator: '~' },
  ];

  override setSearchFilterValue(event: any): void {
    const searchText = event.target.value;
    this.setFilterValue('_query', searchText);
  }

  onStateChange(e: any): void {
    this.setFilterValue('stateId', e.value);
  }

  clearFilters(): void {
    this.textSearch = null;
    this.selectedState = null;
    this.resetFilters();
  }
}
