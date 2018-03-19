import round from 'lodash/round';
import capitalize from 'lodash/capitalize';
import sortBy from 'lodash/sortBy';
import indentString from 'indent-string';
import colorsTemplate from './templates/colors.mustache';
import textStylesTemplate from './templates/textStyles.mustache';
import textBlockTemplate from './templates/textBlock.mustache';
import resourceDictionaryTemplate from './templates/resourceDictionary.mustache';
import linearGradientBrushTemplate from './templates/linearGradientBrush.mustache';

function debug(object) { // eslint-disable-line no-unused-vars
  return {
    code: JSON.stringify(object),
    language: 'json',
  };
}

function actualKey(context, key) {
  const duplicateSuffix = context.getOption('duplicateSuffix');
  return key.replace(duplicateSuffix, '').replace(/\s/g, '');
}

function xamlColorHex(color) {
  const hex = color.toHex();
  const a = Math.round(color.a * 255).toString(16);
  return (`#${a}${hex.r}${hex.g}${hex.b}`).toUpperCase();
}

function xamlColorLiteral(context, color) {
  const colorResource = context.project.findColorEqual(color);
  return colorResource
    ? `{StaticResource ${actualKey(context, colorResource.name)}}`
    : xamlColorHex(color);
}

function xamlSolidColorBrushLiteral(context, color) {
  const colorResource = context.project.findColorEqual(color);
  return colorResource
    ? `{StaticResource ${actualKey(context, colorResource.name)}Brush}`
    : xamlColorHex(color);
}

function xamlColor(context, color) {
  return {
    key: actualKey(context, color.name),
    color: xamlColorHex(color),
  };
}

function xamlPointLiteral(point) {
  const x = round(point.x, 2);
  const y = round(point.y, 2);
  return `${x},${y}`;
}

function xamlGradientStop(context, gradientStop) {
  return {
    offset: gradientStop.position,
    color: xamlColorLiteral(context, gradientStop.color),
  };
}

function xamlLinearGradientBrush(context, linearGradientBrush) {
  return {
    startPoint: xamlPointLiteral(linearGradientBrush.from),
    endPoint: xamlPointLiteral(linearGradientBrush.to),
    gradientStops: linearGradientBrush.colorStops.map(stop => xamlGradientStop(context, stop)),
  };
}

function xamlSolidColorBrush(context, color) {
  return {
    key: `${actualKey(context, color.name)}Brush`,
    color: `{StaticResource ${actualKey(context, color.name)}}`,
  };
}

function xamlFontWeight(fontWeight) {
  switch (fontWeight) {
    case 100: return 'Thin';
    case 200: return 'ExtraLight';
    case 300: return 'Light';
    case 350: return 'SemiLight';
    case 400: return 'Normal';
    case 500: return 'Medium';
    case 600: return 'SemiBold';
    case 700: return 'Bold';
    case 800: return 'ExtraBold';
    case 900: return 'Black';
    case 950: return 'ExtraBlack';
    default: return 'Normal';
  }
}

function xamlCharacterSpacing(letterSpacing) {
  // LetterSpacing is in points
  // CharacterSpacing is in units of 1/1000 of an em
  // 1 em = 12 points
  return Math.round((letterSpacing / 12) * 1000);
}

function xamlStyle(context, textStyle) {
  const addCharacterEllipsis = context.getOption('addCharacterEllipsis');
  const ignoreCharacterSpacing = context.getOption('ignoreCharacterSpacing');
  const ignoreFontFamily = context.getOption('ignoreFontFamily');
  const ignoreLineHeight = context.getOption('ignoreLineHeight');
  const textAlignmentMode = context.getOption('textAlignmentMode');
  const hasTextAlignment = textAlignmentMode === 'style';
  const foreground = textStyle.color && xamlSolidColorBrushLiteral(context, textStyle.color);

  return {
    key: actualKey(context, textStyle.name),
    foreground,
    fontFamily: !ignoreFontFamily && textStyle.fontFamily,
    fontSize: round(textStyle.fontSize, 2),
    characterSpacing: !ignoreCharacterSpacing && xamlCharacterSpacing(textStyle.letterSpacing),
    fontStyle: capitalize(textStyle.fontStyle),
    fontWeight: xamlFontWeight(textStyle.fontWeight),
    lineHeight: !ignoreLineHeight && round(textStyle.lineHeight, 2),
    textAlignment: hasTextAlignment && capitalize(textStyle.textAlign),
    textTrimming: addCharacterEllipsis && 'CharacterEllipsis',
  };
}

