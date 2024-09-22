import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  registerUsername: string = '';
  registerPassword: string = '';

  constructor(private userService: UserService, private router: Router) { }

  registerUser() {
    this.userService.registerUser(this.registerUsername, this.registerPassword).subscribe({
      next: (user) => {
        console.log('User registered:', user);
        this.router.navigate(['/chat']); // Redirige al chat después del registro
      },
      error: (err) => console.error('Registration error:', err)
    });
  }
}
