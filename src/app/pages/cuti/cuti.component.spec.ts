import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CutiComponent } from './cuti.component';

describe('CutiComponent', () => {
  let component: CutiComponent;
  let fixture: ComponentFixture<CutiComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CutiComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CutiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
