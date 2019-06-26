
import {domainName, googleSheetId, integer, floating} from './utils';

describe('1.1 domainName function', () => {

    it('should find the domain name', () => {
        const domain = 'https://docs.google.com/spreadsheets/d/1waDG0_W3-yNiAaUfxcZhTKvl7AUCgXwQw8mdPjCz86U/edit#gid=0';
        const name = domainName(domain);
        expect(name).toEqual('docs.google.com');
    });

    it('should NOT find the domain name, because the string does not contain a domain name', () => {
        const domain = 'I do not contain a domain name';
        const name = domainName(domain);
        expect(name).toBeNull();
    });

});

describe('1.2 googleSheetId function', () => {

    it('returns the google sheet id out of the url reference', () => {
        const sheetId = '1waDG0_W3-yNiAaUfxcZhTKvl7AUCgXwQw8mdPjCz86U';
        const url = 'https://docs.google.com/spreadsheets/d/' + sheetId + '/edit#gid=0';
        const caclulatedSheetId = googleSheetId(url);
        expect(caclulatedSheetId).toEqual(sheetId);
    });

    it('returns the google sheet id passed as input with no specific calculation', () => {
        const sheetId = '1waDG0_W3-yNiAaUfxcZhTKvl7AUCgXwQw8mdPjCz86U';
        const caclulatedSheetId = googleSheetId(sheetId);
        expect(caclulatedSheetId).toEqual(sheetId);
    });

});

describe('1.3 integer function', () => {

    it('returns an integer between min and max', () => {
        const min = 3;
        const max = 10;
        const randomInteger = integer(min, max);
        expect(randomInteger).toBeGreaterThanOrEqual(min);
        expect(randomInteger).toBeLessThanOrEqual(max);
    });

    it('returns an integer which is equal to min, since min is set equal to max', () => {
        const min = 5;
        const max = 5;
        const randomInteger = integer(min, max);
        expect(randomInteger).toBe(min);
    });

    it('throws an exception since min is greater than max', () => {
        const min = 6;
        const max = 1;
        expect(() => integer(min, max)).toThrowError();
    });

});

describe('1.4 floating function', () => {

    it('returns a floating number with a certain number of digits precision', () => {
        const min = 10;
        const max = 100;
        const fixed = 3;
        const randomFloat = floating(min, max, fixed);
        const decimalPart = (randomFloat + '').split('.')[1];
        expect(randomFloat).toBeGreaterThanOrEqual(min);
        expect(randomFloat).toBeLessThanOrEqual(max);
        expect(decimalPart.length).toBeLessThanOrEqual(fixed);
    });

});
