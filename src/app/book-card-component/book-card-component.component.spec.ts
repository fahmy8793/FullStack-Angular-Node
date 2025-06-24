import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookCardComponentComponent } from './book-card-component.component';

describe('BookCardComponentComponent', () => {
  let component: BookCardComponentComponent;
  let fixture: ComponentFixture<BookCardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookCardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
