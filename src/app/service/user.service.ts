import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/api/users'; // Ajusta la URL según sea necesario

  constructor(private http: HttpClient) { }

  registerUser(username: string, password: string): Observable<any> {
    // Crear un objeto FormData
    const formData: FormData = new FormData();
    formData.append('username', username);
    formData.append('password', password);

    // Enviar el FormData
    return this.http.post<any>(`${this.apiUrl}/register`, formData);
  }

  loginUser(username: string, password: string): Observable<any> {
    // Necesitarás implementar el método de login en tu backend
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }
}
