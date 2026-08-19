/**
 * Types for the RB Headless API plugin response shape.
 * Endpoint: /wp-json/headless/v1/contents/[slug|id]
 */

export interface WPFeaturedImage {
  id: number;
  url: string;
  alt: string;
  width: number;
  height: number;
  sizes?: Record<string, { url: string; width: number; height: number }>;
}

export interface WPTerm {
  id: number;
  name: string;
  slug: string;
  taxonomy: string;
}

export interface WPAncestor {
  id: number;
  slug: string;
  title: string;
  path: string;
}

export interface WPSeo {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  noindex?: boolean;
}

/** A single ACF Flexible Content layout row. Shape of `data` depends on `acf_fc_layout`. */
export interface FlexibleContentLayout<T = Record<string, unknown>> {
  acf_fc_layout: string;
  [key: string]: unknown;
  data?: T;
}

export interface WPContent {
  id: number;
  slug: string;
  path: string;
  type: "page" | "post" | string;
  status: string;
  title: string;
  excerpt?: string;
  content?: string;
  date: string;
  modified: string;
  parent: number;
  /** Full ancestor chain, root first, for building breadcrumbs / nested routes. */
  ancestors: WPAncestor[];
  /** Direct child pages, useful for nav/sitemaps of hierarchical content. */
  children?: WPAncestor[];
  featuredImage?: WPFeaturedImage | null;
  terms?: WPTerm[];
  seo?: WPSeo;
  /** ACF Flexible Content field rows. */
  flexibleContent?: FlexibleContentLayout[];
  /** Any other ACF fields not part of flexible content. */
  acf?: Record<string, unknown>;
}

export interface WPContentListItem {
  id: number;
  slug: string;
  path: string;
  type: string;
  modified: string;
}

export class WPApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "WPApiError";
    this.status = status;
  }
}
