interface ImportMetaEnv {
  /** Frame image variant: 'a' (ESA crops) or 'b' (generated). */
  readonly PUBLIC_FRAME?: 'a' | 'b';
}
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
