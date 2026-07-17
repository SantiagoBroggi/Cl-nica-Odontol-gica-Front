import { Routes } from '@angular/router';
import { ShellComponent } from './core/layout/shell/shell.component';
import { PlaceholderPageComponent } from './shared/components/placeholder-page/placeholder-page.component';

import { authGuard } from './core/guards/auth.guard';
import { rolGuard } from './core/guards/rol.guard';

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
    path: 'login',
    loadComponent: () =>
      import('./core/auth/login-page/login-page.component').then((m) => m.LoginPageComponent),
    title: 'Ingresar · DentalCare Suite',
  },
  {
    path: '',
    component: ShellComponent,
    canActivate: [authGuard],
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
      // Etapa 5: Historia Clínica (antecedentes + evolución clínica).
      {
        path: 'historia-clinica',
        loadComponent: () =>
          import(
            './modules/historia-clinica/pages/historia-clinica-selector-page/historia-clinica-selector-page.component'
          ).then((m) => m.HistoriaClinicaSelectorPageComponent),
        title: 'Historia Clínica · DentalCare Suite',
      },
      {
        path: 'historia-clinica/:id',
        loadComponent: () =>
          import('./modules/historia-clinica/pages/historia-clinica-page/historia-clinica-page.component').then(
            (m) => m.HistoriaClinicaPageComponent
          ),
        title: 'Historia Clínica · DentalCare Suite',
      },
      // Etapa 7: Gestión de tratamientos (planificación, seguimiento y etapas).
      {
        path: 'tratamientos',
        loadComponent: () =>
          import('./modules/tratamientos/pages/tratamientos-page/tratamientos-page.component').then(
            (m) => m.TratamientosPageComponent
          ),
        title: 'Tratamientos · DentalCare Suite',
      },
      // Etapa 6: Odontograma (mapa visual de piezas dentales y su estado).
      {
        path: 'odontograma',
        loadComponent: () =>
          import(
            './modules/odontograma/pages/odontograma-selector-page/odontograma-selector-page.component'
          ).then((m) => m.OdontogramaSelectorPageComponent),
        title: 'Odontograma · DentalCare Suite',
      },
      {
        path: 'odontograma/:id',
        loadComponent: () =>
          import('./modules/odontograma/pages/odontograma-page/odontograma-page.component').then(
            (m) => m.OdontogramaPageComponent
          ),
        title: 'Odontograma · DentalCare Suite',
      },
      // Etapa 8: Facturación (registro de pagos y resumen de cuentas corrientes).
      {
        path: 'facturacion',
        loadComponent: () =>
          import('./modules/facturacion/pages/facturacion-page/facturacion-page.component').then(
            (m) => m.FacturacionPageComponent
          ),
        title: 'Facturación · DentalCare Suite',
      },
      // Etapa 9: Reportes (dashboard estadístico de tendencias y distribuciones).
      {
        path: 'reportes',
        loadComponent: () =>
          import('./modules/reportes/pages/reportes-page/reportes-page.component').then(
            (m) => m.ReportesPageComponent
          ),
        title: 'Reportes · DentalCare Suite',
      },
      // Etapa 10: Gestión de usuarios (alta, baja y edición de cuentas de usuario).
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./modules/usuarios/pages/usuarios-page/usuarios-page.component').then(
            (m) => m.UsuariosPageComponent
          ),
        canActivate: [rolGuard],
        data: { rolesPermitidos: ['admin'] },
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
