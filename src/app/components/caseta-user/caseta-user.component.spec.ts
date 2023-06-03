import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasetaUserComponent } from './caseta-user.component';

describe('CasetaUserComponent', () => {
  let component: CasetaUserComponent;
  let fixture: ComponentFixture<CasetaUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasetaUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasetaUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
