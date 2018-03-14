# Zeplin XAML Extension

[Zeplin extension](https://extensions.zeplin.io/) that generates XAML (Universal Windows Platform) snippets from colors, text styles and layers.

It is open source and [available on GitHub](https://github.com/nventive/zeplin-extension-xaml).

## Samples

Sample colors output:
```xml
<Color x:Key="PrimaryColor">#FFFF0000</Color>
<Color x:Key="SecondaryColor">#FF00FF00</Color>
<Color x:Key="TertiaryColor">#FF0000FF</Color>
<SolidColorBrush x:Key="PrimaryColorBrush"
                 Color="{StaticResource PrimaryColor}" />
<SolidColorBrush x:Key="SecondaryColorBrush"
                 Color="{StaticResource SecondaryColor}" />
<SolidColorBrush x:Key="TertiaryColorBrush"
                 Color="{StaticResource TertiaryColor}" />
```

Sample text style output:
```xml
<Style x:Key="SampleTextStyle"
       TargetType="TextBlock">
    <Setter Property="CharacterSpacing"
            Value="0" />
    <Setter Property="FontFamily"
            Value="SFProText" />
    <Setter Property="FontSize"
            Value="20" />
    <Setter Property="FontStyle"
            Value="Normal" />
    <Setter Property="FontWeight"
            Value="Normal" />
    <Setter Property="Foreground"
            Value="{StaticResource PrimaryColorBrush}" />
    <Setter Property="LineHeight"
            Value="20" />
    <Setter Property="TextTrimming"
            Value="CharacterEllipsis" />
</Style>
```

Sample text layer output:
```xml
<TextBlock Text="Hello"
           Style="{StaticResource SampleTextStyle}"
           TextAlignment="Center">
```

Sample gradient layer output:
```xml
<LinearGradientBrush StartPoint="0.5,0.5" 
                     EndPoint="0.5,1">
    <GradientStop Color="{StaticResource SecondaryColor}" 
                  Offset="0" />
    <GradientStop Color="{StaticResource TertiaryColor}" 
                  Offset="1" />
</LinearGradientBrush>
```

## Options

#### Sort styleguide resources

Toggle whether styleguide resources should be sorted alphabetically or not.

#### Consolidate duplicates

Define the suffix that indicates that a resource is a duplicate and should be consolidated.

For example, using the value `_duplicate` would replace all instances of `PrimaryColor_duplicate` with `PrimaryColor` in generated snippets.

This is useful when dealing with values that are almost identical (i.e., `#FFFFFF` vs `#FFFFFE`) or properties that don't warrant a distinct style (i.e., `TextAlignment`).

#### Define TextAlignment on

Pick whether `TextAlignment` should be defined on `Style` or `TextBlock`.

This is useful if you consider text alignment to be part of the layout rather than the style. Can be used in conjunction with duplicate consolidation.

#### Ignore CharacterSpacing

Toggle whether `CharacterSpacing` should be generated or not.

#### Ignore FontFamily

Toggle whether `FontFamily` should be generated or not.

#### IgnoreLineHeight

Toggle whether `LineHeight` should be generated or not.

#### Add TextTrimming.CharacterEllipsis to all text styles

Toggle whether `TextTrimming.CharacterEllipsis` should be added to all text styles.

This can be useful to prevent unwanted clipping, considering that the platform's default value is `None`.

## Development

This extension is developed using [zem](https://github.com/zeplin/zem), Zeplin Extension Manager. zem is a command line tool that lets you quickly create and test extensions.

To learn more about zem, [see documentation](https://github.com/zeplin/zem).

## License

This project is licensed under the Apache License, Version 2.0 - see the [LICENSE](LICENSE) file for details.
