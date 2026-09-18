import * as stylex from "@stylexjs/stylex";

/**
 * Design tokens for the StyleX component set.
 *
 * Each token wraps the corresponding CSS custom property defined in the app's
 * global stylesheet (e.g. `--primary`). Components reference `colors.primary`
 * / `radius.md` instead of stringly-typed `var(--primary)` so token usage is
 * typed and centralized. Note: dark-mode toggling (a `.dark` class variant of
 * these variables, e.g. via next-themes) isn't wired up yet — only the light
 * theme in `styles.css` is defined today.
 */
export const colors = stylex.defineConsts({
  accent: "var(--accent)",
  accentForeground: "var(--accent-foreground)",
  background: "var(--background)",
  border: "var(--border)",
  card: "var(--card)",
  cardForeground: "var(--card-foreground)",
  destructive: "var(--destructive)",
  foreground: "var(--foreground)",
  input: "var(--input)",
  muted: "var(--muted)",
  mutedForeground: "var(--muted-foreground)",
  popover: "var(--popover)",
  popoverForeground: "var(--popover-foreground)",
  primary: "var(--primary)",
  primaryForeground: "var(--primary-foreground)",
  ring: "var(--ring)",
  secondary: "var(--secondary)",
  secondaryForeground: "var(--secondary-foreground)",
  sidebar: "var(--sidebar)",
  sidebarAccent: "var(--sidebar-accent)",
  sidebarAccentForeground: "var(--sidebar-accent-foreground)",
  sidebarBorder: "var(--sidebar-border)",
  sidebarForeground: "var(--sidebar-foreground)",
  sidebarPrimary: "var(--sidebar-primary)",
  sidebarPrimaryForeground: "var(--sidebar-primary-foreground)",
  sidebarRing: "var(--sidebar-ring)",
});

export const radius = stylex.defineConsts({
  "2xl": "1rem",
  full: "9999px",
  lg: "var(--radius)",
  md: "calc(var(--radius) - 2px)",
  sm: "calc(var(--radius) - 4px)",
  xl: "calc(var(--radius) + 4px)",
});
