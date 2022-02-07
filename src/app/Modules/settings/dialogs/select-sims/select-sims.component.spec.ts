import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';
import { MaterialModule } from 'src/app/Modules/material/material.module';

import { MatDialogRef } from '@angular/material/dialog';

import { SelectSimsComponent } from './select-sims.component';

describe('SelectSimsComponent', () => {
  let component: SelectSimsComponent;
  let fixture: ComponentFixture<SelectSimsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MaterialModule, HttpClientModule],
      declarations: [SelectSimsComponent],
      providers: [
        {
          provide: MatDialogRef,
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectSimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
