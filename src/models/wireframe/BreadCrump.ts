import PageName from '../../constants/PageName';

export interface IBreadCrump {
  href?: PageName;
  label: string;
  hrefWithId?: string;
}

export interface IBreadCrumpItem {
  label: string | React.ReactNode;
  key: string | number;
  open: () => void;
}
