import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { SecurityFacade } from 'src/app/core/security-and-guards/security.facade';
import { CustomSyncValidators } from 'src/app/shared/custom-sync-validators';
import { UsuarioDetailsFacade } from './usuario-details.facade';
import { ActivatedRoute } from '@angular/router';
import { AlterarSenhaRequest, Usuario } from '../../usuario.types';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-usuario-details',
  templateUrl: './usuario-details.component.html',
  styleUrls: ['./usuario-details.component.scss'],
  providers: [UsuarioDetailsFacade]
})
export class UsuarioDetailsComponent implements OnInit, OnDestroy {

  // ---------------------------------------------------------------------
  // FIELDS AND ACCESSORS
  // ---------------------------------------------------------------------

  // Variáveis de estado (usadas para reações aqui e no template)
  salvandoPerfil$ = this.facade.salvandoPerfil$;
  salvandoSenha$ = this.facade.salvandoSenha$;
  dto$ = this.facade.dto$;
  photoUrl$ = this.securityFacade.photoUrl$;

  private destroy$ = new Subject<void>();

  // Para o guarda de desativação de rota
  get hasUnsavedChanges(): boolean {
    return this.perfilForm.dirty;
  }

  // Formulários

  perfilForm = this.fb.group({
    nome: ['', [Validators.required, Validators.maxLength(200)]],
    bio:  ['', Validators.maxLength(500)]
  });

  senhaForm = this.fb.group({
    senhaAtual: ['', Validators.required],
    novaSenha: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(128)]],
    confirmarNovaSenha: ['', Validators.required]
  }, { validators: [CustomSyncValidators.equals('novaSenha', 'confirmarNovaSenha')] });

  // ---------------------------------------------------------------------
  // CONSTRUTOR E LIFECYCLE HOOKS (ANGULAR)
  // ---------------------------------------------------------------------

  constructor(
    private fb: FormBuilder,
    private securityFacade: SecurityFacade,
    private facade: UsuarioDetailsFacade,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.inicializarStateFromRoute();
    this.reagirAoDtoStateNoForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  inicializarStateFromRoute(): void {
    const dto = this.route.snapshot.data['dto'] as Usuario;
    this.facade.inicializarDados(dto);
  }

  reagirAoDtoStateNoForm(): void {
    this.dto$.pipe(takeUntil(this.destroy$)).subscribe(dto => {
      if (!dto) return;
      this.perfilForm.markAsPristine();
      this.perfilForm.patchValue(dto);
    });
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  salvarPerfil(): void {
    if (this.perfilForm.valid) {
      // type assertion sempre que passamos form value. É uma alternativa para tipar formulário
      // para o typescript confiar que o valor passado possui as mesmas chaves do DTO,
      // que é algo que já garantimos pelos nomes dos campos e validações de required
      // (que o typescript não considera na compilação, por isso dá erro)
      this.facade.savePerfil(this.perfilForm.value as Usuario);
    } else {
      this.perfilForm.markAllAsTouched();
    }
  }

  salvarSenha(): void {
    if (this.senhaForm.valid) {
      this.facade.saveSenha(this.senhaForm.value as AlterarSenhaRequest);
    } else {
      this.senhaForm.markAllAsTouched();
    }
  }

  // TODO: UPLOAD FOTO
  onFotoChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.securityFacade.photoUrl$.next(reader.result as string);
    };
    reader.readAsDataURL(file);
  }

}
