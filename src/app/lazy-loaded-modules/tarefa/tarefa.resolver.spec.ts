import { TestBed } from '@angular/core/testing';

import { TarefaResolver } from './tarefa.resolver';

describe('TarefaResolver', () => {
  let resolver: TarefaResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(TarefaResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
