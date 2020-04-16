export interface IPageMetadata {
  description?: string
  icon: string
  img?: string
  keywords?: string[]
  title?: string
  language?: string
  type?: string
  url: string
  provider: string
}

export interface IPageMetadataContext {
  url: string
}

export type PageMetadataRule = [
  string,
  (el: HTMLElement) => (string | null)
]

export function getProvider (host: string): string

export function buildRuleSet<O = any, CMP = any> (ruleSet: {
  rules: PageMetadataRule[]
  scorers: (el: HTMLElement, score: CMP) => CMP
  defaultValue: (context: IPageMetadataContext) => O
  processors: ((output: O, context: IPageMetadataContext) => any)[]
}): (doc: Document, context: IPageMetadataContext) => void

export const metadataRuleSets: Record<keyof IPageMetadata, PageMetadataRule>

export function getMetadata (
  doc: Document | HTMLElement,
  url: string,
  customRuleSets?: Record<string, PageMetadataRule>
): IPageMetadata
