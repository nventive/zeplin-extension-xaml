import _ from 'lodash';
import colorsTemplate from './templates/colors.mustache';
import textStylesTemplate from './templates/textStyles.mustache';
import textBlockTemplate from './templates/textBlock.mustache';

function xamlColorHex(color) {
    const hex = color.toHex();
    const a = Math.round(color.a * 255).toString(16);
    const r = hex.r;
    const g = hex.g;
    const b = hex.b;
    return ('#' + a + r + g + b).toUpperCase();
}

function xamlColorLiteral(context, color) {
    const colorResource = context.project.findColorEqual(color);
    return colorResource ? 
        `{StaticResource ${colorResource.name}Brush}` : xamlColorHex(color);
}

function xamlColor(color) {
    return {
        key: color.name,
        color: xamlColorHex(color)
    };
}

function xamlSolidColorBrush(color) {
    return {
        key: `${color.name}Brush`,
        color: `{StaticResource ${color.name}}`
    };
}

function xamlStyle(context, textStyle) {
    const ignoreCharacterSpacing = context.getOption('ignoreCharacterSpacing');
    const ignoreLineHeight = context.getOption('ignoreLineHeight');
    const textAlignmentMode = context.getOption('textAlignmentMode');
    const hasTextAlignment = textAlignmentMode === 'style';
    const defaultFontFamily = context.getOption('defaultFontFamily');
    const isDefaultFontFamily = textStyle.fontFamily === defaultFontFamily;
    const foreground = textStyle.color && xamlColorLiteral(context, textStyle.color);
    
    return {
        key: textStyle.name,
        style: textStyle.name,
        foreground: foreground,
        fontFamily: !isDefaultFontFamily && textStyle.fontFamily,
        fontSize: _.round(textStyle.fontSize, 2),
        characterSpacing: !ignoreCharacterSpacing && _.round(textStyle.letterSpacing, 2),
        fontStyle: _.capitalize(textStyle.fontStyle),
        fontWeight: _.capitalize(textStyle.weightText),
        lineHeight: !ignoreLineHeight && _.round(textStyle.lineHeight, 2),
        textAlignment: hasTextAlignment && _.capitalize(textStyle.textAlign),
    };
}

function xamlTextBlock(context, textLayer) {
    const textAlignmentMode = context.getOption('textAlignmentMode');
    const hasTextAlignment = textAlignmentMode === 'textBlock';
    const textStyle = textLayer.textStyles[0].textStyle;
    const textStyleResource = context.project.findTextStyleEqual(textStyle);
    const textBlock = textStyleResource ? 
        { style: textStyleResource.name } : xamlStyle(context, textStyle);
    
    textBlock.text = textLayer.content;
    textBlock.textAlignment = hasTextAlignment && _.capitalize(textStyle.textAlign);

    return textBlock;
}

function comment(context, text) {
    return text;
}

function styleguideColors(context, colors) {
    const sortResources = context.getOption('sortResources');
    const colorsFilter = context.getOption('colorsFilter');

    if (sortResources) {
        colors = _.sortBy(colors, 'name');
    }

    if (colorsFilter) {
        const regex = new RegExp(colorsFilter);
        colors = colors.filter(color => regex.test(color.name));
    }

    const code = colorsTemplate({
        colors: colors.map(xamlColor),
        solidColorBrushes: colors.map(xamlSolidColorBrush)
    });

    return {
        code,
        language: 'xml',
    };
}

function styleguideTextStyles(context, textStyles) {
    const sortResources = context.getOption('sortResources');
    const textStylesFilter = context.getOption('textStylesFilter');
    if (sortResources) {
        textStyles = _.sortBy(textStyles, 'name');
    }
    
    if (textStylesFilter) {
        const regex = new RegExp(textStylesFilter);
        textStyles = textStyles.filter(textStyle => regex.test(textStyle.name));
    }
    
    const code = textStylesTemplate({
        styles: textStyles.map(textStyle => xamlStyle(context, textStyle))
    });

    return {
        code,
        language: 'xml',
    };
}

function layer(context, selectedLayer) {
    if (selectedLayer.type === 'text') {
        const textBlock = xamlTextBlock(context, selectedLayer);
        const code =  textBlockTemplate(textBlock);

        return {
            code,
            language: 'xml',
        };
    }
}

const extension = {
    comment,
    styleguideColors,
    styleguideTextStyles,
    layer,
}

export default extension;