import { NavItem } from '../models/nav-item.model';

/**
 * Definición única del menú principal del sistema.
 *
 * Se mantiene como una constante (no un servicio con estado) porque, por
 * ahora, es información estática de configuración. El día que el menú
 * dependa de permisos de backend, esta constante pasa a ser el "seed" de
 * un NavService que filtre por rol (core/services/nav.service.ts).
 */
export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', route: '/dashboard', icon: 'space_dashboard' },
  { label: 'Pacientes', route: '/pacientes', icon: 'groups' },
  { label: 'Agenda', route: '/turnos', icon: 'calendar_month' },
  { label: 'Historia Clínica', route: '/historia-clinica', icon: 'folder_shared' },
  { label: 'Tratamientos', route: '/tratamientos', icon: 'medical_services' },
  { label: 'Odontograma', route: '/odontograma', icon: 'dentistry' },
  { label: 'Facturación', route: '/facturacion', icon: 'receipt_long' },
  { label: 'Reportes', route: '/reportes', icon: 'monitoring' },
  { label: 'Usuarios', route: '/usuarios', icon: 'admin_panel_settings', roles: ['admin'] },
  { label: 'Configuración', route: '/configuracion', icon: 'settings' },
];
