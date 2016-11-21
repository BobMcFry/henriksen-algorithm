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
	for (var i = 0; i < this.externalReferences.length; i++) {
		this.externalReferences[i].clearReference();
		this.externalReferences[i] = null
	}

};



// Clears the reference to a particular HenNode. Will be called from outside.
EventNotice.prototype.clearReference = function( henNode ) {
	
	var index = this.externalReferences.indexOf(henNode);
	if (index > -1) {
	    this.externalReferences.splice(index, 1);
	} else {
		console.log("Error: cannot find henNode in external References. This is a big internal error!")
	}

};



EventNotice.prototype.addReference = function( henNode ) {
	this.externalReferences.push(henNode);
};






/* ################### */
/* ~~~~ EVENTLIST ~~~~ */
/* ################### */

var EventList = function() {

	// initialize dummy nodes of Event notices
	this.head = new EventNotice( this.MIN_VALUE );
	this.tail = new EventNotice( this.MAX_VALUE );

	// create references
	this.head.next = this.tail;
	this.tail.prev = this.head;

	this.noOfElements = 0;

};



EventList.prototype.MIN_VALUE = -Number.MAX_VALUE;
EventList.prototype.MAX_VALUE = Number.MAX_VALUE;



EventList.prototype.insertAfter = function( afterThisNode, eventNotice ) {

	// Assertion
	// TODO: Think about same time stuff
	if ( afterThisNode.time > eventNotice.time ) {
		console.log("after:     " + afterThisNode.time);
		console.log("eventTime: " + eventNotice.time);
		console.log(afterThisNode.time+" > "+eventNotice.time);
		console.log(afterThisNode.time > eventNotice.time);
		console.log( "Error: Trying to insert node in wrong order." );
	}

	afterThisNode.next.prev = eventNotice;
	eventNotice.next = afterThisNode.next;
	afterThisNode.next = eventNotice;
	eventNotice.prev = afterThisNode;

	this.noOfElements++;

};



EventList.prototype.next = function() {

	if ( this.isEmpty() ) {
		console.log("Error: List is empty!");
		return null;
	}

	var ret = this.head.next;
	this.head.next = this.head.next.next
	this.head.next.prev = this.head
	
	// for garbaging
	ret.next = null;
	ret.prev = null;

	return ret;

};



EventList.prototype.isEmpty = function( ) {
	return this.noOfElements == 0;
};



EventList.prototype.remove = function() {

	if (this.isEmpty()) {
		console.log("Error: Cannot remove element of an empty list.")
		return null;
	}

	ret = this.head.next;
	this.head.next = ret.next;
	ret.next.prev = this.head;
	this.noOfElements--;

	return ret;

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
	eventNotice.addReference( this );
	this.time = eventNotice.time;

}



// clears only this eventPointer (will be called from outside)
// NOTE regarding the clearing of times: see clearBothReferences note section.
HenNode.prototype.clearReference = function() {

	this.eventPointer = null;

};



// clears both references of HenNode and EventNotice. Will be calles from inside here.
// NOTE: times are not being removed from the tree, as they are necessary for not 
//       being selected in the future. In other words: the algorithm is likely to break 
//       if there are *no* times present.
HenNode.prototype.clearBothReferences = function( ) {

	this.eventPointer.clearReference( this );
	this.eventPointer = null;

};



HenNode.prototype.isLeaf = function( ) {

	return this.leftSon === null || this.rightSon === null;

};



/* ################# */
/* ~~~~ HENTREE ~~~~ */
/* ################# */

var HenTree = function( maxNotice ) {

	this.root = new HenNode(maxNotice);

}



