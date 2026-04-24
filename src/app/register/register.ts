import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../model/user.model';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  public user = new User();
  confirmPassword?: string;
  myForm!: FormGroup;
  err: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,   
    private router: Router,
    private toaster: ToastrService
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
    });
  }

  onRegister() {
    this.authService.registerUser(this.user).subscribe({
      next: (res) => {                                        
        this.toaster.success("Veuillez confirmer votre email","Confirmation");
        this.router.navigate(["/verifEmail", this.user.email]);  
      },
      error: (err: any) => {
        if (err.status === 400) {                          
          this.err = err.error.message;
        }
      }
    });
  }
}