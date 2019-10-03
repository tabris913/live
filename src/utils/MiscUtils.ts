import * as R from 'ramda';

export const snakeCase = (str: string) => str.replace(/([A-Z])/g, x => R.concat('_', x.toLowerCase()));
export const camelCase = (str: string) => str.replace(/(_[a-z])/g, x => x.slice(1).toUpperCase());

export const parseText2Json = (blob: Blob) => {
  const fr = new FileReader();
  fr.readAsText(blob);
  return fr;
};

export type ReturnedType<T> = T extends ((...args: any[]) => infer U) ? (U extends Promise<infer R> ? R : U) : never;

export const sortAscending = (array: any[], path?: string[]) =>
  array.sort((a, b) => ((path ? R.path<any>(path, a) < R.path<any>(path, b) : a < b) ? -1 : 1));

// sortDesending(props.content.songList, ['misc', 'times'])
export const sortDesending = (array: any[], path?: string[]) =>
  array.sort((a, b) => ((path ? R.path<any>(path, a) < R.path<any>(path, b) : a < b) ? 1 : -1));
