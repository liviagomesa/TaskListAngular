import { Component, forwardRef, Input, OnInit, Optional, Self } from '@angular/core';
import { ControlValueAccessor, FormControl, NgControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss']
})
export class InputFieldComponent implements ControlValueAccessor {

  @Input() label!: string;
  @Input() type: string = 'text';
  @Input() inputmode = '';
  @Input() mask = '';
  value: string = ''; //1
  disabled: boolean = false; //2
  onChange: (_: any) => void = () => {}; //3
  onTouched: () => void = () => {}; //4

  get control(): FormControl | null {
    return this.ngControl?.control as FormControl | null;
  }

  constructor(
    @Optional() @Self() public ngControl: NgControl
  ) {
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
  }

  getValidationClass() {
    const control = this.ngControl?.control;
    return {
      //'is-valid': control?.valid && control?.touched,
      'is-invalid': control?.invalid && control?.touched
    }
  }

  writeValue(obj: any): void { // 1
    if (this.type === 'date' && obj instanceof Date) {
      this.value = obj.toISOString().substring(0, 10);
    } else {
      this.value = obj ?? '';
    }
  }

  setDisabledState?(isDisabled: boolean): void { // 2
    this.disabled = isDisabled;
  }

  registerOnChange(fn: any): void { // 3
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void { // 4
    this.onTouched = fn;
  }

  onInput(event: Event) {
    this.value = (event.target as HTMLInputElement).value;
    this.onChange(this.value);
  }

}
