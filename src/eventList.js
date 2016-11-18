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


// TODO: Does that find the HenNodes? IndexOf?
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

EventList.prototype.MIN_VALUE = Number.MIN_VALUE;
EventList.prototype.MAX_VALUE = Number.MAX_VALUE;

EventList.prototype.insertAfter = function( afterThisNode, eventNotice ) {

	// Assertion
	// TODO: Think about same time stuff
	if ( afterThisNode.time > eventNotice.time ) {
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
		// TODO: think about the console.log output things...maybe find a nicer solution...
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


// TODO: test
HenTree.prototype.addLayer = function( minNotice, maxNotice ) {
	
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

	logg("Added " + (currentLeafs.length*2) + " new nodes to tree.");

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

	logg("See the infix situation:");
	for (var i = 0; i < infix.length; i++) {
		logg(infix[i].time);
	}
	// now reconfigure the lowerNode pointer of the tree
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
HenTree.prototype.getNoNodesOnLvl = function( lvl ) {
	
	return Math.pow(2,lvl);

};


// TODO: test
// TODO: needed?
// lvl starts from 0!
HenTree.prototype.getNoNodes = function( ) {
	
	var height = this.getHeight();
	var sum = 0;
	for (var lvl = 0; lvl > height; lvl++) {
		sum += this.getNoNodesOnLvl( lvl );
	}

	return sum;

};


// TODO: test
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
	var currentLvl = -1;
	while ( nodes.length != neededNodes ) {
		
		// If queue holds as many items of next row then update level
		if ( queue.length == this.getNoNodesOnLvl( lvl ) ) {
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



// GLOBAL TODO: maybe create funciton for setting hennode to certain eventnotice...!?


// GLOBAL TODO: if times are equal make it FIFO!!!

// TODO: actually a simulation cloock needs to be updated inside of HenAlgorithm...but i guess i can just set a switch such that it will also work as fifo simply.

/* ###################### */
/* ~~~~ HENALGORITHM ~~~~ */
/* ###################### */

var HenAlgorithm = function() {

	// create EventList
	this.eventList = new EventList();

	// TODO: create HenTree
	this.henTree = new HenTree(this.eventList.tail);

}

HenAlgorithm.prototype.MAXSEARCH = 4;


HenAlgorithm.prototype.insert = function( time, data ) {

	logg ("Try to insert: time: "+ time + " with data: " + data);

	var eventNotice = new EventNotice( time, data );

	// TODO: assert that time is greater than current! (first...add it later to be able to work as a fifo simply.)
	var smallestGreaterNode = this.getSmallestGreater( eventNotice.time );
	logg ("smallestGreaterNode: " + smallestGreaterNode.time);

	var resultInsert = this.tryInsert( eventNotice, smallestGreaterNode, this.MAXSEARCH );

	if ( resultInsert === null ) {

		logg("Element was inserted without problems.");
		return;

	} else {
		
		logg("Pull operation will be performed.");
		// alert("HALLELUJA");
		// perform pull operation. 
		var pullResult = this.pull( smallestGreaterNode, resultInsert );
		if ( pullResult === null ) {
			logg ("Pull operation failed. Layer will be added.");

			// add new layer and insert again
			this.henTree.addLayer( this.eventList.head, this.eventList.tail );
			logg ("Layer was added.");

			// TODO: is this working? It should only call insert once hereafter.
			this.insert( eventNotice.time, eventNotice.data );

		} else {
			
			logg("Pull operation was successful. EventNotice will now be inserted.")

			// try to insert the eventNotice from the nextLower node now.
			resultInsert = this.tryInsert( eventNotice, pullResult, this.MAXSEARCH );

			// For verification purposes
			if ( resultInsert !== null ) {
				console.log("Error: there is an internal error concerning the pull operation.");
			}
		}

	}
	
};

// Removes the most imminent element from the EventList, unless the list is empty. 
// It will return the EventNotice wihtout any in or outgoing references.
HenAlgorithm.prototype.next = function() {

	var ret = this.eventList.remove();

	if ( ret === null ) {

		// TODO: think about the console.log output things...maybe find a nicer solution...
		console.log("Error: Cannot remove element of an empty list.")
		return null;

	}

	// TODO: maybe put them in HenAlgorithm since they refer to both list and tree...reduce coupling jesuuuss.
	ret.clearAllReferences();

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

// TODO: test...
// returns the HenNode that is the one with a time that is the smallest 
// one yet still greater than the input time. Important to return the
// complete HenNode, since we may need it for finding the lext lower node
// in order to perform a pull operation.
HenAlgorithm.prototype.getSmallestGreater = function( time ) {
	
	var currentNode = this.henTree.root;
	var candidate = null;
	var notFound = true;

	// TODO: think about the situation that eventPointer are null or point to a 
	//       thing that is not in order!! maybe due to deletion before they point 
	//       to the plus infty thing...
	// --> I dont think that this is a realistic thing to happen. But being not
	//     completely sure about that, i will leave that here.
	
	// TODO: think about leq stuff
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

    // TODO: check amount of iterations if it is correct.
    for (var i = 0; i <= maxSearch; i++) {

    	currentNotice = currentNotice.prev;

    	// TODO: Think about same time stuff
    	if (currentNotice.prev === null || currentNotice.time <= what.time) {
    		logg("Found nice spot (time=" + currentNotice.time + ") for insertion after " + (i+1) + " tries.")
    		// so we reached the very first border node (-infty)
    		this.eventList.insertAfter( currentNotice, what )
    		return null;
    	}

    }

    return currentNotice;

};

HenAlgorithm.prototype.toString = function( ) {

	// return debugging visualisation of tree and list
	console.log(this.getListOfEventTimes());

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

