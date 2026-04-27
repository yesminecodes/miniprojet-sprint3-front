import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../model/user.model';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule,RouterLink],
  templateUrl: './login.html',
})
export class Login {
  err: number = 0;
  user = new User();
  message: string = 'login ou mot de passe erronés..';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onLoggedin() {
  this.authService.login(this.user).subscribe({
    next: (response) => {
      const token = response.headers.get('Authorization');

      if (!token) {
        this.err = 1;
        this.message = "Token missing";
        return;
      }

      this.authService.saveToken(token);
      this.router.navigate(['/games']);
    },

    error: () => {
      this.err = 1;
      this.message = 'Login ou mot de passe erronés';
    }
  });
}
}
