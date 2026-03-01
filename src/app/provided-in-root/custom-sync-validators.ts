import { AbstractControl, FormArray, ValidatorFn } from "@angular/forms";
import { Tag } from "../lazy-loaded-modules/tarefa/tarefa.model";

export class CustomSyncValidators {

  constructor() { }

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


}
