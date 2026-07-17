import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

import { UsuariosService } from '../../services/usuarios.service';
import { ROL_USUARIO_LABELS, Usuario, inicialesUsuario, nombreCompletoUsuario } from '../../models/usuario.model';
import { AvatarInicialesComponent } from '../../../../shared/components/avatar-iniciales/avatar-iniciales.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import {
  UsuarioFormDialogComponent,
  UsuarioFormDialogData,
} from '../../components/usuario-form-dialog/usuario-form-dialog.component';

@Component({
  selector: 'app-usuarios-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatTooltipModule, MatSlideToggleModule, AvatarInicialesComponent],
  templateUrl: './usuarios-page.component.html',
})
export class UsuariosPageComponent {
  private readonly usuariosService = inject(UsuariosService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly usuarios = this.usuariosService.usuarios;
  readonly rolLabels = ROL_USUARIO_LABELS;

  readonly nombreCompletoUsuario = nombreCompletoUsuario;
  readonly inicialesUsuario = inicialesUsuario;

  abrirNuevoUsuario(): void {
    const ref = this.dialog.open<UsuarioFormDialogComponent, UsuarioFormDialogData>(UsuarioFormDialogComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: { usuario: null },
    });

    ref.afterClosed().subscribe((valores) => {
      if (!valores) return;
      this.usuariosService.crear(valores);
      this.snackBar.open('Usuario creado correctamente.', 'Cerrar', { duration: 3000 });
    });
  }

  abrirEditarUsuario(usuario: Usuario): void {
    const ref = this.dialog.open<UsuarioFormDialogComponent, UsuarioFormDialogData>(UsuarioFormDialogComponent, {
      width: '560px',
      maxWidth: '95vw',
      data: { usuario },
    });

    ref.afterClosed().subscribe((valores) => {
      if (!valores) return;
      this.usuariosService.actualizar(usuario.id, valores);
      this.snackBar.open('Usuario actualizado correctamente.', 'Cerrar', { duration: 3000 });
    });
  }

  toggleActivo(usuario: Usuario): void {
    this.usuariosService.toggleActivo(usuario.id);
  }

  confirmarEliminar(usuario: Usuario): void {
    const data: ConfirmDialogData = {
      titulo: 'Eliminar usuario',
      mensaje: `¿Confirmás que querés eliminar a ${nombreCompletoUsuario(usuario)}? Esta acción no se puede deshacer.`,
      textoConfirmar: 'Eliminar',
      peligroso: true,
    };

    const ref = this.dialog.open(ConfirmDialogComponent, { width: '420px', data });

    ref.afterClosed().subscribe((confirmado) => {
      if (!confirmado) return;
      this.usuariosService.eliminar(usuario.id);
      this.snackBar.open('Usuario eliminado.', 'Cerrar', { duration: 3000 });
    });
  }
}