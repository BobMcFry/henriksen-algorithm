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

	var tree = this.henTreeOut.getTree();
	var list = this.listOut.getList();
	var listString = "";
	var string = "";


	// LIST of notices
	listString += "[-]"
	listString += this.getBottomSpaceString();

	for (var i = 1; i < list.length-1; i++) {
		listString += sprintf("%"+this.NODESPACE+"."+this.FLOATSPACE+"f", list[i].time);
		listString += this.getBottomSpaceString();
	}
	listString += "[+]"


	// TREE
	var height = tree.length;
	var noOfLeafs = tree[height-1].length;
	var treeWidth = listString.length;
	var space;

	for (var lvl = 0; lvl < height; lvl++) {

		space = (treeWidth-(tree[lvl].length * this.NODESPACE)) / (tree[lvl].length);

		// add half before first
		string += this.getSpaceString((1/2) * space);

		// print nodes with complete space between
		for (var i = 0; i < tree[lvl].length; i++) {
			// TODO: make this sprintf dependent on NODESPACE!
			if (tree[lvl][i].time < this.henAlgo.eventList.MIN_VALUE*0.5) {
				string += sprintf("%"+this.NODESPACE+"s", "[-]");
			} else if (tree[lvl][i].time > this.henAlgo.eventList.MAX_VALUE*0.5){
				string += sprintf("%"+this.NODESPACE+"s", "[+]");
			} else {
				string += sprintf("%"+this.NODESPACE+"."+this.FLOATSPACE+"f", tree[lvl][i].time);
			}
			
			if (i < tree[lvl].length-1) {
				string += this.getSpaceString(space);
			}
		}
		
		// add half after last
		string += this.getSpaceString((1/2) * space);

		// add newline
		string += "\n";

	}	

	// between list and tree we need some space my dear.
	string += "\n";

	string += listString;

	return string;

}


HenAlgorithmOut.prototype.getBottomSpaceString = function() {
	return Array(this.BOTTOMSPACE+1).join(" ");
};

HenAlgorithmOut.prototype.getSpaceString = function(no) {
	return Array(Math.floor(no+1)).join(" ");
};

