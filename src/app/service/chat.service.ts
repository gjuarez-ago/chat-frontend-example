import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private apiUrl = 'http://localhost:8080/api/chat'; // Ajusta la URL según sea necesario
  private messagesSubject = new Subject<any>();

  constructor(private http: HttpClient) { }

  // Método para enviar un mensaje
  sendMessage(message : any): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('sender', message.sender);
    formData.append('receiver', message.receiver);
    formData.append('content', message.content);
    formData.append('timestamp', message.timestamp);
    formData.append('id', message.id);

    return this.http.post<any>(`${this.apiUrl}/send`, formData );
  }

  // Método para obtener la conversación entre dos usuarios
  getConversation(user1: string, user2: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/conversation?user1=${user1}&user2=${user2}`);
  }

  // Método para recibir mensajes a través del WebSocket
  getMessages(): Observable<any> {
    return this.messagesSubject.asObservable();
  }

  // Método para recibir mensajes del WebSocket (esto debería ser manejado en el servicio WebSocket, pero lo incluyo aquí para referencia)
  public handleIncomingMessages(message: any) {
    this.messagesSubject.next(message);
  }
}
