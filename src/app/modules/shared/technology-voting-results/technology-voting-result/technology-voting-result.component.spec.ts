import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyVotingResultComponent } from './technology-voting-result.component';
import { AppMaterialModule } from 'src/app/app-material.module';
import { AppSessionService } from 'src/app/app-session.service';

import { MockAppSessionService } from 'src/app/modules/test-mocks/mock-app-session-service';

describe('TechnologyVotingResultComponent', () => {
  let component: TechnologyVotingResultComponent;
  let fixture: ComponentFixture<TechnologyVotingResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TechnologyVotingResultComponent],
      imports: [AppMaterialModule],
      providers: [{ provide: AppSessionService, useClass: MockAppSessionService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TechnologyVotingResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
