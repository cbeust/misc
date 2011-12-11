// A simple HTML "table of contents" generator.
//
// 1) Include toc.js in your HTML file:
//          <script type="text/javascript" src="toc.js"></script>
//
// 2) Call generateToc() in your onLoad() method:
//           <body onLoad="generateToc();">
//
// 3) Declare a div with the id "table-of-contents" where you want your table of contents:
//           <div id="table-of-contents"></div>
//
// 4) Put each of your sections in an <a> tag with class "section", specifying an "indent"
// representing the indentation of that section. Only the length of the indent matters, now
// its content. If no indent is found, a string of size 1 is the default.
//
// Example:
// <a class="section" name="Section 1">Section 1</a>
// <a class="section" indent=".." name="Section 1a">Section 1a</a>
// <a class="section" name="Section 2">Section 2</a>
//
// Author: Cedric Beust <cedric@beust.com>, December 10th, 2011

function countersToHeading(counters) {
    var result = "";
    for ( var i = 0; i < counters.length; i++) {
        if (i > 0) {
            result = result + ".";
        }
        result = result + counters[i];
    }
    return result;
}

function indentSection(count) {
    var result = "";
    for ( var i = 0; i < count; i++) {
        result += "&nbsp;&nbsp;";
    }
    return result;
}

function rewriteSection(section, counters) {
    var result = "";
    result = result + countersToHeading(counters) + " - " + section.innerHTML;
    return result;
}

function getAttribute(obj, attribute, def) {
	var result = obj.attributes[attribue];
	return result ? result.nodeValue : def;
}

function generateToc() {
    var sections = document.getElementsByTagName("a");

    var toc = "";
    var counters = new Array();
    for (i = 0; i < sections.length; i++) {
        var section = sections[i];
        if (section.className == "section") {
            var name = getAttribute(section, "name", i);
            var indent = getAttribute(section, "indent", ".");
            var currentCounter = 0;
            var ind = indent.length;

            if (ind < counters.length) {
            	// Unindenting (6.2.3 -> 7.1)
                var p = ind;
                while (p++ <= counters.length) {
                    counters.pop();
                }
            }

            if (counters[ind - 1]) {
            	// Incrementing an existing counter (3.2 -> 3.3)
                var n = counters.pop();
                counters.push(n + 1);
            } else {
            	// New counter (2 -> 2.1)
                counters.push(1);
            }

            toc = toc + indentSection(ind)
                    + '<a class="table-of-contents" href=#' + name + '>'
                    + rewriteSection(section, counters) + "</a><br>";
            section.innerHTML = rewriteSection(section, counters);
        }
    }

    var tocId = "table-of-contents";
    var tocTag = document.getElementById(tocId);

    if (tocTag) {
        tocTag.innerHTML = toc;
    } else {
        alert("Couldn't find an id " + tocId);
    }

}
