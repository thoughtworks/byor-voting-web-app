import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMaterialModule } from 'src/app/app-material.module';

import { TwBlipsComponent } from './tw-blips.component';
import { AppSessionService } from 'src/app/app-session.service';
import { BackendService } from 'src/app/services/backend.service';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';
import { MockBackEndService } from 'src/app/modules/test-mocks/mock-back-end-service';
import { By } from '@angular/platform-browser';

const mockBackendService = new MockBackEndService();

describe('TwBlipsComponent', () => {
  let component: TwBlipsComponent;
  let fixture: ComponentFixture<TwBlipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TwBlipsComponent],
      imports: [AppMaterialModule],
      providers: [
        { provide: AppSessionService, useClass: MockAppSessionService },
        { provide: BackendService, useValue: mockBackendService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TwBlipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('1.0 - should create', () => {
    expect(component).toBeTruthy();
  });

  // fit('1.1 - should create as many elements as the blips retrieved', () => {
  //   component.appSession.selectedTechnology$.next({ name: 'Event STORMING', isnew: true, quadrant: 'tools', description: 'a new tech' });
  //   fixture.detectChanges();
  //   const blipsElements = fixture.debugElement.query(By.css('div'));
  //   console.log('blipsElements', blipsElements);
  //   // expect(blipsElements).toBeTruthy();
  // });
});
