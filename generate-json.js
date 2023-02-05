const fs = require('fs');
const path = require('path');


posts = {
    "posts":[]
};


function flatten(lists) {
    return lists.reduce((a, b) => a.concat(b), []);
}

function getDirectories(srcpath) {

    return fs.readdirSync(srcpath)
        .map(file => path.join(srcpath, file))
.filter(path => fs.statSync(path).isDirectory());
}

function getDirectoriesRecursive(srcpath) {
    return [srcpath, ...flatten(getDirectories(srcpath).map(getDirectoriesRecursive))];
}

console.log(getDirectories("./posts/"));
posts.posts = getDirectories("./posts/");
console.log(JSON.stringify(posts));

fs.writeFileSync('./posts/info.json', JSON.stringify(posts));


/*
{
    "posts": [
        "nixie-clock",
        ""
    ]
}




*/