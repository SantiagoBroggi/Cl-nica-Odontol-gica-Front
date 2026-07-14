import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

/**
 * Página "en construcción" reutilizable.
 *
 * Se usa como componente temporal para las rutas de los módulos que aún
 * no fueron desarrollados (Etapas 3 a 10), de forma que la navegación y el
 * sidebar completo ya sean navegables y demostrables desde la Etapa 1,
 * sin tener que esperar a tener cada módulo terminado.
 *
 * A medida que avancemos de etapa, cada ruta que hoy apunta a este
 * componente será reemplazada por la página real del módulo
 * correspondiente (ver TODOs en app.routes.ts).
 */
@Component({
  selector: 'app-placeholder-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './placeholder-page.component.html',
  styleUrl: './placeholder-page.component.scss',
})
export class PlaceholderPageComponent implements OnInit {
  @Input() titulo = 'Módulo';
  @Input() descripcion = 'Esta sección se desarrollará en una próxima etapa.';
  @Input() icono = 'construction';

  constructor(private readonly route: ActivatedRoute) {}

  /**
   * Si el componente se usa directamente como página ruteada (a través de
   * `loadComponent` + `data` en app.routes.ts), toma título/ícono/
   * descripción desde la data de la ruta. Si se usa embebido dentro de
   * otro componente (como en DashboardPageComponent), los @Input()
   * explícitos tienen prioridad.
   */
  ngOnInit(): void {
    const data = this.route.snapshot.data;
    this.titulo = data['titulo'] ?? this.titulo;
    this.icono = data['icono'] ?? this.icono;
    this.descripcion = data['descripcion'] ?? this.descripcion;
  }
}
