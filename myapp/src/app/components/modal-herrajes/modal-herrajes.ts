import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Herraje, Mueble } from '../../models/herrajes.interface';
import { LanguageService } from '../../services/language.service';

@Component({
  selector: 'app-modal-herrajes',
  imports: [],
  templateUrl: './modal-herrajes.html',
  styleUrl: './modal-herrajes.css'
})
export class ModalHerrajes {
  @Input() show: boolean = false;
    @Input() nombre: string | null = '';

  @Input() tipo: string | null = '';
  @Input() cantidad: string = '';
  isProcessing: boolean = false;
  @Output() close = new EventEmitter<void>();
   Herraje: Herraje[] = [];
   mueble: Mueble[] = [];
  @Input() selectedMueble: string = '';
  isSpanish: boolean = true;
  
    constructor(private languageService: LanguageService) {
      this.languageService.isSpanish$.subscribe(
        isSpanish => this.isSpanish = isSpanish
      );
    }
  
    getText(es: string, en: string): string {
      return this.isSpanish ? es : en;
    }

      onClose() {
    this.close.emit();
    console.log('Modal closed');
  }
}
