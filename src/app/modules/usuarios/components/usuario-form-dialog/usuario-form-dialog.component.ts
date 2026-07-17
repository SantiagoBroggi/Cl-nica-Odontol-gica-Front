import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { RolUsuario } from '../../../../core/models/usuario-sesion.model';
import { ROL_USUARIO_LABELS, Usuario, UsuarioFormValue } from '../../models/usuario.model';

export interface UsuarioFormDialogData {
  usuario: Usuario | null;
}

/**
 * Diálogo de alta/edición de un usuario del sistema.
 *
 * Mismo patrón que los demás formularios del proyecto: un componente
 * para alta y edición, precargando con `patchValue` si `data.usuario`
 * viene definido.
 */
@Component({
  selector: 'app-usuario-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './usuario-form-dialog.component.html',
})
export class UsuarioFormDialogComponent {
  private readonly fb = new FormBuilder();

  readonly dialogRef = inject(MatDialogRef<UsuarioFormDialogComponent, UsuarioFormValue | undefined>);
  readonly data = inject<UsuarioFormDialogData>(MAT_DIALOG_DATA);

  readonly esEdicion = !!this.data.usuario;
  readonly rolesDisponibles = Object.entries(ROL_USUARIO_LABELS) as [RolUsuario, string][];

  readonly form = this.fb.group({
    nombre: ['', [Validators.required, Validators.minLength(2)]],
    apellido: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    rol: this.fb.control<RolUsuario>('recepcionista', { nonNullable: true }),
    activo: this.fb.control<boolean>(true, { nonNullable: true }),
  });

  constructor() {
    const u = this.data.usuario;
    if (u) {
      this.form.patchValue({
        nombre: u.nombre,
        apellido: u.apellido,
        email: u.email,
        rol: u.rol,
        activo: u.activo,
      });
    }
  }

  guardar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const valores = this.form.getRawValue();
    const resultado: UsuarioFormValue = {
      nombre: valores.nombre!.trim(),
      apellido: valores.apellido!.trim(),
      email: valores.email!.trim().toLowerCase(),
      rol: valores.rol,
      activo: valores.activo,
    };

    this.dialogRef.close(resultado);
  }

  cancelar(): void {
    this.dialogRef.close(undefined);
  }
}