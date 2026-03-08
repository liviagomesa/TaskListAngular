import { Injectable, OnDestroy } from "@angular/core";
import { BaseFormFacade } from 'src/app/shared/base-form/base-form.facade';
import { createEmptyTarefa, Tarefa } from "../../tarefa.types";
import { BaseFormStore } from "src/app/shared/base-form/base-form.store";
import { TarefaService } from "../../tarefa.service";
import { ToastrService } from "ngx-toastr";

@Injectable() // sem providedIn
export class TarefaFormFacade extends BaseFormFacade<Tarefa> {

  protected override createEmpty(): Tarefa {
    return createEmptyTarefa();
  }

  constructor(store: BaseFormStore<Tarefa>, service: TarefaService, toastr: ToastrService) {
    super(store, service, toastr);
  }

}
