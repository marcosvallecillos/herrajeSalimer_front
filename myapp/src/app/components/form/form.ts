import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form',
  imports: [FormsModule],
  templateUrl: './form.html',
  styleUrl: './form.css'
})
export class Form {
  @Output() searchTerm = new EventEmitter<string>();
  searchValue: string = '';

  onSubmit() {
    if (this.searchValue.trim()) {
      this.searchTerm.emit(this.searchValue.trim());
    }
  }
}
