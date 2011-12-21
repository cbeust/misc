$(document).ready(function() {
//    $('.panel').hide();
    $('a.navigator-link').click(function() {
	var target = $(this).attr('class').split(' ')[1];
	showPanel(target);
    });
    $('a.method').click(function() {
	showMethod($(this).attr('class'));
	return false;
    });
	
});

function showPanel(panelName) {
    $('.panel').hide();
    $('.panel.' + panelName).show();
}

function showMethod(classTags) {
    var c = classTags.split(' ');
    var hashTag = c[1];
    var suiteName = c[2];
    showPanel(suiteName);
    var current = document.location.href;
    var base = current.substring(0, current.indexOf('#'))
    document.location.href = base + '#' + hashTag;
}
