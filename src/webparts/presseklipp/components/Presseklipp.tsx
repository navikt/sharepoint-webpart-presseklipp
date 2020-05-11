import * as React from 'react';
import { IPresseklippProps } from './IPresseklippProps';
import { IPresseklippItem } from './IPresseklippItem';
import { PresseklippCell } from './PresseklippCell';
import { classNames } from './PresseklippClassObject';
import { escape } from '@microsoft/sp-lodash-subset';
import { PnPClientStorage } from "@pnp/common";
import * as moment from 'moment';
import * as strings from 'PresseklippWebPartStrings';
import {
  List,
  DefaultButton,
  Panel,
  PanelType,
} from 'office-ui-fabric-react';

export interface IPresseklippState {
  items?: IPresseklippItem[];
  isOpen: boolean;
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
      const storageKey = `presseklipp-${this.props.context.pageContext.web.serverRelativeUrl}-${this.props.instanceId}`;
      const json = await storage.local.getOrPut(storageKey, async () => {
        const response = await fetch(this.props.feedUrl);
        return await response.json();
      }, moment(now).add(this.props.cacheDuration, 'm').toDate());
      this.setState({ items: json.searchresult.document });
    } catch (error) {
      throw error;
    }
  }

  public _onRenderCellCompressed(item: IPresseklippItem, index: number | undefined, compressed: boolean): JSX.Element {
    return(
      <PresseklippCell
        item={item}
        compressed={true}
      />
    );
  }

  public _onRenderCell(item: IPresseklippItem, index: number | undefined): JSX.Element {
    return(
      <PresseklippCell
        item={item}
        compressed={false}
      />
    );
  }

  public render(): JSX.Element {
    return (
      <div>
        <div className={classNames.webpartHeader}>
          <h2 className={classNames.webpartTitle}>{this.props.title}</h2>
          <p>{escape(this.props.description)}</p>
        </div>
        <List className={classNames.list} items={this.state.items} onRenderCell={this._onRenderCellCompressed} renderCount={this.props.itemsCount} />
        <DefaultButton text={strings.OpenButtonLabel} onClick={() => this.setState({isOpen: true})} />
        <Panel
          isLightDismiss
          headerText={this.props.title}
          type={PanelType.medium}
          isOpen={this.state.isOpen}
          onDismiss={() => this.setState({isOpen: false})}
          closeButtonAriaLabel={strings.CloseButtonAriaLabel}
        >
          <List items={this.state.items} onRenderCell={this._onRenderCell} renderCount={50} />
        </Panel>
      </div>
    );
  }
}
