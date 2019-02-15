import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupeProfesseurComponent } from './groupe-professeur.component';

describe('GroupeProfesseurComponent', () => {
  let component: GroupeProfesseurComponent;
  let fixture: ComponentFixture<GroupeProfesseurComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupeProfesseurComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupeProfesseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
