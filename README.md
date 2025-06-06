# Tailwind Clamp Generator

A web-based tool for generating responsive CSS clamp values that work seamlessly with Tailwind CSS. This tool helps you create fluid typography and spacing that scales smoothly between different viewport sizes.

🔗 [Live Demo](https://evgenydibrovsky.github.io/tailwind-clamp-generator/)

## Features

- Interactive web interface for generating clamp values
- Support for both px and rem units
- Customizable viewport breakpoints
- Option to enable rounding for smoother values
- Instant preview of generated clamp values
- One-click copy to clipboard functionality

## Usage

1. Visit the [Tailwind Clamp Generator](https://evgenydibrovsky.github.io/tailwind-clamp-generator/)
2. Enter your desired values:
   - Minimum text size (mobile)
   - Maximum text size (desktop)
   - Minimum screen width (px)
   - Maximum screen width (px)
3. Choose your preferred unit (px or rem)
4. Optionally enable rounding for smoother values
5. Copy the generated clamp value to your clipboard

## Example Output

```css
/* Example with rem units */
.text-responsive {
  font-size: clamp(1rem, calc(1rem + 1vw), 2rem);
}

/* Example with px units */
.text-responsive {
  font-size: clamp(16px, calc(16px + 1vw), 32px);
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Support

If you find any issues or have questions, please [open an issue](https://github.com/EvgenyDibrovsky/tailwind-clamp-generator/issues) on GitHub.

## Author

Made by [Evgeny Dibrovsky](https://github.com/EvgenyDibrovsky)