import { TestBed } from '@angular/core/testing';

import { PaginacaoConfigService } from './paginacao-config.service';

describe('PaginacaoService', () => {
  let service: PaginacaoConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaginacaoConfigService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