function xamlTextBlock(context, textLayer) {
  const textAlignmentMode = context.getOption('textAlignmentMode');
  const hasTextAlignment = textAlignmentMode === 'textBlock';
  const { textStyle } = textLayer.textStyles[0];
  const textStyleResource = context.project.findTextStyleEqual(textStyle);
  const textBlock = textStyleResource ?
    { style: actualKey(context, textStyleResource.name) } : xamlStyle(context, textStyle);

  textBlock.text = textLayer.content;
  textBlock.textAlignment = hasTextAlignment && capitalize(textStyle.textAlign);

  return textBlock;
}

function xamlCode(code) {
  return {
    code,
    language: 'xml',
  };
}

function xamlFile(code, filename) {
  return {
    code,
    language: 'xml',
    filename,
  };
}

function comment(context, text) {
  return `<!-- ${text} -->`;
}

function styleguideColors(context, colors) {
  const sortResources = context.getOption('sortResources');
  const duplicateSuffix = context.getOption('duplicateSuffix');
  let processedColors = colors;

  if (sortResources) {
    processedColors = sortBy(processedColors, 'name');
  }

  if (duplicateSuffix) {
    processedColors = processedColors.filter(color => !color.name.endsWith(duplicateSuffix));
  }

  const code = colorsTemplate({
    colors: processedColors.map(color => xamlColor(context, color)),
    solidColorBrushes: processedColors.map(color => xamlSolidColorBrush(context, color)),
  });

  return xamlCode(code);
}

function styleguideTextStyles(context, textStyles) {
  const sortResources = context.getOption('sortResources');
  const duplicateSuffix = context.getOption('duplicateSuffix');
  let processedTextStyles = textStyles;

  if (sortResources) {
    processedTextStyles = sortBy(processedTextStyles, 'name');
  }

  if (duplicateSuffix) {
    processedTextStyles = processedTextStyles
      .filter(textStyle => !textStyle.name.endsWith(duplicateSuffix));
  }

  const code = textStylesTemplate({
    styles: processedTextStyles.map(textStyle => xamlStyle(context, textStyle)),
  });

  return xamlCode(code);
}

function exportStyleguideColors(context, colors) {
  const resources = indentString(styleguideColors(context, colors).code, 4);
  const resourceDictionary = resourceDictionaryTemplate({ resources });
  return xamlFile(resourceDictionary, 'Colors.xaml');
}

function exportStyleguideTextStyles(context, textStyles) {
  const resources = indentString(styleguideTextStyles(context, textStyles).code, 4);
  const resourceDictionary = resourceDictionaryTemplate({ resources });
  return xamlFile(resourceDictionary, 'TextBlock.xaml');
}

function layer(context, selectedLayer) {
  if (selectedLayer.type === 'text') {
    const textBlock = xamlTextBlock(context, selectedLayer);
    const code = textBlockTemplate(textBlock);
    return xamlCode(code);
  }

  if (selectedLayer.type === 'shape') {
    const linearGradient = selectedLayer.fills
      .filter(fill => fill.type === 'gradient')
      .map(fill => fill.gradient)
      .filter(gradient => gradient.type === 'linear')[0];
    if (linearGradient) {
      const linearGradientBrush = xamlLinearGradientBrush(context, linearGradient);
      const code = linearGradientBrushTemplate(linearGradientBrush);
      return xamlCode(code);
    }
  }
  return null;
}

const extension = {
  comment,
  styleguideColors,
  styleguideTextStyles,
  exportStyleguideColors,
  exportStyleguideTextStyles,
  layer,
};

export default extension;
