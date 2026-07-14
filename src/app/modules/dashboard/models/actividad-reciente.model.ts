export type TipoActividad = 'turno' | 'pago' | 'tratamiento' | 'paciente' | 'historia-clinica';

export interface ActividadReciente {
  id: string;
  tipo: TipoActividad;
  icono: string;
  descripcion: string;
  autor: string;
  fecha: Date;
}