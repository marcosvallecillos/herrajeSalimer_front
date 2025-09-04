import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mueble } from '../../models/herrajes.interface';
import { ApiService } from '../../services/api-service.service';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { ModalHerrajes } from '../modal-herrajes/modal-herrajes';

@Component({
  selector: 'app-card',
  imports: [CommonModule,ModalDeleteComponent,ModalHerrajes],
  templateUrl: './card.html',
  styleUrls: ['./card.css']
})
export class Card {
  @Input() muebles: Mueble[] = [];
  @Output() onDelete = new EventEmitter<number>();
  showModal: boolean = false;
  selectedMueble: Mueble | null = null;
  selectedHerraje = this.selectedMueble?.herrajes[0] || null;

  constructor(
    private apiService: ApiService
  ) { }
  deleteMueble(mueble: Mueble) {
    this.selectedMueble = mueble;
    this.showModal = true;
    console.log('Mueble seleccionado para eliminar:', mueble);
  }

    onConfirmMueble() {
    if (this.selectedMueble) {
      const muebleId = this.selectedMueble.id;
      this.apiService.deleteMueble(muebleId).subscribe({
        next: () => {
          this.onDelete.emit(muebleId);
          this.selectedMueble = null;
          this.showModal = false;
        },
        error: (error: Error) => {
          console.error('Error al eliminar el mueble', error);
        }
      });
    }
  }
    onCancelMueble() {
    this.showModal = false;
    this.selectedMueble = null;
  }
    onCloseHerrajes() {
    this.showModal = false;
    this.selectedMueble = null;
    this.selectedHerraje = null;
  }
}
