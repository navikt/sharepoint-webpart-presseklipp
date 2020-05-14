import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneToggle
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import * as strings from 'PresseklippWebPartStrings';
import Presseklipp from './components/Presseklipp';
import { IPresseklippProps } from './components/Presseklipp';
import { Placeholder } from "@pnp/spfx-controls-react/lib/Placeholder";
import { ThemeProvider, ThemeChangedEventArgs, IReadonlyTheme } from '@microsoft/sp-component-base';

export interface IPresseklippWebPartProps {
  title: string;
  description: string;
  feedUrl: string;
  itemsCount: number;
  compressed: boolean;
  cacheDuration: number;
  seeAllUrl: string;
  themeVariant: IReadonlyTheme | undefined;
}

export default class PresseklippWebPart extends BaseClientSideWebPart <IPresseklippWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;
    
  protected onInit(): Promise<void> {
      // Consume the new ThemeProvider service
      this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);
  
      // If it exists, get the theme variant
      this._themeVariant = this._themeProvider.tryGetTheme();
  
      // Register a handler to be notified if the theme variant changes
      this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);
  
      return super.onInit();
  }

  private _handleThemeChangedEvent(args: ThemeChangedEventArgs): void {
    this._themeVariant = args.theme;
    this.render();
  }

  public render(): void {
    const element: React.ReactElement<IPresseklippProps> = React.createElement(
      Presseklipp,
      {
        title: this.properties.title,
        description: this.properties.description,
        feedUrl: this.properties.feedUrl,
        itemsCount: this.properties.itemsCount,
        compressed: this.properties.compressed,
        cacheDuration: this.properties.cacheDuration,
        instanceId: this.instanceId,
        context: this.context,
        themeVariant: this._themeVariant,
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
                PropertyPaneToggle('compressed', {
                  label: strings.CompressedFieldLabel,
                }),
                PropertyPaneSlider('itemsCount', {
                  label: strings.ItemsCountFieldLabel,
                  min: 1,
                  max: 50,
                }),
                PropertyPaneSlider('cacheDuration', {
                  label: strings.CacheExpirationTimeFieldLabel,
                  min: 1,
                  max: 240,
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
