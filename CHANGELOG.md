# Changelog

All notable changes to this project will be documented in this file.

Versioning of this project adheres to the [Semantic Versioning](https://semver.org/spec/v2.0.0.html) spec.

## [3.0.0]

Released 2025-01-28

### Breaking changes

The output format has changed to more closely resemble the augmented diff XML format. The parser now returns an object with an `actions` array. Each action is an object with a `type` property (either `"create"`, `"modify"`, or `"delete"`). Modify and delete actions have `old` and `new` properties which describe the element before and after the change (deletes increment the version number). Create actions only have a `new` property.

A number of element properties are now parsed as numbers rather than returned as strings. They are:
- `id` (the node, way, or relation ID)
- `lat`, `lon`
- `version`
- `changeset` (the changeset ID that last modified the element)
- `uid` (the user ID who made the changeset)
- `ref` (the ID of a way's node or a relation's member)

Also, the `visible` property is now parsed as a boolean (it will be `false` on the `new` version of deleted elements).

### New features

This package now supports parsing the `note` and `meta` elements on an augmented diff. They will appear as top-level keys in the object returned by the parser.

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

[3.0.0]: https://github.com/OSMCha/osm-adiff-parser/releases/tag/v3.0.0
[2.0.0]: https://github.com/OSMCha/osm-adiff-parser/releases/tag/v2.0.0