HenTree.prototype.addLayer = function( minNotice, maxNotice ) {
	
	// see below
	// var isFirstSet = false;
	var currentLeafs = this.getLeafs();

	for (var i = 0; i < currentLeafs.length; i++) {
		
		currentNode = currentLeafs[i];

		currentNode.leftSon = new HenNode( minNotice );
		if ( i == currentLeafs.length - 1 ) {
			currentNode.clearBothReferences()
			currentNode.eventPointer = minNotice;
			currentNode.time = currentNode.eventPointer.time;
			currentNode.eventPointer.addReference(currentNode);
			currentNode.rightSon = new HenNode( maxNotice );
		} else {
			currentNode.rightSon = new HenNode( minNotice );
		}

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

	for (var i = 0; i < infix.length; i++) {
		logg(infix[i].time);
	}
	// now reconfigure the lowerNode pointer of the tree
	for ( var i = infix.length - 1; i > 0; i-- ) {
		infix[ i ].lowerNode = infix[ i-1 ];
	}


};



HenTree.prototype.getHeight = function() {
	
	var cnt;
	var currentNode = this.root;
	for (cnt = 1; ! currentNode.isLeaf(); cnt++) {
		currentNode = currentNode.leftSon;
	}

	return cnt;

};



// lvl starts from 0!
HenTree.prototype.getNoNodesOnLvl = function( lvl ) {
	
	return Math.pow(2,lvl);

};



// lvl starts from 0!
HenTree.prototype.getNoNodes = function( ) {
	
	var height = this.getHeight();
	var sum = 0;
	for (var lvl = 0; lvl > height; lvl++) {
		sum += this.getNoNodesOnLvl( lvl );
	}

	return sum;

};



HenTree.prototype.getNodes = function( lvl ) {
	
	// if height is smaller than asked for row print out an error.
	if ( lvl >= this.getHeight() ){
		console.log("Error: depth to high for tree!");
		return null;
	}
	
	var nodes = [];
	var neededNodes = this.getNoNodesOnLvl( lvl );
	var queue = [];
	queue.push( this.root );
	var currentLvl = 0;
	while ( nodes.length != neededNodes ) {

		// get next node from queue
		currentNode = queue.shift();

		// if we reached our final level, pack this node into the return array
		if ( currentLvl == lvl ) {
			nodes.push( currentNode );
		} else { // else add nodes for further processig
			queue.push( currentNode.leftSon );
			queue.push( currentNode.rightSon );	
		}

		// If queue holds as many items of next row then update level
		if (queue.length == this.getNoNodesOnLvl( currentLvl+1 ) ) {
			currentLvl++;
		}

	}

	return nodes;

};



HenTree.prototype.getLeafs = function() {
	
	return this.getNodes( this.getHeight() - 1 );

};

// GLOBAL TODO: if times are equal make it FIFO!!!



/* ###################### */
/* ~~~~ HENALGORITHM ~~~~ */
/* ###################### */

var HenAlgorithm = function() {

	this.eventList = new EventList();
	this.henTree = new HenTree(this.eventList.tail);
	this.currentTime = 0;

}



HenAlgorithm.prototype.MAXSEARCH = 4;



HenAlgorithm.prototype.insert = function( time, data ) {

	if (time < this.currentTime ) {
		console.log(sprintf("Error: cannot enter time < than the current time (=%6.2f).", this.currentTime));
		return null;
	}

	var eventNotice = new EventNotice( time, data );
	var pullResult = null;
	var resultInsert = null;
	var smallestGreaterNode = this.getSmallestGreater( eventNotice.time );

	while (true) {

		if (pullResult === null) {
			resultInsert = this.tryInsert( eventNotice, smallestGreaterNode, this.MAXSEARCH );
		} else {
			resultInsert = this.tryInsert( eventNotice, pullResult, this.MAXSEARCH );
		}

		if ( resultInsert === null ) {

			return eventNotice;

		} else {
			
			// perform pull operation. 
			pullResult = this.pull( smallestGreaterNode, resultInsert );

			if ( pullResult === null ) {

				// add new layer and insert again
				this.henTree.addLayer( this.eventList.head, this.eventList.tail );
				break;

			} 
		}
	}

	// if break out of the loop we added a new layer. Otherwise we will directly return.
	// So with this new layer try to insert again.
	return this.insert( eventNotice.time, eventNotice.data );
	
};



// Removes the most imminent element from the EventList, unless the list is empty. 
// It will return the EventNotice wihtout any in or outgoing references.
HenAlgorithm.prototype.next = function() {

	var ret = this.eventList.remove();

	if ( ret === null ) {

		console.log("Error: Cannot remove element of an empty list.")
		return null;

	}

	ret.clearAllReferences();

	// adapt the time of the data structure
	this.currentTime = ret.time;

	return ret;


};



// performs a pull operation, given a Hennode that has lead to a non failed insert 
// because the maximum search iteration was reached. The toEventNotice is the Eventnotice the lower hennode must point to.
// true will be returned when the pull operation was successful.
// it is not successful when the next lower node is null. In this case false is returned.
HenAlgorithm.prototype.pull = function( originHenNode, toEventNotice ) {
	
	var lowerNode = originHenNode.lowerNode;
	if (lowerNode === null) {
		return null;
	}

	lowerNode.clearBothReferences();
	lowerNode.eventPointer = toEventNotice;
	toEventNotice.addReference( lowerNode );
	lowerNode.time = toEventNotice.time;

	return lowerNode;

};



// returns the HenNode that is the one with a time that is the smallest 
// one yet still greater than the input time. Important to return the
// complete HenNode, since we may need it for finding the lext lower node
// in order to perform a pull operation.
HenAlgorithm.prototype.getSmallestGreater = function( time ) {
	
	var currentNode = this.henTree.root;
	var candidate = null;
	var notFound = true;

	while ( notFound ) {

		if ( currentNode.time <= time ) {
			
			if ( currentNode.isLeaf() ){
				notFound = false;
			} else {
				currentNode = currentNode.rightSon;	
			}
			
		} else {

			if (candidate == null || (candidate.time > currentNode.time && currentNode.time > time)) {
				candidate = currentNode	
			}
			
			// try to approach a more smaller but still greater value compared to time.
			if ( currentNode.isLeaf() ){
				notFound = false;
			} else {
				currentNode = currentNode.leftSon;
			}

		}

	}

	return candidate;

};



// It will try to insert with maxsearch amount of lookups. if successful null will be returned. 
// If not successful the last watched node will be returned in order to perform a pull operation.
HenAlgorithm.prototype.tryInsert = function( what, start, maxSearch ) {

    var currentNotice = start.eventPointer;

    if (start.eventPointer == null) {
    	console.log("Error: Trying to insert event before current time is very likely.")
    }

    // TODO: check if amount of iterations is correct.
    for (var i = 0; i <= maxSearch; i++) {

    	currentNotice = currentNotice.prev;

    	// TODO: Think about same time stuff
    	if (currentNotice.prev === null || currentNotice.time <= what.time) {
    		// so we reached the very first border node (-infty)
    		this.eventList.insertAfter( currentNotice, what )
    		return null;
    	}

    }

    return currentNotice;

};



HenAlgorithm.prototype.toString = function( ) {

	// return debugging visualisation of tree and list
	this.getListOfEventTimes();

};



HenAlgorithm.prototype.getListOfEventTimes = function( ) {
	
	var ary = [];
	ary.push("-");
	var currentNode = this.eventList.head.next;
	while ( currentNode != this.eventList.tail ) {
		ary.push(currentNode.time);
		currentNode = currentNode.next;
	}

	ary.push("+");

	return ary;

};



HenAlgorithm.prototype.isEmpty = function() {
	return this.eventList.isEmpty();
};



HenAlgorithm.prototype.getCurrentTime = function() {
	return this.currentTime;
};


