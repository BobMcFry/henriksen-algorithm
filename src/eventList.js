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

// clears all references to and from(!) other nodes and notices. Will be called from inside here.
EventNotice.prototype.clearAllReferences = function( ) {
	
	// clear references for garbage purposes
	ret.next = null;
	ret.prev = null;
	for (var i = 0; i <= this.externalReferences.length; i++) {
		this.externalReferences[i].clearReference();
		this.externalReferences[i] = null
	}

};


// TODO: Does that find the HenNodes? IndexOf?
// Clears the reference to a particular HenNode. Will be called from outside.
EventNotice.prototype.clearReference = function( henNode ) {
	
	var index = this.externalReferences.indexOf(henNode);
	if (index > -1) {
	    array.splice(index, 1);
	} else {
		Console.log("Error: cannot find henNode in external References. This is a big internal error!")
	}

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

	this.noOfElements = 0;

};

// It will try to insert with maxsearch amount of lookups. if successful null will be returned. 
// If not successful the last watched node will be returned in order to perform a pull operation.
EventList.prototype.tryInsert = function( what, start, maxSearch ) {
    
    var currentNotice = start.prev;

    // TODO: check amount of iterations if it is correct.
    for (var i = 0; i <= maxSearch; i++) {

    	// TODO: Think about same time stuff
    	if (currentNotice === null || currentNotice.time <= what.time) {
    		// so we reached the very first border node (-infty)
    		insertAfter (currentNotice, what)
    		return null;
    	}

	    currentNotice = currentNotice.prev;

    }

    return currentNode;

};

EventList.prototype.insertAfter = function( afterThisNode, eventNotice ) {

	// Assertion
	// TODO: Think about same time stuff
	if ( eventNotice.time <= afterThisNode ) {
		Console.log( "Error: Trying to insert node in wrong order." );
	}

	eventNotice.next   = afterThisNode.next;
	afterThisNode.next = eventNotice;
	eventNotice.prev   = afterThisNode;
	this.noOfElements++;

};


EventList.prototype.next = function() {

	if ( this.isEmpty() ) {
		Console.log("Error: List is empty!");
		return null;
	}

	var ret = this.head.next;
	this.head.next = this.head.next.next
	this.head.next.prev = this.head
	return ret;

};


EventList.prototype.isEmpty = function( ) {
	return this.noOfElements == 0;
};


// Removes the most imminent element from the EventList, unless the list is empty. 
// It will return the EventNotice wihtout any in or outgoing references.
EventList.prototype.remove = function( ) {
	if (this.isEmpty()) {
		Console.log("Error: Cannot remove element of an empty list.")
	}
	ret = this.head.next;
	this.head.next = ret.next;
	reat.next.prev = this.head;

	ret.clearAllReferences();

	return ret

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

// clears only this eventPointer (will be called from outside)
HenNode.prototype.clearReference = function() {

	this.eventPointer = null;

};

// clears both references of HenNode and EventNotice. Will be calles from inside here.
HenNode.prototype.clearBothReferences = function() {

	this.eventPointer.clearReference( this );
	this.eventPointer = null;

};



HenNode.prototype.isLeaf = function() {

	return this.leftSon === null || this.rightSon === null

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
		while ( currentNode !== null ) {
			stack.push( currentNode );
			currentNode = currentNode.leftSon;
		}

		// 4) If current is NULL and stack is not empty then 
		if ( currentNode === null && stack.length != 0 ) {
			
			// a) Pop the top item from stack and add it to result
			tmpNode = stack.pop();
			infix.push( tmpNode );

			// b) set current = popped_item->right 
			currentNode = tmpNode.rightSon;

		}
		
		// 5) If current is NULL and stack is empty then we are done.
		if ( currentNode === null && stack.length == 0 ){
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
	// TODO: create MAXSEARCH CONST here

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

