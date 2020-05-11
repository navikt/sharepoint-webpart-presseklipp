import * as React from 'react';
import * as moment from 'moment';
import { IPresseklippItem } from "./IPresseklippItem";
import { classNames } from './PresseklippClassObject';
import {
  Icon,
  Image,
  ImageFit,
} from 'office-ui-fabric-react';

interface IPresseklippCellProps {
  item: IPresseklippItem;
  compressed: boolean;
}

export class PresseklippCell extends React.Component<IPresseklippCellProps> {
  private _mediaTypes = {
    "WEB": {icon: "Globe", label: "nett"},
    "RADIO": {icon: "Streaming", label: "radio"},
    "TV": {icon: "TVMonitor", label: "tv"},
    "PRINT": {icon: "News", label: "papir"},
  };
  
  public render(): JSX.Element {
    const {
      orig_url: link,
      mediatype: {text: mediatype},
      header: {text: title},
      url_common,
      first_source: {sitename},
      local_rcf822_time: {text: pubDate},
      summary: {text: description},
      quotes,
      articleimages,
      screenshots
    } = this.props.item;
    const compressed = this.props.compressed;
    
    const imageUrl = (articleimages
      ? articleimages.articleimage[0].url
      : screenshots && screenshots[0] && screenshots[0].text);
      
    return (
      <a
      href={link}
      target='_blank'
      className={classNames.itemCell}
      data-is-focusable={true}
      >
        {!compressed && ( imageUrl
          ? <Image className={classNames.itemImage} src={imageUrl} width={50} height={50} imageFit={ImageFit.cover} />
          : <Icon iconName={this._mediaTypes[mediatype].icon} className={classNames.itemIcon} />)
        }
        <div className={classNames.itemContent}>
          <div className={classNames.itemName}>{title}</div>
          <div className={classNames.itemMeta}>
            {sitename} ({mediatype == 'WEB' ? `${url_common}` : `${this._mediaTypes[mediatype].label}`})
            {'  //  '}
            <time className={classNames.itemTime} dateTime={moment(pubDate).format()}>{moment(pubDate).format("D.M.YYYY [kl.] HH:mm")}</time>
          </div>
          {!compressed && <div className={classNames.itemDescription}>{description ? description : quotes && quotes.quote && quotes.quote.text && `Sitat: «${quotes.quote.text}»`}</div>}
        </div>
        <Icon className={classNames.linkIcon} iconName={'Link'} />
      </a>
    );
  }
}
