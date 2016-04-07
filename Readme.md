# Angular 2 - Interpolation Service

A library for interpolation based on abstract syntax tree (AST) parsers of Angular 2. 

## Usage

1. Inject the service `InterpolationService`
2. Call the method `interpolate` with a format string and an object to be used for replacement of the placeholders

```
// returns 'Hello World!'
interpolation.interpolate('Hello {{placeholder}}', { placeholder: 'World!'});
```

## Build

The interpolation service is written in Typescript and has to be transpiled to Javascript.

1. Execute `npm install`
2. Execute `npm run build`

## Tests

Running tests

1. Execute `npm install`
2. Execute `npm run test`

Look at code coverage after running tests

1. Execute `npm run coverage-server`