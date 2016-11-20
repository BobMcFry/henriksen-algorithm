/* ##################### */
/* ~~~~ HENTREE_OUT ~~~~ */
/* ##################### */

var HenTreeOut = function( henAlgorithm ) {

	this.henAlgorithm = henAlgorithm;

};

HenTreeOut.prototype.getTree = function( ) {

	var tree = this.henAlgorithm.henTree;
	var height = tree.getHeight();
	nodes = [];
	for (var lvl = 0; lvl < height; lvl++) {
		nodes.push(tree.getNodes(lvl));
	}
	return nodes;

};


/* ################## */
/* ~~~~ LIST_OUT ~~~~ */
/* ################## */

var ListOut = function( henAlgorithm ) {

	this.henAlgorithm = henAlgorithm;	

};

ListOut.prototype.getList = function( ) {
	
	list = [];
	var currentNotice = this.henAlgorithm.eventList.head;
	while( currentNotice !== null ) {
		list.push(currentNotice);
		currentNotice = currentNotice.next;
	}

	return list;
	
}


var HenAlgorithmOut = function( henAlgorithm ) {
	
	this.henAlgo = henAlgorithm;
	this.listOut = new ListOut( henAlgorithm );
	this.henTreeOut = new HenTreeOut( henAlgorithm );

}

HenAlgorithmOut.prototype.NODESPACE = 2;
HenAlgorithmOut.prototype.FLOATSPACE = 0;
HenAlgorithmOut.prototype.BOTTOMSPACE = 1;


HenAlgorithmOut.prototype.notify = function() {
	// TODO: this function is used when the model changes, observer and so on.
};

HenAlgorithmOut.prototype.getStringRepresentation = function() {

	var list = this.listOut.getList();
	var listString = "";

	// LIST of notices
	listString += "[-]"
	listString += this.getBottomSpaceString();

	for (var i = 1; i < list.length-1; i++) {
		listString += sprintf("%"+this.NODESPACE+"."+this.FLOATSPACE+"f", list[i].time);
		listString += this.getBottomSpaceString();
	}
	listString += "[+]"

	var treeString = this.getTreeStringRepresentation(listString.length);

	treeString += "\n\n" + listString;

	return treeString;

}

HenAlgorithmOut.prototype.getTreeStringRepresentation = function(width) {


	// TREE
	var string = "";
	var tree = this.henTreeOut.getTree();
	var height = tree.length;
	var noOfLeafs = tree[height-1].length;
	var lvlStrings = [];
	var space;
	var noNodes;

	for (var lvl = 0; lvl < height; lvl++) {
		
		noNodes = tree[lvl].length;
		space = (width-(noNodes * this.NODESPACE)) / noNodes;

		// add half before first
		string += this.getSpaceString(0.5 * space);

		// print nodes with complete space between
		for (var i = 0; i < noNodes; i++) {
			// TODO: make this sprintf dependent on NODESPACE!
			if (tree[lvl][i].time < this.henAlgo.eventList.MIN_VALUE*0.5) {
				string += sprintf("%"+this.NODESPACE+"s", "[-]");
			} else if (tree[lvl][i].time > this.henAlgo.eventList.MAX_VALUE*0.5){
				string += sprintf("%"+this.NODESPACE+"s", "[+]");
			} else {
				string += sprintf("%"+this.NODESPACE+"."+this.FLOATSPACE+"f", tree[lvl][i].time);
			}
			
			if (i < noNodes - 1) {
				string += this.getSpaceString(space);
			}
		}
		
		// add half after last
		string += this.getSpaceString(0.5 * space);

		lvlStrings.push(string);
		string = "";
	}

	
	var connStrings = [];
	for (var i = 0; i < tree.length-1; i++) {

		// first create a space string and then replace everything
		connString = this.getSpaceString(width);
		currentString = lvlStrings[i];
		nextString = lvlStrings[i+1];
		var leftSon = 0;
		var rightSon = 0;
		var father = 0;

		// iterate over string and collect indices of the parts
		var splittedCurrentString = currentString.trim().match(/\S+/g) || [];

		// iterate over string and collect indices of the parts
		var splittedNextString = nextString.trim().match(/\S+/g) || [];

		for (var j = 0; j < tree[i].length; j++) {
			
			var father  = splittedCurrentString[j];
			var leftSon = splittedNextString[2*j+0];
			var rightSon = splittedNextString[2*j+1];

			// get left sons index
			idxLeftSon = nextString.indexOf(leftSon);
			nextString = this.replaceAt(nextString, 0, this.getSpaceString(idxLeftSon+this.NODESPACE));
			// get currentNodes index
			idxCurrentNode = currentString.indexOf(father);
			currentString = this.replaceAt(currentString, 0, this.getSpaceString(idxCurrentNode+this.NODESPACE));
			// getright sons index
			idxRightSon = nextString.indexOf(rightSon);
			nextString = this.replaceAt(nextString, 0, this.getSpaceString(idxRightSon+this.NODESPACE));

			connString = this.replaceAt(connString, idxLeftSon, ".");
			connString = this.replaceAt(connString, idxLeftSon+1, this.getSymbolString(idxCurrentNode - idxLeftSon, "-"));
			connString = this.replaceAt(connString, idxCurrentNode, "´`");
			connString = this.replaceAt(connString, idxCurrentNode+2, this.getSymbolString(idxRightSon - idxCurrentNode, "-"));
			connString = this.replaceAt(connString, idxRightSon+1, ".");

		}

		connStrings.push(connString);

	}

	var joinedString = ""
	for(var i = 0; i < lvlStrings.length; i++) {
		joinedString += lvlStrings[i];
		joinedString += "\n";
		if (i < lvlStrings.length-1){

			joinedString += connStrings[i];	
			joinedString += "\n";
		}
	}

	return joinedString;

};

HenAlgorithmOut.prototype.replaceAt = function(string, index, characters) {
    return string.substring(0, index) + characters + string.substring(index+characters.length);
}

HenAlgorithmOut.prototype.getBottomSpaceString = function() {
	return this.getSymbolString(this.BOTTOMSPACE, " ");
};


HenAlgorithmOut.prototype.getSpaceString = function(no) {
	return this.getSymbolString(no, " ");
};


HenAlgorithmOut.prototype.getSymbolString = function(length, symbol) {
	if (length+1 < 1) {
		length = 0;
	}
	return Array(Math.floor(length+1)).join(symbol);
};


function logg (obj){
// console.log(obj);
// debugCon(obj);
}

var debugCnt = 1;
function debugCon (title, obj){
// $('#debugCon').text($('#debugCon').text() + obj);
// $('#debugCon').text($('#debugCon').text() + "<b>");
$('#debugCon').append("<p>"+ (debugCnt++) + ": "  +title +  "</p>");
$('#debugCon').append("<pre>"+obj+ "</pre>");
}
