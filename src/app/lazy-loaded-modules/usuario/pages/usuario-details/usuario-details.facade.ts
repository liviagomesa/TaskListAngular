import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject, takeUntil } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from '../../usuario.service';
import { AlterarSenhaRequest, Usuario } from '../../usuario.types';
import { SecurityFacade } from 'src/app/core/security-and-guards/security.facade';

@Injectable()
export class UsuarioDetailsFacade implements OnDestroy {

  // ---------------------------------------------------------------------
  // FIELDS AND ACCESSORS
  // ---------------------------------------------------------------------

  // Optando por não separar store/state, criamos BehaviorSubject aqui mesmo (um para cada variável de estado)
  // Sem variáveis de estado de erro, pois a reação se limita a este arquivo (emitir toast)
  salvandoPerfil$ = new BehaviorSubject<boolean>(false);
  salvandoSenha$ = new BehaviorSubject<boolean>(false);

  // vem do resolver e emite para o componente poder reagir às respostas da API
  dto$ = new BehaviorSubject<Usuario | null>(null);

  // vem da rota e não emite, pois não é dinâmico e não será usado em outro componente
  id = this.securityFacade.userId as number;

  private destroy$ = new Subject<void>();

  // ---------------------------------------------------------------------
  // CONSTRUTOR E LIFECYCLE HOOKS (ANGULAR)
  // ---------------------------------------------------------------------

  constructor(
    private service: UsuarioService,
    private toastr: ToastrService,
    private securityFacade: SecurityFacade
  ) { }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ---------------------------------------------------------------------
  // MÉTODOS DA CLASSE
  // ---------------------------------------------------------------------

  /** Inicia dto, que vêm da rota (componente chama na inicialização) */
  inicializarDados(dto: Usuario) {
    this.dto$.next(dto);
  }

  savePerfil(formValue: Partial<Usuario>) {
    this.salvandoPerfil$.next(true);
    this.chamarServiceSave(formValue, this.salvandoPerfil$);
  }

  saveSenha(req: AlterarSenhaRequest) {
    this.salvandoSenha$.next(true);
    this.isSenhaAtualCorreta(req.senhaAtual)
      .subscribe({
        next: isCorreta => {
          if (!isCorreta) {
            this.toastr.error('Senha incorreta.');
            this.salvandoSenha$.next(false);
          } else {
            this.chamarServiceSave({ password: req.novaSenha }, this.salvandoSenha$);
          }
        },
        error: () => {
          this.toastr.error('Não foi possível validar a senha atual. Tente novamente.');
          this.salvandoSenha$.next(false);
        }
      });
  }

  chamarServiceSave(usuario: Partial<Usuario>, stateToUpdate$: BehaviorSubject<boolean>) {
    this.service.update(usuario, this.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: d => {
          stateToUpdate$.next(false);
          this.dto$.next(d);
          this.toastr.success('Salvo com sucesso!');
        },
        error: () => {
          stateToUpdate$.next(false);
          this.toastr.error('Não foi possível salvar. Tente novamente.');
        }
      });
  }

  // TODO: Implementar quando tiver backend real
  private isSenhaAtualCorreta(_senhaAtual: string): Observable<boolean> {
    return of(true);
  }

}
