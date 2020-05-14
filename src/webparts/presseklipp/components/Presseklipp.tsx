import * as React from 'react';
import * as moment from 'moment';
import { escape } from '@microsoft/sp-lodash-subset';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { PnPClientStorage } from "@pnp/common";
import {
  List,
  Button,
  Panel,
  PanelType,
} from 'office-ui-fabric-react';
import * as strings from 'PresseklippWebPartStrings';
import { PresseklippCell } from './PresseklippCell';
import { getClasses } from './PresseklippClassObject';

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

export interface IPresseklippState {
  items?: IPresseklippItem[];
  isOpen: boolean;
}

export interface IPresseklippItem {
  id_site: number;
  id_article: number;
  first_source: {sitename: string, url: string};
  header: {text: string};
  summary: {text: string};
  quotes?: {quote: {text: string}};
  articleimages?: {count: number, articleimage: [{url: string}]};
  screenshots: [{text: string}];
  orig_url: string;
  url_common: string;
  local_rcf822_time: {text: string};
  mediatype: {text: string};
  compressed: boolean;
  matches: [{color: number, text: string}];
}

export default class Presseklipp extends React.Component<IPresseklippProps, IPresseklippState> {

  constructor(props: IPresseklippProps) {
    super(props);
    this.state = { 
      items: [],
      isOpen: false,
    };
  }

  public componentDidMount() {
    this.fetchData();
  }

  public componentWillUpdate(nextProps: IPresseklippProps) {
    if (nextProps != this.props) this.fetchData();
  }

  private async fetchData() {
    try {
      const storage = new PnPClientStorage();
      const now = new Date();
      const storageKey = `presseklipp-${this.props.feedUrl}`;
      const json = await storage.local.getOrPut(storageKey, async () => {
        const response = await fetch(this.props.feedUrl);
        return await response.json();
      }, moment(now).add(this.props.cacheDuration, 'm').toDate());
      this.setState({ items: json.searchresult.document });
    } catch (error) {
      throw error;
    }
  }

  public render(): JSX.Element {
    const classNames = getClasses(this.props.themeVariant);

    return (
      <div className={classNames.webpartContainer}>
        <div className={classNames.webpartHeader}>
          <h2 className={classNames.webpartTitle}>{this.props.title}</h2>
          { this.props.description && <p>{escape(this.props.description)}</p>}
        </div>
        { this.props.compressed && <div>
          <List className={classNames.list} items={this.state.items} onRenderCell={(item, _index) => (
            <PresseklippCell
              item={item}
              compressed={true}
              themeVariant={this.props.themeVariant}
            />
          )} renderCount={this.props.itemsCount} />
          <Button text={strings.OpenButtonLabel} onClick={() => this.setState({isOpen: true})} className={classNames.webpartButton} />
          <Panel
            isLightDismiss
            headerText={this.props.title}
            type={PanelType.medium}
            isOpen={this.state.isOpen}
            onDismiss={() => this.setState({isOpen: false})}
            closeButtonAriaLabel={strings.CloseButtonAriaLabel}
          >
            <List items={this.state.items} onRenderCell={(item, _index) => (
              <PresseklippCell
                item={item}
                compressed={false}
              />
            )} />
          </Panel>
        </div> }
        { !this.props.compressed && <List items={this.state.items} onRenderCell={(item, _index) => (
            <PresseklippCell
              item={item}
              compressed={false}
              themeVariant={this.props.themeVariant}
            />
          )} renderCount={this.props.itemsCount} />}
      </div>
    );
  }
}
