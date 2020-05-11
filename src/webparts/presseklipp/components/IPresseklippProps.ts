import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IPresseklippProps {
  title: string;
  description: string;
  feedUrl: string;
  itemsCount: number;
  cacheDuration: number;
  instanceId: string;
  context: WebPartContext;
}
