import React from 'react';
import { renderAll, composePage, createMemoryStore } from '@ruledwdl/core';
import parse from 'html-react-parser';

type Registry = Record<string, any>;
type Components = any[];
type Data = Record<string, any>;

export interface WdlProps extends React.HTMLAttributes<HTMLDivElement> {
  /** WDL REGISTRY object */
  registry?: Registry;
  /** WDL COMPONENTS array */
  components?: Components;
  /** WDL DATA object */
  data?: Data;
  /** Extra options passed to renderAll */
  opts?: Record<string, any>;
}

/**
 * Renders a WDL document as React elements using @ruledwdl/core's renderAll.
 * Does not use @ruledwdl/csr.
 *
 * @example
 * <Wdl
 *   registry={{ $version: '2.1', hero: { rules: [] } }}
 *   components={[{ layers: 'section.hero > h1.title', attr: { '.title': { text: 'Hello ${name}' } } }]}
 *   data={{ name: 'World' }}
 * />
 */
export function Wdl({
  registry = {},
  components = [],
  data = {},
  opts,
  ...divProps
}: WdlProps) {
  const html = renderAll(registry, components, data, opts);
  const elements = parse(html);
  return <div {...divProps}>{elements}</div>;
}

export interface WdlComposeProps {
  /** Store implementing the WDL Store contract */
  store: any;
  /** Project id passed to the store */
  project: string;
  /** Page object (REGISTRY / COMPONENTS / DATA / layout / title) */
  page: {
    REGISTRY?: Registry;
    COMPONENTS?: Components;
    DATA?: Data;
    layout?: string;
    title?: string;
    scripts?: any[];
  };
  /** Options forwarded to composePage */
  opts?: Parameters<typeof composePage>[3];
  /** Optional wrapper element props */
  wrapperProps?: React.HTMLAttributes<HTMLDivElement>;
}

/**
 * Server Component helper that calls composePage and returns the body as React elements.
 * Use only in async Server Components or route handlers.
 *
 * @example
 * const store = createMemoryStore({ layouts: {...}, components: {...} });
 * const el = await WdlCompose({ store, project: 'site', page: { COMPONENTS: [...], layout: 'base' } });
 */
export async function WdlCompose({
  store,
  project,
  page,
  opts,
  wrapperProps,
}: WdlComposeProps) {
  const { html } = await composePage(store, project, page, opts);
  // Extract body content so we do not nest a full document inside a React tree.
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const bodyHtml = bodyMatch ? bodyMatch[1] : html;
  const elements = parse(bodyHtml);
  return <div {...wrapperProps}>{elements}</div>;
}

// Re-export useful core helpers so consumers can build stores without a second import.
export { createMemoryStore } from '@ruledwdl/core';
