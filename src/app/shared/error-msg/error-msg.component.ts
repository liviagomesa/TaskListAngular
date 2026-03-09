import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { Utils } from 'src/app/shared/utils';

@Component({
  selector: 'app-error-msg',
  templateUrl: './error-msg.component.html',
  styleUrls: ['./error-msg.component.scss']
})
export class ErrorMsgComponent implements OnInit {

  @Input() control: AbstractControl | null = null;
  @Input() label!: string;

  constructor() { }

  ngOnInit(): void {
  }

  get errorMsg(): string | null {
    if (!this.control) return null;
    let erros = this.control.errors;
    if (!erros) return null;

    const firstKey = Object.keys(erros)[0];
    return Utils.getErrorMsg(this.label, firstKey, erros[firstKey]);
  }

}
