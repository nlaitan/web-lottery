export type Language =
  | "english"
  | "spanish"
  | "french"
  | "german"
  | "italian"
  | "portuguese_br"
  | "japanese"
  | "chinese_simplified"
  | "arabic"
  | "hindi";

export type Translation = Record<string, string>;

export type Translations = Record<Language, Translation>;
