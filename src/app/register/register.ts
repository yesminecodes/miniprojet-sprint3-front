import { Component, ChangeDetectorRef, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html'
})
export class Register implements OnInit {
  myForm!: FormGroup;
  err: string = '';
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toaster: ToastrService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.myForm = this.formBuilder.group(
      {
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );
  }

  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    if (password && confirmPassword && password !== confirmPassword) {
      control.get('confirmPassword')?.setErrors({ mismatch: true });
      return { mismatch: true };
    }
    return null;
  }

  onRegister() {
    if (this.myForm.invalid) return;

    this.loading = true;
    this.err = '';

    const formData = this.myForm.value;

    this.authService.registerUser(formData).subscribe({
      next: (res) => {
        this.authService.setRegistredUser({
          email: formData.email,
          password: formData.password,
          username: formData.username,
          roles: [],
          enabled: false,
        });

        this.toaster.success('Veuillez confirmer votre email', 'Confirmation');
        this.router.navigate(['/verifEmail', formData.email]);
      },
      error: (err: any) => {
        this.loading = false;
        if (err.status === 400) {
          this.err = err.error?.message || 'Une erreur est survenue.';
        } else {
          this.err = 'Une erreur est survenue. Veuillez réessayer.';
        }
        this.cdr.detectChanges(); 
      },
    });
  }
}
