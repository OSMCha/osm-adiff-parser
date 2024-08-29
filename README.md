# osm-adiff-parser

Parses OSM [augmented diff](https://wiki.openstreetmap.org/wiki/Overpass_API/Augmented_Diffs) XML and returns plain JS objects representing elements mentioned in the diff, grouped by changeset ID.

## Installation

```
npm install @osmcha/osm-adiff-parser
```

## Usage

```js
import parser from 'osm-adiff-parser';
let changesets = await parser(changesetXmlString);
```

## Example input & output

Input (an augmented diff of a simple changeset which added a couple of tags to an existing node)
```xml
<osm version="0.6" generator="Overpass API not used, but achavi detects it at the start of string; OSMExpress/python/examples/augmented_diff.py">
  <note>The data included in this document is from www.openstreetmap.org. The data is made available under ODbL.</note>
  <action type="modify">
    <old>
      <node id="2523603738" version="2" user="TheRomanP" uid="3844185" timestamp="2024-06-05T13:51:12Z" changeset="152289357" lon="-121.2881568" lat="47.6647943">
        <tag k="highway" v="trailhead" />
      </node>
    </old>
    <new>
      <node id="2523603738" version="3" timestamp="2024-08-20T21:36:16Z" uid="8794039" user="jake-low" changeset="155530622" lat="47.6647943" lon="-121.2881568">
        <tag k="highway" v="trailhead" />
        <tag k="name" v="Necklace Valley Trailhead" />
        <tag k="operator" v="US Forest Service" />
        <tag k="website" v="https://www.fs.usda.gov/recarea/mbs/recarea/?recid=80228" />
      </node>
    </new>
  </action>
</osm>
```

Output
```json
{
  "155530622": [
    {
      "id": "2523603738",
      "version": "3",
      "timestamp": "2024-08-20T21:36:16Z",
      "uid": "8794039",
      "user": "jake-low",
      "changeset": "155530622",
      "lat": "47.6647943",
      "lon": "-121.2881568",
      "old": {
        "id": "2523603738",
        "version": "2",
        "user": "TheRomanP",
        "uid": "3844185",
        "timestamp": "2024-06-05T13:51:12Z",
        "changeset": "152289357",
        "lon": "-121.2881568",
        "lat": "47.6647943",
        "action": "modify",
        "type": "node",
        "tags": {
          "highway": "trailhead"
        }
      },
      "action": "modify",
      "type": "node",
      "tags": {
        "highway": "trailhead",
        "name": "Necklace Valley Trailhead",
        "operator": "US Forest Service",
        "website": "https://www.fs.usda.gov/recarea/mbs/recarea/?recid=80228"
      }
    }
  ]
}
```

## History

This package is a fork of [mapbox/osm-adiff-parser](https://github.com/mapbox/osm-adiff-parser/) which is no longer maintained. Version 2.0.0 of `@osmcha/osm-adiff-parser` contains breaking API changes compared to version 1.1.0 of `osm-adiff-parser`. See the [CHANGELOG] for more details.

[CHANGELOG]: ./CHANGELOG.md
