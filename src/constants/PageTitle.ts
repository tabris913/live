import { ContentName } from './ContentName';

export const PageTitle: { [K in ContentName]: string } = {
  artist: 'Artist',
  work: 'Work',
  song: 'Song',
  lives: 'Live List',
  live: 'Live',
};
