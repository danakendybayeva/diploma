export interface Menu {
  icon?: string;
  id: string;
  typeMenu: number;
  title: string;
  parentId: string;
  orderNum: number;
  routing?: string;
  roles: [];
  hidden: boolean;
  sub?: Menu[];
}

export interface IMenuItem {
  title: string;
  icon?: IMenuItemIcon;
  color?: string;
  active?: boolean;
  disabled?: boolean;
  hovered: boolean;
  groupTitle?: boolean;
  routing?: string;
  currentmenu?:boolean;
  externalLink?: string;
  sub?: IMenuItemSub[];
  badge?: IMenuItemBadge;
  pathToSvg?: IMenuItemSvg;
  access?: string[];

}

export interface IMenuItemIcon {
  class?: string;
  color?: string;
  bg?: string;
}
export interface IMenuItemSvg {
  pathToSvg?: string;
  pathToDarkSvg?: string;
}
export interface IMenuItemSub {
  title: string;
  icon?: string;
  color?: string;
  hovered: boolean;
  active?: boolean;
  disabled?: boolean;
  routing?: string;
  externalLink?: string;
  sub?: IMenuItemSub[];
  access?: string[];
  layout?: string;
}
export interface IMenuItemBadge {
  text?: string;
  color?: string;
  bg?: string;
}
