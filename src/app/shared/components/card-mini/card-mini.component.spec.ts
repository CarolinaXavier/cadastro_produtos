import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardMiniComponent } from './card-mini.component';

describe('CardMiniComponent', () => {
  let component: CardMiniComponent;
  let fixture: ComponentFixture<CardMiniComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardMiniComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardMiniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
