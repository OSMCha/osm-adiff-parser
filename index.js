import sax from "sax";

function parseAugmentedDiff(xmlData) {
  return new Promise((resolve, reject) => {
    var xmlParser = sax.parser(true /* strict mode */, { lowercase: true });
    var currentAction = {};
    var currentElement = {};
    var currentMember = {};
    var result = { actions: [] };

    function startTag(node) {
      var symbol = node.name;
      var attrs = node.attributes;

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
