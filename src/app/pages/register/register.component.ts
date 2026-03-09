import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { distinctUntilChanged, EMPTY, Subject, switchMap, takeUntil } from 'rxjs';
import { AddressService, ViaCepResponse } from 'src/app/core/address/address.service';
import { SecurityFacade } from 'src/app/core/security-and-guards/security.facade';
import { Cidade, Estado, Usuario } from 'src/app/lazy-loaded-modules/usuario/usuario.types';
import { ToastrService } from 'ngx-toastr';
import { CustomSyncValidators } from 'src/app/shared/custom-sync-validators';
import { AsyncValidators } from 'src/app/shared/async-validators';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {

  loading$ = this.facade.loading$;
  buscandoCep = false;
  estados: Estado[] = [];
  cidades: Cidade[] = [];

  private destroy$ = new Subject<void>();

  form = this.fb.group({
    nome: [null, [Validators.required, Validators.maxLength(200)]],
    telefone: [null, Validators.pattern(/^\d{11}$/)],
    email: new FormControl(null, {
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.asyncValidators.emailUnico()],
      updateOn: 'blur' // validação assíncrona dispara só quando campo perde foco
    }),
    emailConfirm: [null, [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(128)]],
    endereco: this.fb.group({
      cep: ['', [Validators.required, Validators.pattern(/^\d{5}-?\d{3}$/)]],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      estado: [null as Estado | null, Validators.required],
      cidade: [{ value: null as Cidade | null, disabled: true }, Validators.required]
    })
  },
  {
    validators: [CustomSyncValidators.equals('email', 'emailConfirm')]
  });

  constructor(
    private fb: FormBuilder,
    private facade: SecurityFacade,
    private addressService: AddressService,
    private toastr: ToastrService,
    private asyncValidators: AsyncValidators
  ) { }

  ngOnInit(): void {
    this.setEstadosFromApi();
    this.setCidadesOptionsForEachEstadoChange();
    this.setEnderecoWhenCepValid();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Se inscreve na chamada HTTP para estados (emite uma única vez → shareReplay(1))
   * e preenche a propriedade estados.
   */
  setEstadosFromApi() {
    this.addressService.getEstados()
      .pipe(takeUntil(this.destroy$))
      .subscribe(estados => this.estados = estados);
  }

  /** Quando o estado muda, recarrega as cidades e limpa a cidade selecionada */
  setCidadesOptionsForEachEstadoChange() {
    this.form.get('endereco.estado')?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((estado: Estado | null) => {
        const cidadeControl = this.form.get('endereco.cidade')!;
        // Sempre que o estado muda, limpa o campo cidade e a propriedade local cidades
        cidadeControl.setValue(null);
        this.cidades = [];
        // Agora repopula a propriedade cidades considerando o novo estado selecionado
        if (estado) {
          // Habilita a seleção de cidades, agora que serão filtradas
          cidadeControl.enable();
          this.addressService.getCidadesByEstado(Number(estado.id))
            .pipe(takeUntil(this.destroy$))
            .subscribe(cidades => this.cidades = cidades);
        } else {
          // Se o campo estado foi limpo, desabilita a seleção de cidade
          cidadeControl.disable();
        }
      });
  }

  /** Monitorar mudanças no campo de cep para só chamar preencherEndereco() quando válido */
  setEnderecoWhenCepValid() {
    this.form.get('endereco.cep')?.statusChanges
      .pipe(
        distinctUntilChanged(), // se o Observable emitir o mesmo status duas vezes seguidas, ele bloqueia a segunda
        switchMap(status => { // transforma Observable de status em Observable de JSON CEP (ou vazio se inválido)
          if (status === 'VALID') {
            this.buscandoCep = true;
            const cep = this.form.get('endereco.cep')?.value;
            return this.addressService.buscarPorCep(cep!);
          } else return EMPTY;
        })
      )
      .subscribe({
        next: objCEP => {
          this.buscandoCep = false;
          if (objCEP) {
            if (objCEP.erro) this.toastr.error('CEP não retorna endereço.');
            else this.preencherEndereco(objCEP);
          }
        },
        error: () => {
          this.buscandoCep = false;
          this.toastr.error('Erro ao buscar CEP.');
        }
      });
  }

  preencherEndereco(res: ViaCepResponse): void {
    // preenchemos o que for possível com patchValue
    const endereco = this.form.get('endereco') as FormGroup;
    endereco.patchValue({
      logradouro: res.logradouro,
      complemento: res.complemento,
      bairro: res.bairro,
    });

    // estado e cidade são objetos, preenchimento sem patchValue
    const estado = this.estados.find(e => e.sigla === res.uf) ?? null;
    // seta o objeto estado sem disparar o valueChanges (para controlar o fluxo manualmente)
    this.form.get('endereco.estado')?.setValue(estado, { emitEvent: false });

    if (estado) {
      const cidadeControl = this.form.get('endereco.cidade')!;
      cidadeControl.enable();
      this.addressService.getCidadesByEstado(Number(estado.id))
        .pipe(takeUntil(this.destroy$))
        .subscribe(cidades => {
          this.cidades = cidades;
          const cidade = cidades.find(c => c.Nome === res.localidade) ?? null;
          cidadeControl.setValue(cidade);
        });
    }
  }

  compareEstado(a: Estado, b: Estado): boolean {
    return Number(a?.id) === Number(b?.id);
  }

  compareCidade(a: Cidade, b: Cidade): boolean {
    return Number(a?.ID) === Number(b?.ID);
  }

  onSubmit(): void {
    console.log(this.form);
    if (this.form.valid) {
      this.facade.registrar(this.form.getRawValue() as unknown as Usuario);
    } else {
      this.form.markAllAsTouched();
    }
  }

  getValidationClass(path: string) {
    const control = this.form.get(path);
    return { 'is-invalid': control?.invalid && control?.touched };
  }

}
