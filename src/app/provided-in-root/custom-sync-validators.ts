import { AbstractControl, FormArray, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Tag } from "../lazy-loaded-modules/tarefa/tarefa.types";

export class CustomSyncValidators {

  static maxArrayLength(max: number): ValidatorFn {
    return (control: AbstractControl) => {
      const array = control as FormArray;
      return array.length > max
        ? { maxTags: { max, atual: array.length } }
        : null;
    };
  }

  static noDuplicateTags(): ValidatorFn {
    return (control: AbstractControl) => {
      const values = (control as FormArray).value.map((v: Tag) => v.nome.toLowerCase());
      const hasDuplicates = new Set(values).size !== values.length;
      return hasDuplicates ? { duplicateTags: true } : null;
    };
  }

  static equals(campo1: string, campo2: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const c1 = group.get(campo1);
      const c2 = group.get(campo2);
      if (!c1 || !c2) return null;

      const value1 = c1?.value;
      const value2 = c2?.value;
      if (!value1 || !value2) return null;

      if (value1 !== value2) {
        const errors = c2.errors || {};
        errors['notEqual'] = { otherField: campo1 };
        c2.setErrors(errors);
        return { notEqual: true };
      }

      if (c2.errors) {
        const errors = { ...c2.errors };
        delete errors['notEqual'];

        // Se ainda restam erros (ex: required, email), mantemos
        if (Object.keys(errors).length > 0) {
          c2.setErrors(errors);
        } else {
          c2.setErrors(null);
        }
      }

      return null;
    };
  }


}
