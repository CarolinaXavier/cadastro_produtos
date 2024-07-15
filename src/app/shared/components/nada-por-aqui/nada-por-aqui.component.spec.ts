import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NadaPorAquiComponent } from './nada-por-aqui.component';

describe('NadaPorAquiComponent', () => {
  let component: NadaPorAquiComponent;
  let fixture: ComponentFixture<NadaPorAquiComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NadaPorAquiComponent]
    });
    fixture = TestBed.createComponent(NadaPorAquiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
