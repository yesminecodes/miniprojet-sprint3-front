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
      next: (data) => {
        let jwToken = data.headers.get('Authorization')!;
        this.authService.saveToken(jwToken);
        this.router.navigate(['/games']);
      },
      error: (err) => {
        this.err = 1;
        if (err.error.errorCause == 'disabled')
          this.message = 'Utilisateur désactivé, Veuillez contacter votre Administrateur';
      },
    });
  }
}
