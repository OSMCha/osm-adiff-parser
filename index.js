import sax from "sax";

const TYPED_ATTRS = [
  "id",
  "uid",
  "changeset",
  "visible",
  "version",
  "lon",
  "lat",
  "ref",
  "min_lon",
  "min_lat",
  "max_lon",
  "max_lat",
  "comments_count",
  "changes_count",
  "open",
];

function parseAttributes(attributes) {
  for (let attr of TYPED_ATTRS) {
    if (attributes[attr] !== undefined) {
      try {
        attributes[attr] = JSON.parse(attributes[attr]);
      } catch {
        throw new Error(`Failed to parse value "${attributes[attr]}" for attribute "${attr}" (expected a JSON value)`);
      }
    }
  }
  return attributes;
}

function parseAugmentedDiff(xmlData) {
  return new Promise((resolve, reject) => {
    var xmlParser = sax.parser(true /* strict mode */, { lowercase: true });
    var currentAction = {};
    var currentElement = {};
    var currentMember = {};
    var result = { actions: [] };

    function startTag(node) {
      var symbol = node.name;
      var attrs = parseAttributes(node.attributes);

      if (symbol === "action") {
        currentAction = { type: attrs.type };
      }
      if (symbol === "node" || symbol === "way" || symbol === "relation") {
        currentElement = { type: symbol, ...attrs, tags: {} };
        if (symbol === "way") {
          currentElement.nodes = [];
        }
        if (symbol === "relation") {
          currentElement.members = [];
          currentMember = {};
        }
      }
      if (symbol === "tag" && currentElement) {
        currentElement.tags[attrs.k] = attrs.v;
      }

      if (symbol === "nd" && currentElement && currentElement.type === "way") {
        currentElement.nodes.push(attrs);
      }

      if (symbol === "nd" && currentElement && currentElement.type === "relation") {
        currentMember.nodes.push(attrs);
      }

      if (symbol === "member" && currentElement && currentElement.type === "relation") {
        currentMember = { ...attrs, nodes: [] };
        currentElement.members.push(currentMember);
      }
    }

    function endTag(symbol) {
      if (symbol === "old" || symbol === "new") {
        currentAction[symbol] = currentElement;
      }
      if (symbol === "action") {
        if (currentAction.type == "create") {
          currentAction.new = currentElement;
        }
        result.actions.push(currentAction);
      }
      if (symbol === "osm") {
        resolve(result);
      }
    }

    xmlParser.onopentag = startTag;
    xmlParser.onclosetag = endTag;
    xmlParser.onerror = reject;
    xmlParser.write(xmlData);
    xmlParser.close();
  });
}

export default parseAugmentedDiff;
