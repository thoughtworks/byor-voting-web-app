import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { ConfigurationService } from 'src/app/services/configuration.service';
import { of } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let compiled: HTMLElement;

  beforeEach(async(() => {
    const configurationServiceSpy: jasmine.SpyObj<ConfigurationService> = jasmine.createSpyObj('ConfigurationService', ['defaultConfiguration']);
    configurationServiceSpy.defaultConfiguration.and.returnValue(of({
      siteName: 'A site name'
    }));
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      providers: [
        {
          provide: ConfigurationService,
          useValue: configurationServiceSpy
        },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    compiled = fixture.debugElement.nativeElement;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the title received from configurations', () => {
    const titleEl = compiled.querySelector('.header__title h1');
    expect(titleEl.textContent).toEqual('A site name');
  });

});
