import { Injectable,  } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError, tap } from 'rxjs';
import { Herraje, Mueble } from '../models/herrajes.interface';
@Injectable({
  providedIn: 'root'
})
export class ApiService {
private apiUrlMuebles = 'http://localhost:8000/api/mueble';
private apiUrlHerrajes = 'http://localhost:8000/api/herrajes';

public muebles: Mueble[] = [];
private herrajes: Herraje[] = [];

constructor(private http: HttpClient) { }

getAllMuebles(): Observable<Mueble[]> {
    return this.http.get<Mueble[]>(`${this.apiUrlMuebles}`);

} 
showMueble(id: number):Observable<Mueble>{
  return this.http.get<Mueble>(`${this.apiUrlMuebles}/${id}`)
}
editMueble(id: number, muebleData: Mueble): Observable<Mueble> {
  return this.http.put<Mueble>(`${this.apiUrlMuebles}/${id}/edit`, muebleData);
}
deleteMueble(id: number): Observable<any> {
  return this.http.delete<any>(`${this.apiUrlMuebles}/delete/${id}`);
}
createMueble(muebleData: Mueble): Observable<Mueble> {
  return this.http.post<Mueble>(`${this.apiUrlMuebles}/new`, muebleData);
}
searchMuebles(query: string): Observable<Mueble[]> {
  return this.http.get<Mueble[]>(`${this.apiUrlMuebles}/search?nombre=${query}`);
}
}