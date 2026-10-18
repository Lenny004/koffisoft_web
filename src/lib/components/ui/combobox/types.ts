/** Opción de un Combobox: `value` se envía en el formulario y `keywords` solo filtra. */
export interface ComboboxOption {
  value: string;
  label: string;
  disabled?: boolean;
  keywords?: string[];
}
