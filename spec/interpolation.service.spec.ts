import {it, describe, expect} from 'angular2/testing';
import {Parser} from 'angular2/src/core/change_detection/parser/parser';
import {Injector, PLATFORM_COMMON_PROVIDERS} from 'angular2/core';
import {Lexer} from 'angular2/src/core/change_detection/parser/lexer';
import {InterpolationService} from '../src/interpolation.service';

describe('InterpolationService', () => {
    var injector = Injector.resolveAndCreate([
        PLATFORM_COMMON_PROVIDERS,
        Parser,
        Lexer,
        InterpolationService
    ]);
    const service = injector.get(InterpolationService);

    describe('method interpolate', () => {

        it('returns empty string when format string is undefined', () => {
            var text = service.interpolate(undefined, undefined);
            expect(text).toBe('');
        });

        it('returns empty string when format string is null', () => {
            var text = service.interpolate(null, undefined);
            expect(text).toBe('');
        });

        it('returns empty string when format string is empty string', () => {
            var text = service.interpolate('', undefined);
            expect(text).toBe('');
        });

        it('returns the provided string when format string has no placeholders', () => {
            var text = service.interpolate(' format string ', undefined);
            expect(text).toBe(' format string ');
        });

        it('returns the provided string without placeholder when no arguments are provided', () => {
            var text = service.interpolate(' format string {{arg1}} ', undefined);
            expect(text).toBe(' format string  ');
        });

        it('returns the provided string without placeholder when the argument is undefined', () => {
            var text = service.interpolate(' format string {{arg1}} ', { arg1: undefined });
            expect(text).toBe(' format string  ');
        });

        it('returns the provided string without placeholder when the argument is null', () => {
            var text = service.interpolate(' format string {{arg1}} ', { arg1: null });
            expect(text).toBe(' format string  ');
        });

        it('returns the provided string with the provided value', () => {
            var text = service.interpolate(' format string {{arg1}} ', { arg1: 'foo' });
            expect(text).toBe(' format string foo ');
        });

        it('returns correct result with just a placeholder', () => {
            var text = service.interpolate('{{arg1}}', { arg1: 'foo' });
            expect(text).toBe('foo');
        });

        it('returns correct result with 2 a placeholder beside each other', () => {
            var text = service.interpolate('{{arg1}}{{arg2}}', { arg1: 'foo', arg2: 'bar' });
            expect(text).toBe('foobar');
        });

        it('returns correct result with 2 a placeholder with text in between', () => {
            var text = service.interpolate(' prefix {{arg1}} infix {{arg2}} suffix ', { arg1: 'foo', arg2: 'bar' });
            expect(text).toBe(' prefix foo infix bar suffix ');
        });

        it('returns correct result with sub properties', () => {
            var text = service.interpolate('prefix {{arg1.arg2}} suffix', { arg1: { arg2: 'foo' } });
            expect(text).toBe('prefix foo suffix');
        });

        it('returns correct result with sub property equals to undefined', () => {
            var text = service.interpolate('prefix {{arg1.arg2}} suffix', {  });
            expect(text).toBe('prefix  suffix');
        });
    });
});