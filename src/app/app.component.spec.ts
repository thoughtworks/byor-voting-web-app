import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ConfigurationService } from './services/configuration.service';

describe('AppComponent', () => {
  beforeEach(async(() => {
    const configurationServiceSpy: jasmine.SpyObj<ConfigurationService> = jasmine.createSpyObj('ConfigurationService', ['toString']);
    TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientModule],
      declarations: [AppComponent, HeaderComponent],
      providers: [
        {
          provide: ConfigurationService,
          useValue: configurationServiceSpy
        }
      ]
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });
});
