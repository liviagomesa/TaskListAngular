import { CustomSyncValidators } from './../../../../provided-in-root/custom-sync-validators';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ImportanciaTarefa } from '../../enums/importancia-tarefa.enum';
import { Subtarefa, Tarefa } from '../../tarefa.model';
import { TarefaService } from '../../tarefa.service';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseFormComponent } from 'src/app/shared/base-form/base-form.component';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-tarefa-form',
  templateUrl: './tarefa-form.component.html',
  styleUrls: ['./tarefa-form.component.scss']
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
    private tarefaService: TarefaService,
    activatedRoute: ActivatedRoute,
    router: Router,
    fb: FormBuilder
  ) {
    super(router, activatedRoute, fb);
    this.setService(tarefaService); // necessário chamar no construtor de todas as classes que estendem BaseForm!!
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

  override criarEPreencherFormArraysControls(): void {
    if (this.entity.tags) this.criarEPreencherTagsControls(this.entity.tags);
    if (this.entity.subtarefas) this.criarEPreencherSubtarefasControls(this.entity.subtarefas);
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  // SUBSEÇÃO: ARRAY DE TAGS
  // ------------------------------

  addTag(): void {
    let valorInput: string = this.form.get('newTag')?.value;
    valorInput = valorInput.trim();
    if (!valorInput) return;
    this.tagsFormArray.push(this.fb.control(valorInput, [Validators.maxLength(30), Validators.pattern(/^[\w\s-]+$/)]));
    this.form.get('newTag')?.setValue('');
  }

  removeTag(index: number): void {
    this.tagsFormArray.removeAt(index);
  }

  getTagsControls() {
    return this.tagsFormArray?.controls ?? [];
  }

  criarEPreencherTagsControls(tags: String[]) {
    tags.forEach(tag => {
      this.tagsFormArray.push(new FormControl(tag));
    });
  }

  // SUBSEÇÃO: ARRAY DE SUBTAREFAS
  // ------------------------------

  addSubtarefa(subtarefa?: Subtarefa): void {
    this.subtarefasFormArray.push(this.fb.group({
      id: [subtarefa?.id || ''],
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
