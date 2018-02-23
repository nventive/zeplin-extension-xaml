import _ from 'lodash';
import colorsTemplate from './templates/colors.mustache';
import textStylesTemplate from './templates/textStyles.mustache';

function comment(context, text) {
    return text;
}

function styleguideColors(context, colors) {
    const sortColors = context.getOption('sortColors');
    const colorsFilter = context.getOption('colorsFilter');

    if (sortColors) {
        colors = _.sortBy(colors, 'name');
    }

    if (colorsFilter) {
        const regex = new RegExp(colorsFilter);
        colors = colors.filter(color => regex.test(color.name));
    }

    function colorView(color) {
        return {
            key: color.name,
            color: hexColor(color)
        }
    }

    function solidColorBrushView(color) {
        return {
            key: `${color.name}Brush`,
            color: `{StaticResource ${color.name}}`
        }
    }

    const colorsView = {
        colors: colors.map(colorView),
        solidColorBrushes: colors.map(solidColorBrushView)
    };

    const code = colorsTemplate(colorsView);

    return {
        code,
        language: 'xml',
    }
}

function styleguideTextStyles(context, textStyles) {
    const sortTextStyles = context.getOption('sortTextStyles');
    const textStylesFilter = context.getOption('textStylesFilter');
    const defaultFontFamily = context.getOption('defaultFontFamily');
    const generateForeground = context.getOption('generateForeground');
    const generateFontFamily = context.getOption('generateFontFamily');
    const generateFontSize = context.getOption('generateFontSize');
    const generateCharacterSpacing = context.getOption('generateCharacterSpacing');
    const generateFontStyle = context.getOption('generateFontStyle');
    const generateFontWeight = context.getOption('generateFontWeight');
    const generateTextAlignment = context.getOption('generateTextAlignment');
    const generateLineHeight = context.getOption('generateLineHeight');

    if (sortTextStyles) {
        textStyles = _.sortBy(textStyles, 'name');
    }

    if (textStylesFilter) {
        const regex = new RegExp(textStylesFilter);
        textStyles = textStyles.filter(textStyle => regex.test(textStyle.name));
    }

    function textStyleView(context, textStyle) {
        const color = context.project.findColorEqual(textStyle.color) || textStyle.color;
        const colorLiteral = color.name != null ? `{StaticResource ${color.name}Brush}` : hexColor(color);
        const isDefaultFontFamily = textStyle.fontFamily == defaultFontFamily;

        return {
            key: textStyle.name,
            foreground: generateForeground && colorLiteral,
            fontFamily: generateFontFamily && !isDefaultFontFamily && textStyle.fontFamily,
            fontSize: generateFontSize && _.round(textStyle.fontSize, 2),
            characterSpacing: generateCharacterSpacing && _.round(textStyle.letterSpacing, 2),
            fontStyle: generateFontStyle && _.capitalize(textStyle.fontStyle),
            fontWeight: generateFontWeight && _.capitalize(textStyle.weightText),
            textAlignment: generateTextAlignment && _.capitalize(textStyle.textAlign),
            lineHeight: generateLineHeight && _.round(textStyle.lineHeight, 2),
        }
    }

    const textStylesView = {
        styles: textStyles.map(textStyle => textStyleView(context, textStyle))
    };

    const code = textStylesTemplate(textStylesView);

    return {
        code,
        language: 'xml',
    }
}

function hexColor(color) {
    const hex = color.toHex();
    const a = Math.round(color.a * 255).toString(16);
    const r = hex.r;
    const g = hex.g;
    const b = hex.b;
    return ('#' + a + r + g + b).toUpperCase();
}

const extension = {
    comment,
    styleguideColors,
    styleguideTextStyles,
}

export default extension;