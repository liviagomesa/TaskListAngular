# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Start the Angular dev server (port 4200)
npm start

# Start the mock backend (json-server, port 3000) — must run alongside the dev server
npx json-server --watch db.json

# Build for production
npm run build

# Run all tests (Karma + Jasmine)
npm test

# Run a single test file (use --include to target a specific spec)
npx ng test --include='src/app/lazy-loaded-modules/tarefa/tarefa.service.spec.ts'
```

## Architecture

This is an **Angular 14** task manager app backed by **json-server** (`db.json` at project root). The API base URL is configured in `src/environments/environment.ts` (`http://localhost:3000`).

### Module structure

- `src/app/app.module.ts` — root module; configures ToastrModule, locale `pt`
- `src/app/lazy-loaded-modules/tarefa/` — lazy-loaded feature module for tasks
- `src/app/lazy-loaded-modules/usuario/` — lazy-loaded feature module for users
- `src/app/shared/` — `SharedModule` with reusable pipes, components (`InputFieldComponent`, `ErrorMsgComponent`, `AlertComponent`), exported for use in feature modules
- `src/app/provided-in-root/` — singleton services, guards, validators (`SecurityService`, `FormGuard`, custom validators, `AddressService`)
- `src/app/root-components/` — `HeaderComponent`, `UserDropdownComponent` (declared in `AppModule`)
- `src/app/standalone-pages/` — `LoginComponent`, `NotFoundComponent`

### Routes

```
/           → redirects to /tarefas
/tarefas    → ListaTarefasComponent (lazy)
/tarefas/new         → TarefaFormComponent
/tarefas/:id         → TarefaDetailsComponent (resolved via TarefaResolver)
/tarefas/:id/edit    → TarefaFormComponent (resolved, guarded by FormGuard)
/usuario    → UsuarioModule (lazy)
/login      → LoginComponent
```

Login/authentication guards (`SecurityGuard`) are intentionally disabled in routing — commented out for development.

### State management pattern (Store/Facade)

Each complex page uses a custom lightweight pattern with three files:

- **`*.state.ts`** — defines the state interface and initial value
- **`*.store.ts`** — holds a `BehaviorSubject<State>`, exposes `state$` observable and typed setter methods; decorated `@Injectable()` (no `providedIn`)
- **`*.facade.ts`** — orchestrates service calls and store updates; uses `takeUntil(destroy$)` for cleanup; decorated `@Injectable()` (no `providedIn`)

Store and Facade are provided at the component level (in `providers: []` of the component), not root-level.

### Base classes

- **`BaseService<D>`** (`src/app/shared/base-service/base.service.ts`) — abstract HTTP service with `findAll`, `create`, `update`, `deleteById`, `findById`, `countAll`. Uses `ParamsBusca` for pagination, sorting, and filtering. `findAll` has a hardcoded `delay(2000)` for simulating latency.
- **`BaseFormComponent<D>`** (`src/app/shared/base-form/base-form.component.ts`) — abstract base for form pages; handles `ngOnInit` lifecycle (create controls → load from route → react to state), form submission, and validation display. Subclasses must implement `criarFormControls()` and optionally `criarEPreencherFormArraysControls()`.
- **`BaseFormFacade<D>`** (`src/app/shared/base-form/base-form.facade.ts`) — abstract; handles save logic (create vs update), toastr notifications, and state updates. Subclasses implement `createEmpty()`.

### Data model

`Tarefa` (task) has nested `Subtarefa[]` and `Tag[]`. Because json-server doesn't support cascaded persistence, `TarefaService` overrides `create` and `update` to manually POST each child entity using `forkJoin`, and overrides `deleteById` with `?_dependent=subtarefas,tags`.

### Key libraries

- **ng-bootstrap 13** — UI components (dropdowns, modals, alerts via `NgbAlertModule`)
- **ngx-toastr** — toast notifications; configured globally in `AppModule` (bottom-right, 5 s timeout, progress bar)
- **ngx-mask 14** — input masking via `NgxMaskModule.forRoot()` in `SharedModule`
- **Bootstrap 5.2** + **bootstrap-icons** — CSS framework and icon set
