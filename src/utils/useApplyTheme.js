// utils/useApplyTheme.js
export function applyThemeToRoot(theme) {
  const root = document.documentElement;

  if (theme.primary_color) {
    const rgb = hexToRgb(theme.primary_color);
    root.style.setProperty("--color-text", rgb.join(" "));
  }

  if (theme.background_color) {
    const rgb = hexToRgb(theme.background_color);
    root.style.setProperty("--color-background", rgb.join(" "));
  }

  if (theme.admin_color) {
    const rgb = hexToRgb(theme.admin_color);
    root.style.setProperty("--color-admin", rgb.join(" "));
  }

  if (theme.font_serif)
    root.style.setProperty("--font-serif", theme.font_serif);

  if (theme.font_sans)
    root.style.setProperty("--font-sans", theme.font_sans);
}

function hexToRgb(hex) {
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    hex = hex.split("").map((h) => h + h).join("");
  }
  const bigint = parseInt(hex, 16);
  return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
