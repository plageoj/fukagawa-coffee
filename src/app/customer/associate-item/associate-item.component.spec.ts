import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssociateItemComponent } from './associate-item.component';

describe('AssociateItemComponent', () => {
  let component: AssociateItemComponent;
  let fixture: ComponentFixture<AssociateItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    imports: [AssociateItemComponent]
})
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssociateItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
