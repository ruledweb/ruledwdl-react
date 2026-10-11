# @ruledwdl/react

React components and wrappers for [RuledWDL](https://github.com/ruledweb/ruledwdl).

Depends on `@ruledwdl/core`. Does **not** use `@ruledwdl/csr`.

## Install

```bash
npm install @ruledwdl/react
```

Peer dependencies: `react`, `react-dom`.

## Usage

### `<Wdl />` — renderAll as React elements

```tsx
import { Wdl } from '@ruledwdl/react';

export default function Page() {
  return (
    <Wdl
      registry={{
        $version: '2.1',
        hero: { rules: [{ selector: ':scope', css: { padding: '2rem' } }] },
      }}
      components={[
        {
          layers: 'section.hero > h1.title + p.lead',
          attr: {
            '.title': { text: 'Hello ${name}' },
            '.lead': { text: '${tagline}' },
          },
        },
      ]}
      data={{ name: 'World', tagline: 'From WDL' }}
    />
  );
}
```

The component calls `renderAll` from `@ruledwdl/core` and converts the resulting HTML into React elements (via `html-react-parser`). You get a normal React tree — no `dangerouslySetInnerHTML`.

### `WdlCompose` — composePage in a Server Component

```tsx
import { WdlCompose, createMemoryStore } from '@ruledwdl/react';

const store = createMemoryStore({
  layouts: {
    base: {
      COMPONENTS: [{ layers: 'html > body > main#content' }],
      DATA: {},
    },
  },
});

export default async function Page() {
  return (
    <WdlCompose
      store={store}
      project="site"
      page={{
        title: 'Home',
        layout: 'base',
        COMPONENTS: [{ layers: 'h1.title', attr: { '.title': { text: 'Hello' } } }],
        DATA: {},
      }}
    />
  );
}
```

`WdlCompose` is an async function intended for React Server Components (Vinext / Next.js App Router). It calls `composePage`, extracts the `<body>` content, and returns React elements.

## API

| Export | Description |
|---|---|
| `Wdl` | Component. Props: `registry`, `components`, `data`, `opts`. |
| `WdlCompose` | Async Server Component helper. Props: `store`, `project`, `page`, `opts`. |
| `createMemoryStore` | Re-exported from `@ruledwdl/core` for convenience. |

## License

AGPL-3.0-or-later — same as `@ruledwdl/core`.
