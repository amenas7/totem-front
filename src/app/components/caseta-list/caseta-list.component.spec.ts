import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasetaListComponent } from './caseta-list.component';

describe('CasetaListComponent', () => {
  let component: CasetaListComponent;
  let fixture: ComponentFixture<CasetaListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CasetaListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CasetaListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
