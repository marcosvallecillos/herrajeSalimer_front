import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Mueble , Herraje} from '../../models/herrajes.interface';
import { ApiService } from '../../services/api-service.service';
import { ModalDeleteComponent } from '../modal-delete/modal-delete.component';
import { ModalHerrajes } from '../modal-herrajes/modal-herrajes';
import { Router, RouterLink } from '@angular/router';
import { ModalEdit } from '../modal-edit/modal-edit';

@Component({
  selector: 'app-card',
  imports: [CommonModule, ModalDeleteComponent, ModalHerrajes, RouterLink, ModalEdit],
  templateUrl: './card.html',
  styleUrls: ['./card.css']
})
export class Card {
  @Input() muebles: Mueble[] = [];
  @Output() onDelete = new EventEmitter<number>();
  isloading: boolean = false;
  showModal: boolean = false;
  showModalHerrajes: boolean = false;
  showModalEdit: boolean = false;

  selectedMueble: Mueble | null = null;
  selectedHerraje: Herraje | null = null;

  constructor(
    private apiService: ApiService,
    private router: Router
  ) { }

   ngOnInit() {
    this.loadMuebles();
  }

  loadMuebles() {
    this.isloading = true;
    this.apiService.getAllMuebles().subscribe({
      next: (data: Mueble[]) => {
        this.muebles = data;
        this.isloading = false;
      },
      error: (err) => {
        console.error('Error cargando muebles', err);
        this.isloading = false;
      }
    });
  }
  deleteMueble(mueble: Mueble) {
    this.selectedMueble = mueble;
    this.showModal = true;
    console.log('Mueble seleccionado para eliminar:', mueble);
  }

    onConfirmMueble() {
    if (this.selectedMueble) {
      const muebleId = this.selectedMueble.id;
      this.isloading = true;

      this.apiService.deleteMueble(muebleId).subscribe({

        next: () => {
          this.onDelete.emit(muebleId);
          this.selectedMueble = null;
          this.showModal = false;
           this.isloading = false;
        },
        error: (error: Error) => {
          console.error('Error al eliminar el mueble', error)
          this.isloading = false;
        }

        
      });
       
    }

  }
    onCancelMueble() {
    this.showModal = false;
    this.selectedMueble = null;
  }
    onCloseHerrajes() {
    this.showModalHerrajes = false;
    this.selectedMueble = null;
    this.selectedHerraje = null;
  }
  openCardHerrajes(mueble: Mueble){
    this.selectedMueble = mueble;
    this.showModalHerrajes = true;
    console.log('abriendo modal para mueble:', mueble);
  }
  openModalEdit(mueble: Mueble) {
    this.selectedMueble = mueble;
    this.showModalEdit = true;
    console.log('abriendo modal para mueble:', mueble);
  }
   onCancelEdit() {
    this.showModalEdit = false;
    this.selectedMueble = null;
  }

    errorMessage: string = '';
  successMessage: string = '';
  loading = false;
  
   onGuardarMueble(mueble: Mueble) {
    console.log('Guardando mueble:', mueble);
    if (!mueble || !mueble.id) {
      this.errorMessage = 'El mueble no tiene un ID válido.';
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.apiService.editMueble(mueble.id, mueble).subscribe({
      next: (response) => {
        this.successMessage = 'Mueble actualizado con éxito ✅';
        console.log('Respuesta del servidor:', response);

        this.loading = false;
        this.onCancelEdit();

        // aquí podrías refrescar la lista de muebles
        this.loadMuebles();
      },
      error: (error) => {
        console.error('Error al actualizar el mueble:', error);

        if (error.status === 404) {
          this.errorMessage = 'Error: Mueble no encontrado.';
        } else if (error.status === 405) {
          this.errorMessage = 'Error: Método no permitido.';
        } else {
          this.errorMessage = 'Error al actualizar el mueble. Intenta de nuevo.';
        }

        this.loading = false;
      }
    });
  }

  cancelar() {
    this.router.navigate(['/home']);
  }

 

}
