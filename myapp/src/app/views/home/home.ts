import { Component, OnInit } from '@angular/core';
import { Card } from '../../components/card/card';
import { ApiService } from '../../services/api-service.service';
import { Mueble } from '../../models/herrajes.interface';
import { Form } from '../../components/form/form';
import { Search } from '../../components/search/search';

@Component({
  selector: 'app-home',
  imports: [Card,Form,Search],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {
  muebles: Mueble[] = [];

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.apiService.getAllMuebles().subscribe({
      next: (data: Mueble[]) => {
        this.muebles = data;
      },
      error: (error: Error) => {
        console.error('Error al cargar muebles', error);
      }
    });
  }

  removeMueble(muebleId: number): void {
    this.muebles = this.muebles.filter((mueble: Mueble) => mueble.id !== muebleId);
  }


  showForm: boolean = true;
  searchTerm: string = '';

  onSearchSubmitted(term: string) {
    this.searchTerm = term;
    this.showForm = false;
  }

  onBackToForm() {
    this.showForm = true;
    this.searchTerm = '';
  }
}
