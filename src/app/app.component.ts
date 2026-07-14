import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

/**
 * Componente raíz de la aplicación.
 *
 * Se mantiene deliberadamente "tonto": todo el layout (sidebar, navbar)
 * vive en `core/layout/shell/shell.component.ts`, que se monta como
 * componente de la ruta raíz en `app.routes.ts`. Esto deja a AppComponent
 * libre para, en el futuro, envolver cosas transversales a nivel de toda
 * la app (ej. un splash screen de carga inicial o un manejador global de
 * errores) sin tocar el layout de negocio.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
