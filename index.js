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
    var currentXmlTag = null;
    var currentAction = {};
    var currentElement = {};
    var currentMember = {};
    var result = { actions: [] };

    xmlParser.onopentag = function (node) {
      var symbol = node.name;
      currentXmlTag = symbol;

      if (symbol === "meta") {
        result.meta = {...result.meta, ...node.attributes };
        return;
      }
      
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

    xmlParser.ontext = function (text) {
      if (currentXmlTag === "note") {
        result.note = text;
      }
    }

    xmlParser.onclosetag = function (symbol) {
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

      currentXmlTag = null;
    }

    xmlParser.onerror = reject;
    xmlParser.write(xmlData);
    xmlParser.close();
  });
}

export default parseAugmentedDiff;
