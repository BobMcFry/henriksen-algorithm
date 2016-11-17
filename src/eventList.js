/* ##################### */
/* ~~~~ EVENTNOTICE ~~~~ */
/* ##################### */

var EventNotice = function( time, data=null ) {

	this.time = time;
	this.data = data;
	this.next = null;
	this.prev = null;
	this.externalReferences = [];

};





/* ################### */
/* ~~~~ EVENTLIST ~~~~ */
/* ################### */

EventList.prototype.MIN_VALUE = Number.MIN_VALUE;
EventList.prototype.MAX_VALUE = Number.MAX_VALUE;


var EventList = function() {

	// initialize dummy nodes of Event notices
	this.head = new EventNotice( this.MIN_VALUE );
	this.tail = new EventNotice( this.MAX_VALUE );

	// create references
	this.head.next = tail;
	this.tail.prev = head;

};

EventList.prototype.tryInsert = function( eventNotice ) {
	
	// TODO: method that goes 4 steps to left from event notice 
	// 		 and calls insertAfter(->ret:null) if OK. If not ok make 
	// 		 pull(not really just return that node. Pull will handle 
	// 		 if new layer of tree is needed) (->ret:eventnotice). 

};

EventList.prototype.insertAfter = function( afterThisNode, eventNotice ) {

	// Assertion
	if ( eventNotice.time <= afterThisNode ) {
		Console.log( "Error: Trying to insert node in wrong order." );
	}

	eventNotice.next   = afterThisNode.next;
	afterThisNode.next = eventNotice;
	eventNotice.prev   = afterThisNode;

};


EventList.prototype.next = function() {

	if ( isEmpty() ) {
		Console.log("Error: Liste ist leer!");
		return null;
	}

	var ret = this.head.next;
	this.head.next = this.head.next.next
	this.head.next.prev = this.head
	return ret;

};

// TODO:
EventList.prototype.isEmpty = function( ) {
	
};




/* ################# */
/* ~~~~ HENNODE ~~~~ */
/* ################# */

var HenNode = function(eventNotice, 
						lowerNode=null,
						leftSon=null, 
						rightSon=null) {

	this.lowerNode = lowerNode;
	this.leftSon = leftSon;
	this.rightSon = rightSon;
	this.eventPointer = eventNotice;
	this.time = eventNotice.time;

}


// TODO: OK? where do i need to call?
HenNode.prototype.clearReference = function() {

	this.eventPointer = null;

};



HenNode.prototype.isLeaf = function() {

	return this.leftSon == null || this.rightSon == null

};



/* ################# */
/* ~~~~ HENTREE ~~~~ */
/* ################# */

var HenTree = function(maxNotice) {

	this.root = new HenNode(maxNotice);

}


// TODO: test
HenTree.prototype.addLayer = function(minNotice, maxNotice) {
	
	var isFirstSet = false;
	var currentLeafs = this.getLeafs();
	for (var i = 0; i < currentLeafs.length; i++) {
		currentNode = currentLeafs[i];
		if ( isFirstSet ) { // regular nodes point to the minNotice
			currentNode.leftSon = new HenNode( minNotice );
		} else { // the very left node points to the max notice
			currentNode.leftSon = new HenNode( maxNotice );
			isFirstSet = true;
		}

		// regular nodes point to the minNotice
		currentNode.rightSon = new HenNode( minNotice );

	}



	// for that purpose create an array with the infix notation of the tree
	var infix = [];

	// 1) Create an empty stack S.
	var stack = [];
	// 2) Initialize current node as root
	var currentNode = this.root;
	var tmpNode;
	while ( true ) {

		// 3) Push the current node to S and set current = current->left until current is NULL
		while ( currentNode != null ) {
			stack.push( currentNode );
			currentNode = currentNode.leftSon;
		}

		// 4) If current is NULL and stack is not empty then 
		if ( currentNode == null && stack.length != 0 ) {
			
			// a) Pop the top item from stack and add it to result
			tmpNode = stack.pop();
			infix.push( tmpNode );

			// b) set current = popped_item->right 
			currentNode = tmpNode.rightSon;

		}
		
		// 5) If current is NULL and stack is empty then we are done.
		if ( currentNode == null && stack.length == 0 ){
			break;
		}
		
	}


	// now reconfigure the nextLowerNode pointer of the tree
	for ( var i = infix.length - 1; i > 0; i-- ) {
		infix[ i ].lowerNode = infix[ i-1 ];
	}


};


// TODO: test this thing
HenTree.prototype.getHeight = function() {
	
	var cnt;
	var currentNode = this.root;
	for (cnt = 1; ! currentNode.isLeaf(); cnt++) {
		currentNode = currentNode.leftSon;
	}

	return cnt;

};

// lvl starts from 0!
// TODO: test
HenTree.prototype.getNoNodes = function( lvl ) {
	
	return Math.pow(2,lvl);

};


// TODO: test
// lvl starts from 0!
HenTree.prototype.getNoNodes = function( ) {
	
	var height = this.getHeight();
	var sum = 0;
	for (var lvl = 0; lvl > height; lvl++) {
		sum += this.getNoNodes( lvl );
	}
	
	return sum

};


// TODO: test
HenTree.prototype.getNodes = function( lvl ) {
	
	// if height is smaller than asked for row print out an error.
	if ( lvl >= getHeight ){
		Console.log("Error: depth to high for tree!");
	}

	var nodes = [];
	var neededNodes = this.getNoNodes( lvl );
	var queue = [];
	queue.push( this.root );
	var currentLvl = -1;
	while ( nodes.length != neededNodes ) {
		
		// If queue holds as many items of next row then update level
		if ( queue.length == this.getNoNodes( lvl ) ) {
			currentLvl++;
		}

		// get next node from queue
		currentNode = queue.shift();

		// if we reached our final level, pack this node into the return array
		if ( currentLvl == lvl ) {
			nodes.push( currentNode );
		} else { // else add nodes for further processig
			queue.push( currentNode.leftSon );
			queue.push( currentNode.rightSon );
		}

	}

	return nodes;

};


HenTree.prototype.getLeafs = function() {
	
	// TODO: test
	return this.getNodes( this.getHeight() - 1 );

};


HenTree.prototype.getSmallestGreater = function( time ) {
	
	// TODO: 
	 

};




/* ###################### */
/* ~~~~ HENALGORITHM ~~~~ */
/* ###################### */

var HenAlgorithm = function() {

	// TODO: create HenTree
	// TODO: create EventList

}

// TODO: make MAXSEARCH variable to 4

HenAlgorithm.prototype.insert = function( eventNotice ) {
	// TODO: assert that time is greater than current!
	// TODO: 
};

HenAlgorithm.prototype.next = function() {
	// TODO: 
};

HenAlgorithm.prototype.pull = function( node ) {
	// TODO: 
};

HenAlgorithm.prototype.getSmallestGreater = function( time ) {
	// TODO: 
};

HenAlgorithm.prototype.linearSearch = function( node, l = MAXSEARCH ) {
	// TODO: 
};

HenAlgorithm.prototype.addLayer = function( ) {
	// TODO: 
};

HenAlgorithm.prototype.toString = function( ) {
	// TODO: return debugging visualisation of tree and list
};

