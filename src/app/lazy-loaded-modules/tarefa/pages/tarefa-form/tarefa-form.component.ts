import { CustomSyncValidators } from './../../../../provided-in-root/custom-sync-validators';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ImportanciaTarefa } from '../../enums/importancia-tarefa.enum';
import { Subtarefa, Tag, Tarefa } from '../../tarefa.model';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { TarefaFormFacade } from './tarefa-form.facade';
import { BaseFormStore } from 'src/app/shared/base-form/base-form.store';

@Component({
  selector: 'app-tarefa-form',
  templateUrl: './tarefa-form.component.html',
  styleUrls: ['./tarefa-form.component.scss'],
  providers: [TarefaFormFacade, BaseFormStore]
})
// caso rota de edição, antes de carregar este componente, o resolver busca a tarefa do id fornecido e salva em activatedRoute.data (que é um observable)
export class TarefaFormComponent extends BaseFormComponent<Tarefa> implements OnInit, OnDestroy {

  // ---------------------------------------------------------------------
  // PROPRIEDADES (FIELDS) E GETTERS (ACCESSORS)
  // ---------------------------------------------------------------------

  opcoesImportancia = Object.values(ImportanciaTarefa).filter(v => typeof v === 'number') as number[]; // Object.values(ImportanciaTarefa) retorna tudo: ['Baixa', 'Media', 'Alta', 3, 2, 1]

  get tagsFormArray(): FormArray {
    return this.form.get('tags') as FormArray;
  }

  get subtarefasFormArray(): FormArray {
    return this.form.get('subtarefas') as FormArray;
  }

  // ---------------------------------------------------------------------
  // CONSTRUTOR E LIFECYCLE HOOKS (ANGULAR)
  // ---------------------------------------------------------------------

  constructor(
    route: ActivatedRoute,
    router: Router,
    fb: FormBuilder,
    override facade: TarefaFormFacade,
  ) {
    super(router, route, fb, facade);
  }

  // obs.: se o id for inválido, este método nem chegará a ser executado, pois o resolver roda antes e encaminha para not-found
  override ngOnInit(): void {
    super.ngOnInit();
  }

  // ---------------------------------------------------------------------
  // MÉTODOS SOBRESCRITOS DE BaseFormComponent
  // ---------------------------------------------------------------------

  criarFormControls(): void {
    this.form = this.fb.group({
      id: [''],
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      anotacoes: [''],
      prazo: ['', Validators.required],
      importancia: [ImportanciaTarefa.Media, Validators.required], // ou pode passar 1, 2 ou 3 direto
      concluida: [false],
      subtarefas: this.fb.array([]),
      newTag: ['', [Validators.maxLength(30), Validators.pattern(/^[\w\s-]+$/)]],
      tags: this.fb.array([], [CustomSyncValidators.maxArrayLength(10), CustomSyncValidators.noDuplicateTags()]),
      dataCriacao: [new Date()]
    });
  }

  override criarEPreencherFormArraysControls(dto: Tarefa): void {
    if (dto.tags) this.criarEPreencherTagsControls(dto.tags);
    if (dto.subtarefas) this.criarEPreencherSubtarefasControls(dto.subtarefas);
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  // SUBSEÇÃO: ARRAY DE TAGS
  // ------------------------------

  addTag(tag?: Tag): void {
    if (!this.idRota) {
      alert('Crie a tarefa antes de adicionar tags.');
      return;
    }
    // se não vier o parâmetro tag, disparou do template (usuário clicou em nova tag)
    // se vier, disparou da inicialização do formulário (populando campos com dto vindo do resolver)
    if (!tag) {
      let valorInput: string = this.form.get('newTag')?.value;
      valorInput = valorInput.trim();
      if (!valorInput) return;
      tag = {
        id: null,
        tarefaId: this.idRota,
        nome: valorInput
      }
      this.form.get('newTag')?.setValue('');
    }
    this.tagsFormArray.push(this.fb.group({
      id: [tag?.id],
      tarefaId: [tag?.tarefaId],
      nome: [tag?.nome || '', [Validators.maxLength(30), Validators.pattern(/^[\w\s-]+$/)]]
    }));
  }

  removeTag(index: number): void {
    this.tagsFormArray.removeAt(index);
  }

  getTagsControls() {
    return this.tagsFormArray?.controls ?? [];
  }

  criarEPreencherTagsControls(tags: Tag[]) {
    tags.forEach(tag => {
      this.addTag(tag);
    });
  }

  // SUBSEÇÃO: ARRAY DE SUBTAREFAS
  // ------------------------------

  addSubtarefa(subtarefa?: Subtarefa): void {
    if (!this.idRota) {
      alert('Crie a tarefa antes de adicionar subtarefas.');
      return;
    }
    this.subtarefasFormArray.push(this.fb.group({
      id: [subtarefa?.id || ''],
      tarefaId: [this.idRota],
      titulo: [subtarefa?.titulo || '', [Validators.required, Validators.minLength(3)]],
      prazo: [subtarefa?.prazo || '', Validators.required],
      concluida: [subtarefa?.concluida || false],
      dataCriacao: [subtarefa?.dataCriacao || new Date()]
    }));
  }

  removeSubtarefa(index: number): void {
    this.subtarefasFormArray.removeAt(index);
  }

  getSubtarefasControls() {
    return this.subtarefasFormArray?.controls ?? [];
  }

  criarEPreencherSubtarefasControls(subtarefas: Subtarefa[]) {
    subtarefas.forEach(s => {
      this.addSubtarefa(s);
    });
  }

}
