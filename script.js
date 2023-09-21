lastSearch = "";






function loadPost() {
    console.log("eee");
}


function tagsearch(tag) {
    filterTag = "<div class=\"btn btn-sm btn-outline-secondary\" onclick=\"tagsearch('" + tag + "')\">" + tag + "</div>";
    if (lastSearch == tag) {
        document.getElementById("filterinfo").innerHTML = "Filter: ";
        var divsToHide = document.getElementsByClassName("col"); //divsToHide is an array
        for (var i = 0; i < divsToHide.length; i++) {
            divsToHide[i].style.visibility = "visible"; // or
            divsToHide[i].style.display = ""; // depending on what you're doing
        }
        lastSearch = "";
        return;
    }

    lastSearch = tag;
    document.getElementById("filterinfo").innerHTML = "Filter: " + filterTag;
    var divsToHide = document.getElementsByClassName("col"); //divsToHide is an array
    var divsToShow = document.getElementsByClassName(tag);
    for (var i = 0; i < divsToHide.length; i++) {
        divsToHide[i].style.visibility = "hidden"; // or
        divsToHide[i].style.display = "none"; // depending on what you're doing
    }
    for (var i = 0; i < divsToShow.length; i++) {
        divsToShow[i].style.visibility = "visible"; // or
        divsToShow[i].style.display = ""; // depending on what you're doing 
    }
}

function sortPosts() {
    var vs = document.getElementsByClassName('post-card');
    var divs = [];
    for (var i = 0; i < vs.length; ++i) {
        divs.push(vs[i]);
    }
    divs.sort(function (a, b) {
        return b.getAttribute("data-date").localeCompare(a.getAttribute("data-date"));
    });
    var tHTML = "";
    for (i in divs) {
        var d = divs[i];
        document.getElementById('posts').appendChild(d);
    }

}

function loadPosts() {
    var json;
    // document.getElementById("")
    fetch("./posts/info.json")
        .then((response) => {
            if (!response.ok) {
                throw new Error(`HTTP error, status = ${response.status}`);
            }
            return response.json();
        })

        .then((data) => {
            buildPortfolio(data);
        })

        .catch((error) => {
            console.log(`Error: ${error.message}`);
        });



}



function buildPortfolio(data) {
    //console.log(data.posts.length);
    //
    for (post in data.posts) {
        path = data.posts[post];
        console.log(path);
        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;
        ready = false;

        xhr.addEventListener("readystatechange", async function () {
            if (this.readyState === 4) {
                var postJson = await JSON.parse(this.responseText);
                console.log(JSON.stringify(postJson));
                buildPost(postJson);
            }
        });

        xhr.open("GET", path + "/info.json");

        xhr.send();

        // while(!ready);
    }
}

function buildPost(postJson) {
    postContainer = document.getElementById("posts");
    console.log(postJson.title);
    container = document.createElement("div");
    container.className = "card border-0 " + postJson.tags.join(" ");
    outerDiv = document.createElement("div");



    outerDiv.className = ("col");
    outerDiv.classList.add("post-card");
    outer = document.createElement("a");
    outer.setAttribute("href", "#0");
    if (postJson.content) {
        outer.setAttribute("href", postJson.path);
    }

    if (typeof postJson.img === 'string' || postJson.img instanceof String) {
        img = document.createElement("img");
        img.src = "./" + postJson.path + "/img/" + postJson.img;
        console.log(img.src)
        img.className = "bd-placeholder-img card-img-top";
        img.setAttribute("width", "100%");
        img.setAttribute("height", "225");
        img.setAttribute("style", "object-fit: cover; background: transparent;")
        container.appendChild(img);
    } else if (postJson.img) {
        img = document.createElement("img");
        img.src = "./" + postJson.path + "/img/header.jpg";
        console.log(img.src)
        img.className = "bd-placeholder-img card-img-top";
        img.setAttribute("width", "100%");
        img.setAttribute("height", "225");
        img.setAttribute("style", "object-fit: cover; background: transparent;")
        container.appendChild(img);
    }
    body = document.createElement("div");
    body.classList.add("card-body");
    title = document.createElement("h5")
    title.classList.add("card-title");
    textNode = document.createTextNode(postJson.title);
    title.appendChild(textNode);
    body.appendChild(title);
    desc = document.createElement("p");
    desc.classList.add("card-text");
    textNode = document.createTextNode(postJson.desc);
    desc.appendChild(textNode);
    body.appendChild(desc);
    lowerContainer = document.createElement("div");
    lowerContainer.className = "d-flex justify-content-between align-items-center";
    tags = document.createElement("div");
    emptyA = document.createElement("a");
    emptyA.setAttribute("href", "#0");
    tags.appendChild(emptyA);
    tags.className = "tags-group";
    for (tagId in postJson.tags) {
        outerDiv.classList.add(postJson.tags[tagId]);
        text = document.createTextNode(postJson.tags[tagId]);
        tag = document.createElement("div");
        tag.className = "btn btn-sm btn-outline-secondary my-1 mx-1";
        tag.setAttribute("onclick", "tagsearch(\"" + postJson.tags[tagId] + "\")");
        tag.appendChild(text);
        emptyA.appendChild(tag);
    }
    lowerContainer.appendChild(tags);
    date = document.createElement("small");
    date.className = "text-teal mx-1";
    textNode = document.createTextNode(postJson.date);
    outerDiv.setAttribute("data-date", Date.parse(new Date(postJson.date)));
    date.appendChild(textNode);
    lowerContainer.appendChild(date);
    body.appendChild(lowerContainer);
    container.appendChild(body);
    outer.appendChild(container);
    outerDiv.appendChild(outer);
    postContainer.appendChild(outerDiv);
    // ready = true;
    sortPosts();
}
