import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavPaginacaoComponent } from './nav-paginacao.component';

describe('NavPaginacaoComponent', () => {
  let component: NavPaginacaoComponent;
  let fixture: ComponentFixture<NavPaginacaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NavPaginacaoComponent]
    });
    fixture = TestBed.createComponent(NavPaginacaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
