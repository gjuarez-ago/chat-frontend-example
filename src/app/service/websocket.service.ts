import { Injectable } from '@angular/core';
import { Client, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: Client | undefined;
  private connectedSubject = new BehaviorSubject<boolean>(false);
  public connected$ = this.connectedSubject.asObservable();
  private messagesSubject = new Subject<any>();

  constructor() {
    this.initConnectionSocket();
  }

  private initConnectionSocket() {
    const url = 'http://localhost:8080/ws';
    const socket = new SockJS(url);
    
    this.stompClient = new Client({
      webSocketFactory: () => socket,
      debug: (str) => console.log(new Date(), str),
      onConnect: (frame) => {
        console.log('Connected: ' + frame);
        this.connectedSubject.next(true);
        
        // Suscribirse al canal correcto
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
          this.stompClient!.subscribe(`/topic/chat/${currentUser}`, (message) => {
            console.log('Received message:', message.body);
            this.messagesSubject.next(JSON.parse(message.body));
          });
        }

      },
      onDisconnect: (frame) => {
        console.log('Disconnected: ' + frame);
        this.connectedSubject.next(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      }
    });

    this.stompClient.activate();
  }

  // Método para enviar mensajes
  sendMessage1(message: any) {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.publish({
        body: JSON.stringify(message),
        destination: '/app/chat',
      });
    } else {
      console.error('STOMP client is not connected.');
    }
  }

  // Método para obtener los mensajes recibidos
  getMessages() {
    return this.messagesSubject.asObservable();
  }
}
