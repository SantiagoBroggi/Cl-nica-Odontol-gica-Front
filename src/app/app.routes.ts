import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell/shell.component';
import { PlaceholderPageComponent } from './shared/components/placeholder-page/placeholder-page.component';

/**
 * Ruteo principal de la aplicación.
 *
 * Todas las rutas de negocio cuelgan de `ShellComponent` como ruta padre
 * sin `path` (ruta "componente layout"), de forma que el sidebar y la
 * navbar se rendericen una única vez y el <router-outlet> del shell sea
 * el que cambie de contenido al navegar entre módulos.
 *
 * Cada módulo se carga de forma perezosa (`loadComponent`) para no
 * inflar el bundle inicial: aunque hoy la mayoría apunta a un
 * `PlaceholderPageComponent` compartido, el `import()` dinámico ya deja
 * preparado el patrón que se va a usar cuando cada módulo tenga su
 * propia página real (Etapas 2 a 10).
 */
export const routes: Routes = [
  {
    path: '',
    component: ShellComponent,
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./modules/dashboard/pages/dashboard-page/dashboard-page.component').then(
            (m) => m.DashboardPageComponent
          ),
        title: 'Dashboard · DentalCare Suite',
      },
      {
        path: 'pacientes',
        loadComponent: () =>
          import('./modules/pacientes/pages/pacientes-list-page/pacientes-list-page.component').then(
            (m) => m.PacientesListPageComponent
          ),
        title: 'Pacientes · DentalCare Suite',
      },
      {
        path: 'turnos',
        loadComponent: () =>
          import('./modules/turnos/pages/turnos-page/turnos-page.component').then((m) => m.TurnosPageComponent),
        title: 'Agenda · DentalCare Suite',
      },
      {
        // TODO(Etapa 5): reemplazar por historia clínica del paciente.
        path: 'historia-clinica',
        loadComponent: () => Promise.resolve(PlaceholderPageComponent),
        data: {
          titulo: 'Historia Clínica',
          icono: 'folder_shared',
          descripcion: 'Antecedentes médicos y evolución clínica del paciente (Etapa 5).',
        },
        title: 'Historia Clínica · DentalCare Suite',
      },
      {
        // TODO(Etapa 7): reemplazar por la gestión de tratamientos.
        path: 'tratamientos',
        loadComponent: () => Promise.resolve(PlaceholderPageComponent),
        data: {
          titulo: 'Tratamientos',
          icono: 'medical_services',
          descripcion: 'Seguimiento de tratamientos, etapas y costos (Etapa 7).',
        },
        title: 'Tratamientos · DentalCare Suite',
      },
      {
        // TODO(Etapa 6): reemplazar por el odontograma digital interactivo.
        path: 'odontograma',
        loadComponent: () => Promise.resolve(PlaceholderPageComponent),
        data: {
          titulo: 'Odontograma',
          icono: 'dentistry',
          descripcion: 'Representación gráfica dental por paciente (Etapa 6).',
        },
        title: 'Odontograma · DentalCare Suite',
      },
      {
        // TODO(Etapa 8): reemplazar por presupuestos, pagos y deudas.
        path: 'facturacion',
        loadComponent: () => Promise.resolve(PlaceholderPageComponent),
        data: {
          titulo: 'Facturación',
          icono: 'receipt_long',
          descripcion: 'Presupuestos, pagos y estado de cuenta de pacientes (Etapa 8).',
        },
        title: 'Facturación · DentalCare Suite',
      },
      {
        // TODO(Etapa 9): reemplazar por el dashboard estadístico de reportes.
        path: 'reportes',
        loadComponent: () => Promise.resolve(PlaceholderPageComponent),
        data: {
          titulo: 'Reportes',
          icono: 'monitoring',
          descripcion: 'Estadísticas de pacientes, ingresos y tratamientos (Etapa 9).',
        },
        title: 'Reportes · DentalCare Suite',
      },
      {
        // TODO(Etapa 10): reemplazar por la gestión de usuarios y permisos.
        path: 'usuarios',
        loadComponent: () => Promise.resolve(PlaceholderPageComponent),
        data: {
          titulo: 'Usuarios',
          icono: 'admin_panel_settings',
          descripcion: 'Administración de usuarios, roles y permisos (Etapa 10).',
        },
        title: 'Usuarios · DentalCare Suite',
      },
      {
        path: 'configuracion',
        loadComponent: () => Promise.resolve(PlaceholderPageComponent),
        data: {
          titulo: 'Configuración',
          icono: 'settings',
          descripcion: 'Preferencias generales del sistema.',
        },
        title: 'Configuración · DentalCare Suite',
      },
      { path: '**', redirectTo: 'dashboard' },
    ],
  },
];
