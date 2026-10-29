# Dependency security refresh

Tracking issue: Donkijote/three-in-line#103.

## Runtime and compatibility

- Use Bun 1.4.4, matching `packageManager` and the GitHub workflows. The scoped overrides produce version 3 lockfiles, which older Bun versions cannot read.
- CI uses Node 24.x. The upgraded JSDOM requires Node 22.22.2+, 24.15.0+, or 26+; Node 22.14 is no longer sufficient.
- Web uses Vite 8, React plugin 6, Vitest 5, JSDOM 30, TypeScript 7, and Lucide 1. React Compiler now runs through `@rolldown/plugin-babel`; TypeScript paths are relative to each config rather than the removed `baseUrl` option.
- Mobile stays on the Expo SDK 54 release line, updated to 54.0.38. React 19.1, React Native 0.81.5, native modules, and Jest remain aligned with that SDK. NativeWind 4 requires the mobile Tailwind 3 stack. A newer Expo SDK is a separate native migration, not required to resolve the patched security findings here.
- Mobile Lucide and NativeWind are updated to 1.64.0 and 4.2.7. Convex, Convex Auth, and shared form dependencies are updated in both contexts.
- Expo now rejects router roots outside the mobile project. `mobile/app/` contains thin route entries that re-export the existing implementations in `src/ui/mobile/routes/`.

## Temporary transitive overrides

Revisit these overrides when the parent packages release compatible dependency updates:

- Web `@dotenvx/dotenvx>undici`: pin 7.30.1 to replace its vulnerable exact 7.18.2 dependency without downgrading JSDOM's Undici 8.
- Mobile `decode-uri-component`: pin 0.5.1 for Expo Router's `query-string` dependency, fixing malformed percent-encoded input handling.
- Mobile `metro@~0.83.0`: pin 0.83.8, a patch release that removes the vulnerable `image-size` dependency. Do not force `image-size` 2 into older Metro: it no longer accepts the file-path API used by those releases.
- Mobile `postcss`: pin 8.5.32 to replace the vulnerable version fixed in Expo's older Metro configuration and used by Tailwind's nested CSS tooling.

## Audit results and remaining advisory

The October 29, 2026 Bun audit baseline reported 161 advisories in the web context and 127 in mobile. These are advisory counts, not counts of independently exploitable application paths.

After the refresh, each context reports just one low-severity advisory: `deepmerge` 4.3.1, GHSA-gcqx-w48m-w2h4 (prototype poisoning). The registry still lists 4.3.1 as its latest release, so there is no published patched upgrade to apply. Web receives it through shadcn's registry tooling; mobile receives it through Expo configuration and Jest. This is a documented residual risk, not a claim that either context is vulnerability-free. Recheck upstream before merging and during subsequent dependency updates.

Run full audits without suppressing that finding:

```sh
bun audit --cwd web
bun audit --cwd mobile
```

To check that no moderate, high, or critical advisories remain:

```sh
bun audit --cwd web --audit-level moderate
bun audit --cwd mobile --audit-level moderate
```

The PR checks run these thresholded audits for each changed platform. Low-severity findings remain visible in the full audit commands and must still be reviewed; they are not silently ignored by an advisory-specific exclusion.

## Validation

```sh
bun run install:contexts
bun run lint
bun run typecheck
bun run test
bun run web:build
bun run --cwd mobile expo install --check
bun run --cwd mobile build:check
```

Mobile export validates iOS and Android JavaScript/Hermes bundles, not a native binary. Native dependency patch updates also require running `pod install` in `mobile/ios` before building iOS. CocoaPods is not installed in the upgrade environment, so the tracked Podfile lockfile has not been regenerated and native builds have not been verified.
