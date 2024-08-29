# Changelog

All notable changes to this project will be documented in this file.

Versioning of this project adheres to the [Semantic Versioning](https://semver.org/spec/v2.0.0.html) spec.

## [2.0.0]

Released 2024-08-28

### Added

- ECMAScript Modules (ESM) support. CommonJS is still supported too (via transpilation at publish time).

### Changed

- Improved parsing speed by roughly 4x by removing unnecessary object copying.
- (Breaking) Parser function now returns a Promise rather than taking a callback argument.

### Removed

- Removed the `changesetsFilter` option. Filtering can be done by the caller on the returned changesets if desired (filtering internally offered no performance advantage).


## Older versions

This package is a fork of [mapbox/osm-adiff-parser](https://github.com/mapbox/osm-adiff-parser/) v1.1.0 which is no longer maintained.

[2.0.0]: https://github.com/OSMCha/osm-adiff-parser/releases/tag/v2.0.0
