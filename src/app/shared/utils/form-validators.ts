import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validadores custom para Reactive Forms.
 *
 * Viven en `shared/utils` porque no son específicos de Pacientes: el DNI
 * se vuelve a pedir en Usuarios (Etapa 10), y "fecha no futura" aplica
 * también a fechas de nacimiento o de alta en otros formularios.
 */
export class FormValidators {
  /** DNI argentino: 7 u 8 dígitos, sin puntos. */
  static dni(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = (control.value ?? '').toString().trim();
      if (!valor) {
        return null; // 'required' se valida aparte
      }
      const esValido = /^\d{7,8}$/.test(valor);
      return esValido ? null : { dniInvalido: true };
    };
  }

  /** Teléfono: acepta dígitos, espacios, guiones, paréntesis y '+' inicial, mínimo 8 dígitos. */
  static telefono(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = (control.value ?? '').toString().trim();
      if (!valor) {
        return null;
      }
      const soloDigitos = valor.replace(/\D/g, '');
      const formatoValido = /^[\d\s\-()+]+$/.test(valor);
      return formatoValido && soloDigitos.length >= 8 ? null : { telefonoInvalido: true };
    };
  }

  /** La fecha no puede ser futura (ej: fecha de nacimiento). */
  static fechaNoFutura(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const valor = control.value;
      if (!valor) {
        return null;
      }
      const fecha = valor instanceof Date ? valor : new Date(valor);
      return fecha.getTime() > Date.now() ? { fechaFutura: true } : null;
    };
  }
}
