var cy = cytoscape({
  container: document.getElementById('cy'),

  boxSelectionEnabled: false,
  autounselectify: true,

  style: cytoscape.stylesheet()
    .selector('node')
    .style({
      'content': 'data(id)',
      'background-color': 'black'
    })
    .selector('edge')
    .style({
      'content':'data(weight)',
      'weight-color': 'green',
      'curve-style': 'bezier',
      'width': 4,
      'line-color': 'red',
      'target-arrow-color': 'red'
    })
    .selector('.visited')
        .style({
          'background-color': 'blue',
          'line-color': 'yellow',
          'target-arrow-color': 'blue',
          'transition-property': 'background-color, line-color, target-arrow-color',
          'transition-duration': '0.5s'
    }),

    elements: {
      nodes: [
        { data: { id: 'a' } },
        { data: { id: 'b' } },
        { data: { id: 'c' } },
        { data: { id: 'd' } },
        { data: { id: 'e' } }
      ],
      edges: [
        { data: { id: 'ae', weight: 1, source: 'a', target: 'e' } },
        { data: { id: 'ab', weight: 3, source: 'a', target: 'b' } },
        { data: { id: 'be', weight: 4, source: 'b', target: 'e' } },
        { data: { id: 'bc', weight: 5, source: 'b', target: 'c' } },
        { data: { id: 'ca', weight: 6, source: 'c', target: 'a' } },
        { data: { id: 'cd', weight: 2, source: 'c', target: 'd' } },
        { data: { id: 'de', weight: 7, source: 'd', target: 'e' } }
      ]
    },


  layout: {
    name: 'random',
    roots: '#a',
    rows: 2

  }
});

out=[]
function bfs(){
  var v = document.getElementById('v').value;
  console.log(v);
  var v = cy.getElementById(v);
  var visited=[];
  for (let i = 0; i < cy.nodes().length; i++) 
    visited[i]=false;
  var queue=[];
  visited[v.id()]=true;
  queue.push(v);
  out.push(v);
  console.log(out);
  while(queue.length>0){
    var ver=queue.shift();
    var neigh =ver.neighbourhood('node');
      neigh.forEach(neighbour => {
          if(!visited[neighbour.id()]){
            visited[neighbour.id()]=true;
            out.push(neighbour.edgesWith(ver));
            out.push(neighbour);
            queue.push(neighbour);
            console.log(out);
          }
      });
  }
  bfsRun();
}
var bfsItr=0;
function bfsRun(){
    if( bfsItr < out.length ){
      out[bfsItr].addClass('visited');
      out[bfsItr].addClass('leaving');
      bfsItr++;
      setTimeout(bfsRun, 1000);
    }
  };



  function dfs() {
    var v = document.getElementById('v').value;
  console.log(v);
  
    var visited =[];
    for(var i=0;i<cy.nodes().length;i++){
      visited[i]=false;
    }
    var ver = cy.getElementById(v);
        dfsA(ver,visited)
        rundfs() ;
  }

  function dfsA(ver,visited) {
    visited[ver.id()] = true; 
	out.push(ver);
	var neigh =  ver.neighbourhood('node');
	neigh.forEach(neighbour => {
		if (!visited[neighbour.id()]) {
      out.push(neighbour.edgesWith(ver));
      out.push(neighbour);
      console.log(out);
      dfsA(neighbour, visited); 
      
		}	
  });
  }
  var dfsitr=0;
  function rundfs(){
    if(dfsitr<out.length){
      out[dfsitr].addClass('visited');
      out[dfsitr].addClass('leaving');
      dfsitr++;
      setTimeout(rundfs,600);
    }
  }
  const MAX = 100005;
  id=[];
  mstout=[];
  nodemap=[];
  sortedw=[]
  function mst(){
      for(var i=0;i<MAX;i++)
        id[i]=i;
    var i=0;
    cy.nodes().forEach(node =>{
      nodemap[node.id()]=i;
      i++;
    });
    sortedw=cy.edges().sort(function(a,b){
      return a.data('weight')-b.data('weight');
    });
  }
  function root(x)
{
    while(id[x] != x)
    {
        id[x] = id[id[x]];
        x = id[x];
    }
    return x;
}
function union(x,y)
{
    var p = root(x);
    var q = root(y);
    id[p] = id[q];
}
function kruskal()
{
    var x, y;
    sortedw.forEach(edge => {
        x = nodemap[edge.data('source')];
        y = nodemap[edge.data('target')];
        cost = edge.data('weight');
        if(root(x) != root(y))
        {
            mstout.push(edge);
            union(x, y);
        } 
    });
}

var mstItr = 0;
function runmst(){
    if( mstItr < mstout.length ){
      mstout[mstItr]._private.source.addClass('visited');
      mstout[mstItr].addClass('visited');
      mstout[mstItr]._private.target.addClass('visited');
      mstItr++;
      setTimeout(runmst, 1000);
    }
  };

  function runmstx(){
    mst();
    kruskal();
    runmst();
  }
  function addNodes(){
    clear();
    console.log(document.getElementById('cy').offsetLeft);  
    var noOfNodes = document.getElementById('node-no').value;
    
    for(var i=0; i< noOfNodes ;i++){
        var div=document.getElementById('cy');
        var min=200; 
        var max=300;  
        var randomy = Math.floor(Math.random() * (+max - +min)) + +min; 
        min=200; 
        max=500;  
        var randomx = Math.floor(Math.random() * (+max - +min)) + +min; 
      cy.add({
        group: 'nodes',
        data: { id:  i},
        position: { x:randomx , y: randomy }
      });
    }
  }
  function Generate(){
    var x=document.getElementById('source').value;
    var y=document.getElementById('destination').value;
    var weightE = document.getElementById('weight');
    if(weightE.value=='' ||x.value=='' ||y.value=='' )
      return;
      console.log("asldkfj");
    cy.add({
      group:'edges',
      data:{
            id: x+y ,
            weight:weightE.value ,
            source:x,
            target:y
          }
    });
  
   
  }

  function clear(){
    cy.elements().remove();
  }
