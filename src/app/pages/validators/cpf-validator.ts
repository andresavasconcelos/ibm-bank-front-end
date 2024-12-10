import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const cpf = control.value;

  if (!cpf) return null;

  const cpfClean = cpf.replace(/\D/g, '');

  if (cpfClean.length !== 11) return { cpfInvalid: true };

  if (/^(\d)\1+$/.test(cpfClean)) return { cpfInvalid: true };

  const calcCheckDigit = (base: number) =>
    [...cpfClean]
      .slice(0, base)
      .reduce((sum, num, idx) => sum + parseInt(num, 10) * (base + 1 - idx), 0) % 11;

  const digit1 = calcCheckDigit(9);
  const digit2 = calcCheckDigit(10);

  const checkDigit1 = digit1 < 2 ? 0 : 11 - digit1;
  const checkDigit2 = digit2 < 2 ? 0 : 11 - digit2;

  if (checkDigit1 !== parseInt(cpfClean[9], 10) || checkDigit2 !== parseInt(cpfClean[10], 10)) {
    return { cpfInvalid: true };
  }

  return null;
}
