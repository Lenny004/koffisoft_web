export { cn } from 'cn';

/** Omite la prop `child` de un componente bits-ui para reenviar el resto. */
export type WithoutChild<T> = T extends { child?: unknown } ? Omit<T, 'child'> : T;

/** Omite la prop `children` cuando el wrapper define su propio contenido. */
export type WithoutChildren<T> = T extends { children?: unknown } ? Omit<T, 'children'> : T;

export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;

/** Extiende props HTML con la referencia al elemento que bits-ui enlaza. */
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };
