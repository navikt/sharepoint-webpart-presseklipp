import {
    ITheme,
    mergeStyleSets,
    getTheme,
    getFocusStyle,
  } from 'office-ui-fabric-react';

interface IPresseklippClassObject {
    webpartHeader: string;
    webpartTitle: string;
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
  }
  
const theme: ITheme = getTheme();
const { palette, semanticColors, fonts } = theme;

export const classNames: IPresseklippClassObject = mergeStyleSets({
    webpartHeader: {
        
    },
    webpartTitle: {
        fontSize: 24,
        fontWeight: 400,
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
        selectors: {
            '&:hover': { 
                background: palette.neutralLight,
            },
            '&:hover .item-name': {
                textDecoration: 'underline',
            },
            '&:visited': {
            color: palette.neutralSecondary,
            },
        },
        textDecoration: 'none',
        color: palette.neutralPrimary,
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
        },
    ],
    itemMeta: [
        fonts.small,
    ],
    itemDescription: {
        marginTop: 10,
    },
    itemIcon: {
        marginTop: 5,
        marginLeft: 2,
        marginRight: 18,
        color: palette.neutralTertiary,
        fontSize: 40,
        flexShrink: 0,
        width: 40,
        height: 40,
    },
    linkIcon: {
        alignSelf: 'center',
        marginLeft: 10,
        color: palette.neutralPrimaryAlt,
        fontSize: fonts.large.fontSize,
        flexShrink: 0,
    },
    });
