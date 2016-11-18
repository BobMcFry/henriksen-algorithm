/* ##################### */
/* ~~~~ HENTREE_OUT ~~~~ */
/* ##################### */

//    4
//  2   6
// 1 3 5 7


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
	console.log(nodes);
	return nodes;

};


/* ################## */
/* ~~~~ LIST_OUT ~~~~ */
/* ################## */

// . O O O O O O O O O O O O O O O O O O O O O O O O O O O O .

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

HenAlgorithmOut.prototype.NODESPACE = 5;
HenAlgorithmOut.prototype.BOTTOMSPACE = 3;


HenAlgorithmOut.prototype.notify = function() {
	// TODO: this function is used when the model changes, observer and so on.
};

HenAlgorithmOut.prototype.getStringRepresentation = function() {

	var tree = this.henTreeOut.getTree();
	var list = this.listOut.getList();
	var string = "";

	// TREE
	var height = tree.length;
	var noOfLeafs = tree[height-1].length;
	var treeWidth = noOfLeafs * this.NODESPACE + (noOfLeafs - 1) * this.BOTTOMSPACE;
	// console.log(noOfLeafs);
	var space;

	for (var lvl = 0; lvl < height; lvl++) {

		// calculate space between nodes
		// space = treeWidth - (tree[lvl].length * this.NODESPACE);
		// space /= (tree[lvl].length+1);
		space = (treeWidth-(tree[lvl].length * this.NODESPACE)) / (tree[lvl].length);

		// add half before first
		string += this.getSpaceString((1/2) * space);
		// string += this.getSpaceString(space);

		// print nodes with complete space between
		for (var i = 0; i < tree[lvl].length; i++) {
			// TODO: make this sprintf dependent on NODESPACE!
			if (tree[lvl][i].time < Number.MIN_VALUE*1.5) {
				string += sprintf("%5s", "[-]");
			} else if (tree[lvl][i].time > Number.MAX_VALUE*0.5){
				string += sprintf("%5s", "[+]");
			} else {
				string += sprintf("%5.1f", tree[lvl][i].time);
			}
			
			if (i < tree[lvl].length-1) {
				// string += this.getSpaceString(space);
				string += this.getSpaceString(space);
			}
		}
		
		// add half after last
		string += this.getSpaceString((1/2) * space);
		// string += this.getSpaceString(space);

		// add newline
		string += "\n";

	}	

	// between list and tree we need some space my dear.
	string += "\n\n\n";


	// TODO: make length of bottom space depending on width at the bottom of tree.
	// LIST of notices
	string += "[-]"
	string += this.getBottomSpaceString();

	for (var i = 1; i < list.length-1; i++) {
		string += sprintf("%5.2f", list[i].time);
		string += this.getBottomSpaceString();
	}
	string += "[+]"

	return string;

}


HenAlgorithmOut.prototype.getBottomSpaceString = function() {
	return Array(this.BOTTOMSPACE+1).join(" ");
};

HenAlgorithmOut.prototype.getSpaceString = function(no) {
	return Array(Math.floor(no+1)).join(" ");
};

