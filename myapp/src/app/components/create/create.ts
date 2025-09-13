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
})
export class Create {
  isSpanish: boolean = true;
  showAlert: boolean = false;

  createMueble!: FormGroup;   // 👈 declarada, pero no inicializada todavía

  constructor(
    private apiService: ApiService,
    private router: Router,
    private languageService: LanguageService,
    private fb: FormBuilder    // 👈 Angular inyecta aquí el FormBuilder
  ) {
    this.languageService.isSpanish$.subscribe(
      isSpanish => this.isSpanish = isSpanish
    );

    // 👇 Aquí sí ya existe fb
    this.createMueble = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      imagen: ['', [Validators.required, Validators.minLength(2)]],
      numero_piezas: [0, [Validators.required, Validators.min(1)]],
      herrajes: this.fb.array([])
    });
  }
  @Output() confirm = new EventEmitter<void>();

  getText(es: string, en: string): string {
    return this.isSpanish ? es : en;
  }


  
  onSubmit() {
    if (this.createMueble.invalid) {
      this.createMueble.markAllAsTouched();
      return;
    }

    let mueble: Mueble = {
      id: 0,
      nombre: this.createMueble.getRawValue().nombre,
      imagen: this.createMueble.getRawValue().imagen,
      numero_piezas: this.createMueble.getRawValue().numero_piezas,
      herrajes: this.createMueble.getRawValue().herrajes
    };
    this.showAlert = true;
    setTimeout(() => {
      this.showAlert = false;
      this.confirm.emit();
    }, 3000);

    console.log("Enviando datos:", mueble);
    this.apiService.createMueble(mueble).subscribe({
      next: (data) => {
        console.log('Mueble creado:', data);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al crear el mueble:', error);
      }
    });
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
}
