import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmaAcaoComponent } from './confirma-acao.component';

describe('ConfirmaAcaoComponent', () => {
  let component: ConfirmaAcaoComponent;
  let fixture: ComponentFixture<ConfirmaAcaoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmaAcaoComponent]
    });
    fixture = TestBed.createComponent(ConfirmaAcaoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
