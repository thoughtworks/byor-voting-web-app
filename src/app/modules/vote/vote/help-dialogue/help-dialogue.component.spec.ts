import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HelpDialogueComponent } from './help-dialogue.component';

import { MatCardModule } from '@angular/material/card';
import { MatDialogRef } from '@angular/material';

describe('HelpDialogueComponent', () => {
  let component: HelpDialogueComponent;
  let fixture: ComponentFixture<HelpDialogueComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HelpDialogueComponent],
      imports: [MatCardModule],
      providers: [
        { provide: MatDialogRef, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HelpDialogueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display ring names alogn with help descriptions', () => {
    const ringsNames = compiled.querySelectorAll('.help-dialogue-ring-name')
    const ringsDescriptions = compiled.querySelectorAll('.help-dialogue-ring-description');

    expect(ringsNames.length).toBe(component.rings.length);
    expect(ringsDescriptions.length).toBe(component.rings.length);

    ringsNames.forEach((node) => {
      expect(component.rings.map(ring => ring.name)).toContain(node.textContent);
    });

    ringsDescriptions.forEach((node) => {
      expect(component.rings.map(ring => ring.description)).toContain(node.textContent);
    });
  });
});
