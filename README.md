# Home Assistant Theme Color Viewer Card

A custom Home Assistant card that displays theme CSS variables with their actual colors. Perfect for theme developers and users who want to visualize their theme's color palette.

![Theme Color Viewer Card](https://img.shields.io/badge/Home%20Assistant-Custom%20Card-blue)

## Features

- **Visual Color Display**: See the actual colors of your Home Assistant theme CSS variables
- **Color Value Display**: Shows the underlying color value (e.g., `#ffcc33`) below the variable name
- **Copy to Clipboard**: Click the copy icon to quickly copy variable names
- **Fallback Indicator**: Crosshatch pattern indicates undefined or missing CSS variables
- **Drag & Drop Editor**: Reorder variables by dragging in the configuration editor
- **Pre-populated Defaults**: Comes with 16 common HA theme variables ready to use
- **Dropdown Selection**: Choose from a comprehensive list of known HA theme color variables
- **Custom Variables**: Add any custom CSS variable with validation
- **Card Picker Support**: Available in the Home Assistant card picker dialog

## Installation

### Manual Installation

1. Download the `hass-theme-color-viewer-card.js` file
2. Copy it to your Home Assistant configuration directory:
   ```
   <config>/www/hass-theme-color-viewer-card.js
   ```
3. Add the resource to your Home Assistant:
   - Go to **Settings** → **Dashboards** → **Resources** (three dots menu)
   - Click **Add Resource**
   - URL: `/local/hass-theme-color-viewer-card.js`
   - Resource type: **JavaScript Module**
4. Refresh your browser (Ctrl+F5 or Cmd+Shift+R)

### HACS Installation (Coming Soon)

HACS support will be added in a future release.

## Usage

### Via Card Picker (UI Editor)

1. Edit your dashboard
2. Click **Add Card**
3. Search for "Theme Color Viewer"
4. Click on the card to add it
5. Configure the card using the visual editor:
   - Set the card title
   - Add/remove CSS variables
   - Drag to reorder variables
   - Use the dropdown to select from known HA theme variables

### Via YAML

```yaml
type: custom:hass-theme-color-viewer-card
title: My Theme Colors
variables:
  - --primary-background-color
  - --secondary-background-color
  - --primary-color
  - --accent-color
  - --state-active-color
  - --state-inactive-color
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `title` | string | `"Theme Colors"` | The card header title |
| `variables` | array | See below | List of CSS variable names to display |

### Default Variables

The card comes pre-populated with these common Home Assistant theme variables:

- `--primary-background-color`
- `--secondary-background-color`
- `--sidebar-background-color`
- `--card-background-color`
- `--dark-primary-color`
- `--primary-color`
- `--light-primary-color`
- `--accent-color`
- `--ha-card-header-color`
- `--ha-card-border-color`
- `--primary-text-color`
- `--secondary-text-color`
- `--text-primary-color`
- `--disabled-text-color`
- `--state-active-color`
- `--state-inactive-color`

## CSS Variable Validation

When adding custom variables, they must:
- Start with `--`
- Contain only letters (a-z, A-Z), numbers (0-9), hyphens (-), and underscores (_)
- Begin with a letter after the `--` prefix

Valid examples:
- `--my-custom-color`
- `--primary-color`
- `--color_1`

Invalid examples:
- `my-color` (missing `--` prefix)
- `--123-color` (cannot start with number)
- `--my color` (spaces not allowed)

## Available HA Theme Color Variables

The dropdown includes these known Home Assistant theme color variables:

### Background Colors
- `--primary-background-color`
- `--secondary-background-color`
- `--sidebar-background-color`
- `--card-background-color`
- `--app-header-background-color`
- `--dialog-background-color`
- `--material-background-color`
- `--material-secondary-background-color`

### Primary Colors
- `--dark-primary-color`
- `--primary-color`
- `--light-primary-color`
- `--accent-color`

### Text Colors
- `--primary-text-color`
- `--secondary-text-color`
- `--text-primary-color`
- `--disabled-text-color`
- `--app-header-text-color`
- `--material-secondary-text-color`

### State Colors
- `--state-active-color`
- `--state-inactive-color`

### UI Element Colors
- `--ha-card-header-color`
- `--ha-card-border-color`
- `--divider-color`
- `--scrollbar-thumb-color`
- `--paper-item-icon-color`
- `--paper-item-icon-active-color`

### Input Colors
- `--input-fill-color`
- `--input-ink-color`
- `--input-label-ink-color`
- `--input-disabled-fill-color`
- `--input-disabled-ink-color`
- `--input-dropdown-icon-color`
- `--input-hover-fill-color`
- `--input-idle-line-color`
- `--input-disabled-line-color`

### Material Design Colors
- `--mdc-theme-primary`
- `--mdc-theme-secondary`
- `--mdc-theme-background`
- `--mdc-theme-surface`
- `--mdc-theme-error`
- `--mdc-theme-on-primary`
- `--mdc-theme-on-secondary`
- `--mdc-theme-on-surface`
- `--mdc-theme-on-error`

### RGB Color Variables
- `--rgb-primary-color`
- `--rgb-accent-color`
- `--rgb-state-active-color`
- `--rgb-state-inactive-color`
- `--rgb-red-color`
- `--rgb-pink-color`
- `--rgb-purple-color`
- `--rgb-deep-purple-color`
- `--rgb-indigo-color`
- `--rgb-blue-color`
- `--rgb-light-blue-color`
- `--rgb-cyan-color`
- `--rgb-teal-color`
- `--rgb-green-color`
- `--rgb-light-green-color`
- `--rgb-lime-color`
- `--rgb-yellow-color`
- `--rgb-amber-color`
- `--rgb-orange-color`
- `--rgb-deep-orange-color`
- `--rgb-brown-color`
- `--rgb-grey-color`
- `--rgb-blue-grey-color`
- `--rgb-white-color`
- `--rgb-black-color`
- `--rgb-disabled-color`

And more...

## Development

This card is built with:
- [Lit](https://lit.dev/) (loaded from CDN)
- Home Assistant custom card API
- Native HTML5 drag and drop

### Building

No build step required! The card uses Lit from CDN and can be used directly.

### Future Development

The project may be migrated to a compiled setup with:
- TypeScript support
- Rollup/Vite bundling
- Source maps for debugging

## Troubleshooting

### Card not showing up
- Make sure the resource is added correctly in Settings → Dashboards → Resources
- Clear browser cache and hard refresh (Ctrl+F5)
- Check browser console for errors

### Colors not displaying
- Ensure your theme defines the CSS variables
- Check that variable names are spelled correctly
- Undefined variables will show a crosshatch pattern

### Editor not working
- The visual editor requires Home Assistant 2023.4 or later
- Make sure you're using the UI editor, not YAML mode

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits

- Built following the [Home Assistant Custom Card documentation](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card)
- Uses [Lit](https://lit.dev/) for efficient web components

## Support

If you encounter any issues or have questions, please [open an issue](https://github.com/htpchome/hass-theme-color-viewer-card/issues) on GitHub.