import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

import { AppMaterialModule } from '../../../app-material.module';

import { VotersListComponent } from './voters-list.component';

import { BackendService } from '../../../services/backend.service';
import { EventsService } from '../../../services/events.service';
import { logError } from 'src/app/utils/utils';

import { MockBackEndService, VOTERS } from 'src/app/modules/test-mocks/mock-back-end-service';

describe('VotersListComponent', () => {
  let component: VotersListComponent;
  let fixture: ComponentFixture<VotersListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VotersListComponent],
      imports: [HttpClientTestingModule, AppMaterialModule],
      providers: [EventsService, { provide: BackendService, useClass: MockBackEndService }]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VotersListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('0.0 - should create', () => {
    expect(component).toBeTruthy();
  });

  it('1.0 - winners are picked from the list of voters', (done) => {
    // if test fails with a timeout exception it means that the Observable has never emitted
    let counter = 0;

    component.winners$.subscribe(
      (winners) => {
        counter++;
        if (counter <= VOTERS.length) {
          expect(winners.length).toBe(counter);
        } else {
          // the test should enter here since there are more emissions of 'nextWinner$' then there are voters
          expect(winners.length).toBe(VOTERS.length);
          done();
        }
      },
      (err) => {
        logError(err);
        done.fail('Should not generate an error');
      }
    );

    // make nextWinner$ emit one time more than the size of voters
    VOTERS.map((_val, index) =>
      setTimeout(() => {
        component.nextWinner$.next();
      }, index)
    );
    setTimeout(() => {
      component.nextWinner$.next();
    }, VOTERS.length + 1);
  });
});
