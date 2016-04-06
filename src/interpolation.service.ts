///<reference path="../node_modules/angular2/typings/browser.d.ts"/>
/// <reference path="../typings/main.d.ts" />

import {Injectable} from 'angular2/core';
import {Parser} from 'angular2/src/core/change_detection/parser/parser';
import {Interpolation, PropertyRead, ImplicitReceiver} from 'angular2/src/core/change_detection/parser/ast';

class TextInterpolation {
    private _interpolationFunctions: ((ctx: any)=>any)[];

    constructor(parts: ((ctx: any) => any)[]) {
        this._interpolationFunctions = parts;
    }

    public interpolate(ctx: any): string {
        return this._interpolationFunctions.map(f => f(ctx)).join('');
    }
}

@Injectable()
export class InterpolationService {
    private _parser: Parser;
    private _textInterpolations: Map<string, TextInterpolation>;

    constructor(parser: Parser) {
        this._parser = parser;
        this._textInterpolations = new Map<string, TextInterpolation>();
    }

    public interpolate(text: string, parameters: any): string {
        if (_.isString(text)) {
            let textInterpolation = this.getTextInterpolation(text);

            if (textInterpolation) {
                text = textInterpolation.interpolate(parameters);
            }
        }

        return _.isUndefined(text) || text === null ? '' : text;
    }

    private getTextInterpolation(text: string): TextInterpolation {
        let textInterpolation: TextInterpolation = this._textInterpolations[text];

        if (!textInterpolation) {
            let ast = this._parser.parseInterpolation(text, null);

            if (!ast) {
                return null;
            }

            if (ast.ast instanceof Interpolation) {
                textInterpolation = this.buildTextInterpolation(<Interpolation> ast.ast);
            } else {
                throw new Error(`The provided text is not a valid interpolation. Provided type ${ast.ast.constructor && ast.ast.constructor['name']}`);
            }
        }

        return textInterpolation;
    }

    private buildTextInterpolation(interpolation: Interpolation): TextInterpolation {
        let parts: ((ctx: any) => any)[] = [];

        for (let i = 0; i < interpolation.strings.length; i++) {
            let string = interpolation.strings[i];

            if (string.length > 0) {
                parts.push(ctx => string);
            }

            if (i < interpolation.expressions.length) {
                let exp = interpolation.expressions[i];

                if (exp instanceof PropertyRead) {
                    var getter = this.buildPropertyGetter(<PropertyRead>exp);
                    parts.push(this.addValueFormatter(getter));
                } else {
                    throw new Error(`Expression of type ${exp.constructor && exp.constructor.name1} is not supported. Text service supports properties only.`);
                }
            }
        }

        return new TextInterpolation(parts);
    };

private addValueFormatter(getter: ((ctx: any) => any)): ((ctx: any) => any) {
    return ctx => {
        var value = getter(ctx);

        if (value === null || _.isUndefined(value)) {
            value = '';
        }

        return value;
    }
}

    private buildPropertyGetter(exp: PropertyRead): ((ctx: any) => any) {
        var getter: ((ctx: any) => any);

        if (exp.receiver instanceof PropertyRead) {
            getter = this.buildPropertyGetter(<PropertyRead>exp.receiver);
        } else if (!(exp.receiver instanceof ImplicitReceiver)) {
            throw new Error(`Expression of type ${exp.receiver.constructor && (<any>exp.receiver).constructor.name} is not supported. Text service supports properties only.`);
        }

        if (getter) {
            let innerGetter = getter;
            getter = ctx => {
                ctx = innerGetter(ctx);
                return ctx && exp.getter(ctx);
            };
        } else {
            getter = <(ctx: any)=>any>exp.getter;
        }

        return ctx => ctx && getter(ctx);
    }

}