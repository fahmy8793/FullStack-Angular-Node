import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetPasswordDoneComponent } from './reset-password-done.component';

describe('ResetPasswordDoneComponent', () => {
  let component: ResetPasswordDoneComponent;
  let fixture: ComponentFixture<ResetPasswordDoneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResetPasswordDoneComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ResetPasswordDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
