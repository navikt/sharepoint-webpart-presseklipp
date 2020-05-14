import * as React from 'react';
import { IPresseklippProps } from './IPresseklippProps';
import { IPresseklippItem } from './IPresseklippItem';
import { PresseklippCell } from './PresseklippCell';
import { getCLasses } from './PresseklippClassObject';
import { escape } from '@microsoft/sp-lodash-subset';
import { PnPClientStorage } from "@pnp/common";
import * as moment from 'moment';
import * as strings from 'PresseklippWebPartStrings';
import {
  List,
  Button,
  Panel,
  PanelType,
} from 'office-ui-fabric-react';
import {
  mergeStyleSets,
  getFocusStyle,
} from 'office-ui-fabric-react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';
import { DetailsColumn } from 'office-ui-fabric-react/lib/components/DetailsList/DetailsColumn';

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
    const classNames = getCLasses(this.props.themeVariant && this.props.themeVariant);

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
