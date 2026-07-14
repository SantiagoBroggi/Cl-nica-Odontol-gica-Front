export interface PacienteReciente {
  id: string;
  nombreCompleto: string;
  iniciales: string;
  ultimaConsulta: Date;
  tratamientoActivo: string;
}