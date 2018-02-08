const matches=[
    {pat: [2,1,0], pts:1},
    {pat: [1,2,0], pts:-1},
    {pat: [0,1,0], pts:4/2},
    {pat: [0,2,0], pts:-4/2},
    {pat: [2,1,1,0], pts:-60},//these two don't follow a specific pattern
    {pat: [1,2,2,0], pts:12},
    {pat: [0,1,1,0], pts:16/2},
    {pat: [0,2,2,0], pts:-16/2},
    {pat: [2,1,1,1,0], pts:16},
    {pat: [1,2,2,2,0], pts:-16},
    {pat: [2,1,0,1,0], pts:1},
    {pat: [1,2,0,2,0], pts:-1},
    {pat: [0,1,1,1,0], pts:64/2},
    {pat: [0,2,2,2,0], pts:-256/2},
    {pat: [0,1,0,1,0], pts:5},
    {pat: [0,2,0,2,0], pts:-5},
    {pat: [2,1,1,1,1,0], pts:64},
    {pat: [1,2,2,2,2,0], pts:-1000},
    {pat: [2,1,0,1,1,0], pts:16},
    {pat: [1,2,0,2,2,0], pts:-16},
    {pat: [2,1,1,0,1,0], pts:16},
    {pat: [1,2,2,0,2,0], pts:-16},
    {pat: [0,1,1,1,1,0], pts:1028/2},
    {pat: [0,2,2,2,2,0], pts:-4096/2},
    {pat: [0,1,0,1,1,0], pts:64},
    {pat: [0,2,0,2,2,0], pts:-1028},
    {pat: [1,2,2,2,2,0], pts:-4096},
    {pat: [1,1,0,1,1], pts: 5/2},
    {pat: [2,2,0,2,2], pts:-4098/2},
    {pat: [1,1,1,0,1], pts:64},
    {pat: [2,2,2,0,2], pts:-4096},
    {pat: [1,1,1,1,1], pts:200000/2}, //game over override @ 100,000
    {pat: [2,2,2,2,2], pts:-200000/2}
    ];

var matchTree = [[],[],[],0];
for (var i; i<matches.length; i++) {
    var cur_node = matchTree;
    for (var j; j<matches[i].pat.length; j++) {
        //if node doesnt exist, create one
        if(cur_node[matches[i].pat[j]].length>0){
            cur_node[matches[i].pat[j]]=[[],[],[],0];
        }
        cur_node=cur_node[matches[i].pat[j]];
    }
    cur_node[4] = matches[i].pts;
}