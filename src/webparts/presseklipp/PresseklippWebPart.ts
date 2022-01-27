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

export default class PresseklippWebPart extends BaseClientSideWebPart<IPresseklippWebPartProps> {

  private _themeProvider: ThemeProvider;
  private _themeVariant: IReadonlyTheme | undefined;

  public async onInit(): Promise<void> {
    
      // Consume the new ThemeProvider service
      this._themeProvider = this.context.serviceScope.consume(ThemeProvider.serviceKey);

      // If it exists, get the theme variant
      this._themeVariant = this._themeProvider.tryGetTheme();

      // Register a handler to be notified if the theme variant changes
      this._themeProvider.themeChangedEvent.add(this, this._handleThemeChangedEvent);

      await super.onInit();
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

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  private async _validateFeedUrl(value: string): Promise<String> {
    if (value === null || value.trim().length === 0) return 'Du må oppgi feed-URL';
    if (
      value.substring(0,34) !== 'https://m360.opoint.com/api/feeds/'
      && value.substring(0,29) !== 'https://api.opoint.com/feeds/'
    ) return 'Dette er ikke en gyldig Mbrain-url';
    try {
      const response = await fetch(value);
      if (!response.ok) return `Denne URL-en fungerte ikke. Feil: ${response.status} ${response.statusText}`;
      const {searchresult: {document: items}} = await response.json();
      if (!items[0]) return 'Feil: Fant ingen artikler i denne feeden.';
      if (items[0].matches === undefined) return 'Feil: Du må huke av for «Inkluder treffsetninger» i feed-innstillingene i Mbrain.';
      return '';
    } catch(error) {
      return error.message;
    }
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
                  onGetErrorMessage: this._validateFeedUrl.bind(this)
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
