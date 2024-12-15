const { pathsToModuleNameMapper } = require('ts-jest');
const typescriptConfig = require('./tsconfig.json');
const { compilerOptions } = typescriptConfig;
/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  roots: ['<rootDir>'],
  modulePaths: [compilerOptions.baseUrl],
    moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>' }),
  transform: {
    "^.+.tsx?$": ["ts-jest",{
        tsconfig: "tsconfig.json"
    }]
  }
}