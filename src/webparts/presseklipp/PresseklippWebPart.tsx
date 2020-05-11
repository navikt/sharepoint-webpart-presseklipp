import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'PresseklippWebPartStrings';
import Presseklipp from './components/Presseklipp';
import { IPresseklippProps } from './components/IPresseklippProps';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";

export interface IPresseklippWebPartProps {
  title: string;
  description: string;
  feedUrl: string;
  itemsCount: number;
  compressed: boolean;
  cacheDuration: number;
  seeAllUrl: string;
}

export default class PresseklippWebPart extends BaseClientSideWebPart <IPresseklippWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPresseklippProps> = React.createElement(
      Presseklipp,
      {
        title: this.properties.title,
        description: this.properties.description,
        feedUrl: this.properties.feedUrl,
        itemsCount: this.properties.itemsCount,
        cacheDuration: this.properties.cacheDuration,
        instanceId: this.instanceId,
        context: this.context,
      }
    );

    ReactDom.render((this.properties.feedUrl) ? element : <Placeholder
      iconName='Edit'
      iconText={strings.View_EmptyPlaceholder_Label}
      description={strings.View_EmptyPlaceholder_Description}
      buttonLabel={strings.View_EmptyPlaceholder_Button}
      onConfigure={this._onConfigure.bind(this)} />, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private _onConfigure(): void {
    this.context.propertyPane.open();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('title', {
                  label: strings.WebPartTitleFieldLabel,
                }),
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel,
                }),
                PropertyPaneTextField('feedUrl', {
                  label: strings.FeedUrlFieldLabel,
                }),
                PropertyPaneSlider('itemsCount', {
                  label: strings.ItemsCountFieldLabel,
                  min: 1,
                  max: 50,
                }),
                PropertyPaneSlider('cacheDuration', {
                  label: strings.CacheExpirationTimeFieldLabel,
                  min: 0,
                  max: 1440,
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
