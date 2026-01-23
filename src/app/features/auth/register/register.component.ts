import { ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest, RegisterWithGoogleRequest } from '../register';
import { CommonModule } from '@angular/common';
import { GoogleAuthService } from '../../../core/services/auth-google.service';


declare const google: any; // ← AGREGAR ESTA LÍNEA

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnDestroy, OnInit {

  showPassword: boolean = false;
  showConfirmPassword: boolean = false;


  showErrorModal = false;
  errorMessage = '';

  constructor(private authService: AuthService,
    private router: Router,
    private googleAuth: GoogleAuthService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit() {
  }

  login() {
    this.googleAuth.loginWithGoogle(token => {
      // Enviar token al backend
      console.log(token);
      this.decodeJWT(token);
      console.log(this.decodeJWT(token));
      const registerWithGoogleRequest: RegisterWithGoogleRequest = { tokenId: token };
      console.log(registerWithGoogleRequest);
      this.registerUserInBackend(registerWithGoogleRequest);
    });
  }

  private decodeJWT(token: string): any {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
  }

  private registerUserInBackend(registerWithGoogleRequest: RegisterWithGoogleRequest) {
    const sub = this.authService.registerGoogleUser(registerWithGoogleRequest).subscribe({
      next: (response) => {
        console.log('Google registration successful', response);
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        console.error('Google registration failed', error);
        this.errorMessage = error.error?.error || 'Registration failed. Please try again.';
        this.showErrorModal = true;
        this.cdr.detectChanges();
      }
    });
    this.suscriptions.push(sub);
    console.log('Enviar al backend el credential:', registerWithGoogleRequest);
  }

  passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ ...confirmPassword.errors, mismatch: true });
      return { mismatch: true };
    } else {
      // Limpiar el error de mismatch si las contraseñas coinciden
      if (confirmPassword?.hasError('mismatch')) {
        const errors = { ...confirmPassword.errors };
        delete errors['mismatch'];
        confirmPassword.setErrors(Object.keys(errors).length > 0 ? errors : null);
      }
      return null;
    }
  }

  registerFormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  }, { validators: this.passwordMatchValidator }
  );

  suscriptions: Subscription[] = [];

  ngOnDestroy(): void {
    this.suscriptions.forEach(sub => sub.unsubscribe());
  }

  onSubmit() {
    if (this.registerFormGroup.valid) {
      const email = this.registerFormGroup.get('email')?.value ?? '';
      const password = this.registerFormGroup.get('password')?.value ?? '';
      const newUser: RegisterRequest = { email: email, password: password };
      const sub = this.authService.registerLocalUser(newUser).subscribe({
        next: (response) => {
          console.log('Registration successful', response);
          this.router.navigate(['/auth/login']);
        },
        error: (error) => {
          console.error('Registration failed', error);
          console.log(error.error);
          this.errorMessage = error.error || 'Registration failed. Please try again.';
          this.showErrorModal = true;
          this.cdr.detectChanges();
        }
      });
      this.suscriptions.push(sub);
    }
  }

  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  togglePasswordVisibility(field: 'password' | 'confirmPassword') {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
