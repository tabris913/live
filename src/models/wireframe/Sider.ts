import PageName from '../../constants/PageName';

export interface ISider {
  key: string;
  label: string;
  toPage?: PageName;
}

export interface ISiderSub {
  title: string;
  items: ISider[];
}
