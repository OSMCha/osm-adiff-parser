import sax from 'sax';

// Returns elements grouped by changeset ID.

function AugmentedDiffParser(xmlData) {
  return new Promise((resolve, reject) => {
    var xmlParser = sax.parser(true /* strict mode */, { lowercase: true });
    var currentAction = '';
    var currentElement = {};
    var oldElement = {};
    var currentMember = {};
    var currentMode = '';
    var changesetMap = {};

    function isElement(symbol) {
      return symbol === 'node' || symbol === 'way' || symbol === 'relation';
    }

    function endTag(symbol) {
      if (symbol === 'action') {
        var changesetId = currentElement.changeset;
        if (changesetMap[changesetId] === undefined) {
          changesetMap[changesetId] = [];
        }
        changesetMap[changesetId].push(currentElement);
      }
      if (symbol === 'osm') {
        resolve(changesetMap);
      }
    }

    function startTag(node) {
      var symbol = node.name;
      var attrs = node.attributes;

      if (symbol === 'action') {
        currentAction = attrs.type;
      }
      if (symbol === 'new' || symbol === 'old') {
        currentMode = symbol;
      }
      if (isElement(symbol)) {
        if (currentMode === 'new' && (currentAction === 'modify' || currentAction === 'delete')) {
          oldElement = currentElement;
          currentElement = attrs;
          currentElement.old = oldElement;
        } else {
          currentElement = attrs;
        }
        currentElement.action = currentAction;
        currentElement.type = symbol;
        currentElement.tags = {};
        if (symbol === 'way') {
          currentElement.nodes = [];
        }
        if (symbol === 'relation') {
          currentElement.members = [];
          currentMember = {};
        }
      }
      if (symbol === 'tag' && currentElement) {
        currentElement.tags[attrs.k] = attrs.v;
      }

      if (symbol === 'nd' && currentElement && currentElement.type === 'way') {
        currentElement.nodes.push(attrs);
      }

      if (symbol === 'nd' && currentElement && currentElement.type === 'relation') {
        currentMember.nodes.push(attrs);
      }

      if (symbol === 'member' && currentElement && currentElement.type === 'relation') {
        currentMember = attrs;
        currentMember.nodes = [];
        currentElement.members.push(currentMember);
      }
    }

    xmlParser.onopentag = startTag;
    xmlParser.onclosetag = endTag;
    xmlParser.onerror = reject;
    xmlParser.write(xmlData);
    xmlParser.close();
  });
}

export default AugmentedDiffParser;
