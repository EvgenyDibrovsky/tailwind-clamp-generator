# Clamp() Generator for Tailwind & Native CSS

A web-based tool for generating responsive CSS clamp values that work seamlessly with both Tailwind CSS and native CSS. This tool helps you create fluid typography and spacing that scales smoothly between different viewport sizes.

🔗 [Live Demo](https://evgenydibrovsky.github.io/tailwind-clamp-generator/)

## Features

- **Dual Output Formats**: Generate values for both Tailwind CSS and native CSS
- **Flexible Unit System**: 
  - Input units: px or rem
  - Output units: px or rem (for native CSS)
  - Tailwind CSS always uses rem for optimal compatibility
- **High Precision**: Accurate px ↔ rem conversions (30px = 1.875rem)
- **Customizable Viewport Breakpoints**: Set your own min/max screen widths
- **Smart Rounding**: Optional rounding for cleaner values
- **Instant Preview**: Real-time generation as you type
- **One-click Copy**: Copy generated values to clipboard instantly

## Usage

1. Visit the [Clamp() Generator](https://evgenydibrovsky.github.io/tailwind-clamp-generator/)
2. Choose your output format:
   - **Tailwind CSS**: Generates `text-[clamp(...)]` classes
   - **Native CSS**: Generates `font-size: clamp(...)` properties
3. Select your input units (px or rem) for entering values
4. Enter your desired values:
   - Minimum text size (mobile)
   - Maximum text size (desktop)
   - Minimum screen width (px)
   - Maximum screen width (px)
5. For native CSS: choose output units (px or rem)
6. Optionally enable rounding for smoother values
7. Copy the generated clamp value to your clipboard

## Example Output

### Tailwind CSS Format
```html
<!-- Always uses rem units for min/max values -->
<div class="text-[clamp(1rem,2.5vw+10px,2rem)]">Responsive Text</div>
```

### Native CSS Format
```css
/* With px output units */
.responsive-text {
  font-size: clamp(16px, calc(2.5vw + 10px), 32px);
}

/* With rem output units */
.responsive-text {
  font-size: clamp(1rem, calc(2.5vw + 0.625rem), 2rem);
}
```

## Precision

The generator provides high-precision conversions:
- **Without rounding**: 30px = 1.875rem (3 decimal places)
- **With rounding**: 30px = 1.88rem (2 decimal places)

## Browser Support

- Modern browsers with CSS `clamp()` support
- IE11 and older browsers are not supported

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

If you find any issues or have questions, please [open an issue](https://github.com/EvgenyDibrovsky/tailwind-clamp-generator/issues) on GitHub.

## Author

Made by [Evgeny Dibrovsky](https://github.com/EvgenyDibrovsky)