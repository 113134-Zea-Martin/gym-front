import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleAuthService } from '../../../core/services/auth-google.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnDestroy {
  showPassword: boolean = false;
  showErrorModal: boolean = false;
  suscriptions: Subscription[] = [];

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
  loginWithGoogle() {
    // Lógica para iniciar sesión con Google
    console.log('Iniciar sesión con Google');
    this.googleAuthService.loginWithGoogle(token => {
      // Enviar token al backend
      console.log(token);
      const loginWithGoogleRequest = { tokenId: token };
      const sub = this.authService.loginGoogleUser(loginWithGoogleRequest).subscribe({
        next: (response) => {
          console.log('Login exitoso con Google:', response);
          localStorage.setItem('auth_token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error en el login con Google:', error);
          this.errorMessage = error.error.error || 'Error desconocido';
          this.showErrorModal = true;
          this.cdr.detectChanges();
        }
      });
      this.suscriptions.push(sub);
    });

  }
  errorMessage: string = '';
  closeErrorModal() {
    this.showErrorModal = false;
    this.errorMessage = '';
    this.cdr.detectChanges();
  }

  loginFormGroup: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  });

  onSubmit() {
    console.log(this.loginFormGroup.value);
    if (this.loginFormGroup.valid) {
      // Lógica de envío del formulario
      const email = this.loginFormGroup.get('email')?.value;
      const password = this.loginFormGroup.get('password')?.value;
      const loginUser = { email, password };
      console.log(loginUser);
      const sub = this.authService.loginLocalUser(loginUser).subscribe({
        next: (response) => {
          console.log('Login exitoso:', response);
          localStorage.setItem('auth_token', response.token);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          console.error('Error en el login:', error);
          this.errorMessage = error.error.error || 'Error desconocido';
          this.showErrorModal = true;
          this.cdr.detectChanges();
        }
      });
      this.suscriptions.push(sub);
    }
  }

  constructor(private cdr: ChangeDetectorRef,
    private authService: AuthService,
    private googleAuthService: GoogleAuthService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.suscriptions.forEach(sub => sub.unsubscribe());
  }
}
