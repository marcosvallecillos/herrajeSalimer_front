import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalHerrajes } from './modal-herrajes';

describe('ModalHerrajes', () => {
  let component: ModalHerrajes;
  let fixture: ComponentFixture<ModalHerrajes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalHerrajes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalHerrajes);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
