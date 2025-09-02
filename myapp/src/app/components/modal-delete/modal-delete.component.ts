import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LanguageService } from '../../services/language.service';
import { Mueble } from '../../models/herrajes.interface';

@Component({
  selector: 'app-modal-delete',
  imports: [],
  templateUrl: './modal-delete.component.html',
  styleUrl: './modal-delete.component.css'
})
export class ModalDeleteComponent {
  @Input() show: boolean = false;
  @Input() nombre: string | null = '';
  @Input() numero_piezas: string = '';
  isProcessing: boolean = false;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
   muebles: Mueble[] = []; // Array of muebles
  @Input() selectedMueble: string = ''; // Selected mueble name

  onCancel() {
    this.cancel.emit(); 
    this.isProcessing = false;

  }
  onConfirm() {
    this.isProcessing = true;
    setTimeout(() => {
      this.isProcessing = false;  
    }, 2000); 
 this.confirm.emit(); 
    }

   isSpanish: boolean = true;
  
    constructor(private languageService: LanguageService) {
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
    }
  
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }
}
