import * as R from 'ramda';

export const snakeCase = (str: string) => str.replace(/([A-Z])/g, x => R.concat('_', x.toLowerCase()));
export const camelCase = (str: string) => str.replace(/(_[a-z])/g, x => x.slice(1).toUpperCase());
