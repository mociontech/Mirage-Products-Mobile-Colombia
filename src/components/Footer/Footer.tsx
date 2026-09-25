import styles from "./Footer.module.css";

const DOMAIN_BY_COUNTRY: Record<string, string> = {
  CO: "www.airesmirage.co",
  // TODO: confirmar el dominio oficial de Mexico (www.mirage.mx era el
  // mismo tipo de placeholder que www.mirage.co resulto ser para Colombia -
  // el real es www.airesmirage.co, no ese).
  MX: "www.mirage.mx",
};

/** Every Figma screen ends in this globe-icon + domain line — the domain flips per-country deployment, same VITE_COUNTRY knob used everywhere else. */
export function Footer() {
  const country = import.meta.env.VITE_COUNTRY as string | undefined;
  const domain = (country && DOMAIN_BY_COUNTRY[country]) || DOMAIN_BY_COUNTRY.CO;

  return (
    <p className={styles.footer}>
      <svg className={styles.icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="12" cy="12" rx="4" ry="9" stroke="currentColor" strokeWidth="1.5" />
        <path d="M3 12h18M4.5 7.5h15M4.5 16.5h15" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      {domain}
    </p>
  );
}
