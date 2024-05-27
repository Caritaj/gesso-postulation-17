import { Component } from '@angular/core';
import { FiltersContainerComponent } from '../../../../shared/filters-container.component';
import { Filter } from '../../../../core/types/filter';
import { MatIconModule } from '@angular/material/icon';
import { SearchBoxComponent } from '../../../../shared/search-box/search-box.component';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-postulation-filters',
  templateUrl: './postulation-filters.component.html',
  styleUrls: ['./postulation-filters.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    SearchBoxComponent,
    FormsModule,
    MatButtonModule,
  ],
})
export class PostulationFiltersComponent extends FiltersContainerComponent {
  textSearch: any;
  override filters: Filter[] = [
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
    this.resetFilters();
  }
}
