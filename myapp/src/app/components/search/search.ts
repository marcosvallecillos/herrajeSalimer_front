import { Component, EventEmitter, Input, NgModule, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Mueble } from '../../models/herrajes.interface';
import { ApiService } from '../../services/api-service.service';

@Component({
  selector: 'app-search',
  imports: [FormsModule],
  templateUrl: './search.html',
  styleUrls: ['./search.css']
})
export class Search {
  searchValue: string = '';
  
  @Input() searchTerm: string = '';
  @Output() search = new EventEmitter<string>();
  @Output() backToForm = new EventEmitter<void>();
  
  mueble: Mueble[] = [];
  loading: boolean = false;
  error: string = '';
  selectedUser: Mueble | null = null;

  constructor(private apiService: ApiService) {}


  onSubmit() {
    if (this.searchValue.trim()) {
      this.search.emit(this.searchValue.trim());
    }
}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['searchTerm'] && this.searchTerm) {
      this.searchMuebles();
    }
  }

  searchMuebles() {
    this.selectedUser = null;
    this.loading = true;
    this.error = '';
    this.mueble = [];

    this.apiService.searchMuebles(this.searchTerm).subscribe({
      next: (muebles) => {
        this.mueble = muebles;
        this.loading = false;
      },
      error: () => {
        this.error = 'Ocurrió un error al buscar.';
        this.loading = false;
        this.mueble = [];
      }
    });
  }

    onMainClick() {
    this.backToForm.emit();
  }
}
