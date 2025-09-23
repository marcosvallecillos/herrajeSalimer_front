import { Component, EventEmitter, Output } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ApiService } from '../../services/api-service.service';
import { Router } from '@angular/router';
import { LanguageService } from '../../services/language.service';
import { Herraje, Mueble } from '../../models/herrajes.interface';

@Component({
  selector: 'app-create',
    imports: [ReactiveFormsModule],
  templateUrl: './create.html',
  styleUrls: ['./create.css']
})export class Create {
  isSpanish: boolean = true;
  showAlert: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';

  createMueble!: FormGroup;   

  constructor(
    private apiService: ApiService,
    private router: Router,
    private languageService: LanguageService,
    private fb: FormBuilder   
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );

    this.createMueble = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      imagen: ['', [Validators.required, Validators.minLength(2)]],
      numero_piezas: [0, [Validators.required, Validators.min(1)]],
      herrajes: this.fb.array([])
    });
  }

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }

  getControl(controlName: string) {
    return this.createMueble.get(controlName);
  }

  get herrajes(): FormArray {
    return this.createMueble.get('herrajes') as FormArray;
  }

  agregarHerraje() {
    const herrajeForm = this.fb.group({
      tipo: ['', Validators.required],
      cantidad: [1, [Validators.required, Validators.min(1)]]
    });
    this.herrajes.push(herrajeForm);
  }

  eliminarHerraje(index: number) {
    this.herrajes.removeAt(index);
  }

  onSubmit() {
    if (this.createMueble.invalid) {
      this.createMueble.markAllAsTouched();
      return;
    }

    const mueble: Mueble = {
      id: 0,
      nombre: this.createMueble.value.nombre,
      imagen: this.createMueble.value.imagen,
      numero_piezas: this.createMueble.value.numero_piezas,
      herrajes: this.createMueble.value.herrajes
    };

    this.showAlert = true;
    this.successMessage = '';
    this.errorMessage = '';

    this.apiService.createMueble(mueble).subscribe({
      next: (data) => {
        console.log('Mueble creado:', data);
        this.successMessage = this.getText('¡Mueble creado con éxito!', 'Furniture successfully created!');
        setTimeout(() => {
          this.showAlert = false;
          this.router.navigate(['/home']);
        }, 3000);
      },
      error: (error) => {
        console.error('Error al crear el mueble:', error);
        this.errorMessage = this.getText('¡Mueble creado sin éxito!', 'Furniture unsuccessfully created!');
        setTimeout(() => {
          this.showAlert = false;
        }, 3000);
      }
    });
  }
}
