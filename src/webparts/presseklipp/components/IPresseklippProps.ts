import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IPresseklippProps {
  title: string;
  description: string;
  feedUrl: string;
  itemsCount: number;
  cacheDuration: number;
  compressed: boolean;
  instanceId: string;
  context: WebPartContext;
  themeVariant: IReadonlyTheme | undefined;
}
