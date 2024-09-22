import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ChatService } from 'src/app/service/chat.service';
import { WebSocketService } from 'src/app/service/websocket.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  messages: any[] = [];
  messageContent: string = '';

  currentUser: string = ''; // Ahora será dinámico
  recipientUser: string = ''; // Ahora será dinámico

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private webSocketService: WebSocketService
  ) {}

  ngOnInit(): void {
    // Recuperar los parámetros de la ruta
    this.route.paramMap.subscribe(params => {
      this.currentUser = params.get('sender') || ''; // Establece currentUser con el parámetro 'sender'
      this.recipientUser = params.get('receiver') || ''; // Establece recipientUser con el parámetro 'receiver'

      if (this.currentUser) {
        localStorage.setItem('currentUser', this.currentUser);
      }

      // Carga la conversación existente al iniciar el componente
      this.chatService.getConversation(this.currentUser, this.recipientUser).subscribe((messages) => {
        this.messages = messages;
      });
    });

    // Escucha los mensajes entrantes
    this.webSocketService.getMessages().subscribe((message) => {
      console.log(message);
      if (message.sender === this.recipientUser && message.receiver === this.currentUser) {
        this.messages.push(message);
      }
    });
  }

  sendMessage(): void {
    let message = {
      id: new Date().getTime(),
      sender: this.currentUser,
      receiver: this.recipientUser,
      content: this.messageContent,
      timestamp: new Date()
    };

    if (this.messageContent.trim()) {
      this.chatService.sendMessage(message).subscribe(() => {
        this.messageContent = ''; // Limpia el campo del mensaje
        this.messages.push(message);
      });
      // Envia el mensaje al WebSocket
      this.webSocketService.sendMessage1(message);
    }
  }
}
