var search = document.getElementById( 'search' );
var clearSearch = document.getElementById( 'clearsearch' );
var results = document.getElementById( 'results' );
var languageSelection = document.getElementById( 'languageselection' );
//
for ( var a = document.getElementsByTagName( 'a' ), i = 0; i < a.length; i++ ) {
	a[i].onclick = function() {
		if ( this.hash.indexOf( '#' ) == 0 ) {
			wm_reveal_for_hash( this.hash );
		}
	}
}
if ( document.location.hash.indexOf( '#' ) == 0 ) {
	wm_reveal_for_hash( document.location.hash );
}
//

function wm_reveal_for_hash( hash ) {
	var targetel = document.getElementById( hash.substr(1) );
	if ( targetel ) {
		for (var p = targetel.parentNode; p && p.className != 'content_block' && p.className != 'section_heading'; ) {
			p = p.parentNode;
		}
		if ( p && p.style.display != 'block' ) {
			var section_idx = parseInt( p.id.split( '_' )[1] );
			wm_toggle_section( section_idx );
		}
	}
}

function wm_toggle_section( section_id ) {
	var b = document.getElementById( 'section_' + section_id ),
		bb = b.getElementsByTagName( 'button' );
	for ( var i = 0; i <= 1; i++ ) {
		var s = bb[i].style;
		s.display = s.display == 'none' || ( i && !s.display ) ? 'inline-block' : 'none';
	}
	for ( var i = 0, d = ['content_']; i<=0; i++ ) {
		var s = document.getElementById( d[i] + section_id ).style;
		s.display = s.display == 'block' ? 'none' : 'block';
	}
}