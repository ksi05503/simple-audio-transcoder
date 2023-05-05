import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
    roots: ['<rootDir>/__tests__'],
    preset: 'ts-jest',
    testEnvironment: 'node',
    testMatch: ['**/__tests__/**/*.test.[jt]s?(x)'],
};

export default config;
