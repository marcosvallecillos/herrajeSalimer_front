import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Mueble } from '../../models/herrajes.interface';
import { LanguageService } from '../../services/language.service';
import { FormsModule } from '@angular/forms';
import { CommonModule, NgClass } from '@angular/common';
import { ApiService } from '../../services/api-service.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-modal-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './modal-edit.html',
  styleUrl: './modal-edit.css'
})
export class ModalEdit implements OnChanges {
  @Input() show: boolean = false;
  @Input() nombre: string | null = '';
  @Input() numero_piezas: string = '';
  isProcessing: boolean = false;
  errors: { [key: string]: string } = {};
  loading = false;
  successMessage: string = '';
  errorMessage: string = '';
  muebleId: number = 0;
  @Output() confirm = new EventEmitter<Mueble>();
  @Output() cancel = new EventEmitter<void>();
  muebles: Mueble | null = null; 
  @Input() selectedMueble: Mueble | null = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedMueble'] && this.selectedMueble) {
      // Crear una copia editable y fijar el ID
      this.muebles = { ...this.selectedMueble } as Mueble;
      this.muebleId = this.selectedMueble.id;
    }
  }

  onCancel() {
    this.cancel.emit(); 
    this.isProcessing = false;

  }
  onConfirm() {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;  
    }, 2000); 
 this.confirm.emit(this.muebles as Mueble); 
    }

   isSpanish: boolean = true;
  
    constructor(private languageService: LanguageService , private apiService: ApiService, private router: Router ) {
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
    }
  
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }
 validarFormulario(): boolean {
    this.errors = {};

    if (!this.muebles) {
      this.errorMessage = this.getText('Datos de mueble no disponibles', 'User data not available');
      return false;
    }

    // Nombre validation
    if (!this.muebles.nombre || String(this.muebles.nombre).trim() === '') {
      this.errors['nombre'] = this.getText('El nombre es obligatorio', 'Name is required');
    }

    // Imagen validation
    if (!this.muebles.imagen || String(this.muebles.imagen).trim() === '') {
      this.errors['imagen'] = this.getText('La imagen es obligatoria', 'The image is required');
    } else if (!this.validarImagen(this.muebles.imagen)) {
      this.errors['imagen'] = this.getText('La imagen no es válido', 'Image is not valid');
    }

    // Num_pieces validation
    if (!this.muebles.numero_piezas || Number(this.muebles.numero_piezas) == 0) {
      this.errors['num_piezas'] = this.getText('El numero de piezas es obligatorio', 'Email is required');
    }

    // Herrajes validation
    if (!this.muebles.herrajes || String(this.muebles.herrajes).trim() === '') {
      this.errors['herrajes'] = this.getText('El teléfono es obligatorio', 'Phone is required');
    } 

  
    return Object.keys(this.errors).length === 0;
  }

  validarImagen(nombreArchivo: string): boolean {
  const re = /\.(jpg|jpeg|png|gif|webp|bmp|svg)$/i;
  return re.test(nombreArchivo);
}
     guardarCambios() {
  if (this.validarFormulario() && this.muebles && this.muebleId > 0) {
    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    console.log('Enviando datos al servidor:', this.muebles);
    console.log('ID del mueble:', this.muebleId);

    this.muebles.id = this.muebleId;

    this.apiService.editMueble(this.muebleId, this.muebles).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);

        this.successMessage = this.getText(
          'Mueble actualizado con éxito',
          'Furniture updated successfully'
        );

        // 👉 Emitir confirm al padre con los datos actualizados
        this.confirm.emit(this.muebles as Mueble);

        setTimeout(() => {
          this.router.navigate(['/home']);
          this.loading = false;
        }, 1500);
      },
      error: (error) => {
        console.error('Error al actualizar el mueble:', error);

        if (error.status === 405) {
          this.errorMessage = this.getText(
            'Error: Método no permitido. Por favor, contacte al administrador.',
            'Error: Method not allowed. Please contact the administrator.'
          );
        } else if (error.status === 404) {
          this.errorMessage = this.getText(
            'Error: Mueble no encontrado.',
            'Error: Furniture not found.'
          );
        } else {
          this.errorMessage = this.getText(
            'Error al actualizar el mueble. Por favor, intente de nuevo.',
            'Error updating furniture. Please try again.'
          );
        }

        this.loading = false;
      }
    });
  } else {
    if (this.muebleId <= 0) {
      this.errorMessage = this.getText(
        'Error: ID de mueble no válido.',
        'Error: Invalid furniture ID.'
      );
    }
  }
}


}
