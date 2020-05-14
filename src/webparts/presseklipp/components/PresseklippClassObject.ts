import {
    ITheme,
    mergeStyleSets,
    getTheme,
    getFocusStyle,
} from 'office-ui-fabric-react';
import { IReadonlyTheme } from '@microsoft/sp-component-base';

interface IPresseklippClassObject {
    webpartContainer: string;
    webpartHeader: string;
    webpartTitle: string;
    webpartButton: string;
    list: string;
    itemCell: string;
    itemImage: string;
    itemContent: string;
    itemName: string;
    itemMeta: string;
    itemDescription: string;
    linkIcon: string;
    itemIcon: string;
    itemTime: string;
    itemTag: string;
  }

  const theme: ITheme = getTheme();

export function getCLasses(themeVariant?: IReadonlyTheme | undefined): IPresseklippClassObject {
    const { palette, semanticColors, fonts } = themeVariant ? themeVariant : theme;
    return mergeStyleSets({
        webpartContainer: {
            background: semanticColors.bodyBackground,
        },
        webpartHeader: {},
        webpartTitle: {
            fontSize: 24,
            fontWeight: 400,
            marginBottom: 10,
        },
        webpartButton: {
            background: semanticColors.primaryButtonBackground,
            color: semanticColors.primaryButtonText,
            selectors: {
                '&hover': {
                    background: semanticColors.primaryButtonBackgroundHovered,
                    color: semanticColors.primaryButtonTextHovered,
                },
            },
        },
        list: {
            marginBottom: 10,
        },
        itemTime: {
            whiteSpace: 'nowrap',
        },
        itemCell: [
            getFocusStyle(theme, { inset: -1 }),
            {
            minHeight: 54,
            padding: 10,
            boxSizing: 'border-box',
            borderBottom: `1px solid ${semanticColors.bodyDivider}`,
            display: 'flex',
            textDecoration: 'none',
            color: semanticColors.listText,
            selectors: {
                '&:hover': { 
                    // background: palette.neutralLight,
                },
                '&:hover .item-name': {
                    textDecoration: 'underline',
                },
            },
            },
        ],
        itemImage: {
            flexShrink: 0,
            marginRight: 10,
        },
        itemContent: {
            overflow: 'hidden',
            flexGrow: 1,
        },
        itemName: [
            'item-name',
            fonts.large,
            {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                fontWeight: 400,
            },
        ],
        itemMeta: [
            fonts.small,
            {
                marginTop: 0,
            },
        ],
        itemDescription: {
            marginTop: 5,
            marginBottom: 7,
        },
        itemIcon: {
            marginTop: 5,
            marginLeft: 2,
            marginRight: 18,
            color: palette.themeTertiary    ,
            fontSize: 40,
            flexShrink: 0,
            width: 40,
            height: 40,
        },
        linkIcon: {
            alignSelf: 'center',
            marginLeft: 10,
            color: semanticColors.listText,
            fontSize: fonts.large.fontSize,
            flexShrink: 0,
        },
        itemTag: {
            background: semanticColors.disabledBackground,
            color: semanticColors.listText,
            padding: '0px 5px',
            marginRight: 5,
            borderRadius: 2,
            display: 'inline-block',
        },
    });
}
