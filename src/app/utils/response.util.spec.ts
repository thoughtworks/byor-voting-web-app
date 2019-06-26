import { getDataFrom } from './response.util';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';

describe('Response util', () => {
  describe('when data is present', () => {
    const resp = { data: 'text data' };

    it('return data from response', () => {
        expect(getDataFrom(resp)).toBe('text data');
    });

    it('provides to the invoking observable', () => {
      const obs = of(resp);

      return obs.pipe(
        map(res => getDataFrom(res))
      ).subscribe(
        (text) => {
          expect(text).toBe('text data');
        })
    });
  });

  describe('when data is not present', () => {
    it('throws an error', () => {
      expect(getDataFrom).toThrowError('No data found in response');
    });

    it('makes observable to throw error', () => {
      return of({})
        .pipe(
          map(res => getDataFrom(res))
        )
        .subscribe(
          () => { expect(true).toEqual(false); },
          (error1 => { expect(error1.message).toEqual('No data found in response')})
        )
    });

    it('makes observable to throw error on error', () => {
      return of({error: {message : 'no data'}})
        .pipe(
          map(res => getDataFrom(res))
        )
        .subscribe(
          () => { expect(true).toEqual(false); },
          (error1 => { expect(error1.message).toEqual('no data')})
        )
    });
  });
});
