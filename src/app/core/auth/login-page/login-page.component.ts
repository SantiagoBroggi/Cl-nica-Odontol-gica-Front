import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../auth.service';

/**
 * Pantalla de login. No cuelga de `ShellComponent`: no tiene sidebar ni
 * navbar, es una ruta hermana en `app.routes.ts`. Incluye accesos
 * rápidos a los 3 usuarios de prueba (uno por rol) para no tener que
 * recordar contraseñas en un proyecto de portfolio sin backend real.
 */
@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  templateUrl: './login-page.component.html',
})
export class LoginPageComponent {
  private readonly fb = new FormBuilder();
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly errorLogin = signal<string | null>(null);

  readonly cuentasDePrueba = [
    { email: 'admin@dentalcare.com', label: 'Administrador' },
    { email: 'lucia.fernandez@dentalcare.com', label: 'Odontólogo/a' },
    { email: 'recepcion@dentalcare.com', label: 'Recepcionista' },
  ];

  readonly form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
  });

  ingresar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email } = this.form.getRawValue();
    const resultado = this.authService.iniciarSesion(email!);

    if (!resultado.exito) {
      this.errorLogin.set(resultado.error ?? 'No se pudo iniciar sesión.');
      return;
    }

    this.errorLogin.set(null);
    this.router.navigateByUrl('/dashboard');
  }

  usarCuentaDePrueba(email: string): void {
    this.form.patchValue({ email, password: 'demo1234' });
    this.ingresar();
  }
}