//META{"name":"lineemotes"}*//

function lineemotes() {}

lineemotes.emotesCustom = {};

lineemotes.prototype.loadDependecies = function () {
	Array.prototype.swap = function (x,y) {
		var b = this[x];
		this[x] = this[y];
		this[y] = b;
		return this;
	}	
}

lineemotes.prototype.load = function () {
	//Called when plugin is loaded
	console.log("[" + this.getName() + "] Loading");
	this.loadDependecies();
    quickEmoteMenu.lsContainer = lineemotes.prototype.formContainer();
	
	//extending emoji menu, appending extra button on menu open
	QuickEmoteMenu.prototype.obsCallback = function(e) {
    if (!settingsCookie["bda-es-9"]) {
        e.addClass("bda-qme-hidden");
    } else {
        e.removeClass("bda-qme-hidden");
    }
    if (!settingsCookie["bda-es-0"])
        return;
    var self = this;
    e.prepend(this.qmeHeader);
	$('#bda-qem').append('<button id="bda-qem-line" onclick="quickEmoteMenu.switchHandler(this); return false;" class="active">Line</button>');
    e.append(this.teContainer);
    e.append(this.faContainer);
	e.append(this.lsContainer);
	
	//making categories scroll horizontally
	$('#categories-wrapper').bind('mousewheel', function(event) {
	if ((event.originalEvent.wheelDelta || event.originalEvent.detail) > 0)
			this.scrollLeft -= 30;
		else
			this.scrollLeft += 30;
	
		return false;
	})
	
	$('#line-appendpack').click(function() {
		title = $('#pack-title').val()
		packid = parseInt($('#pack-packid').val(), 10);
		stickerid = parseInt($('#pack-stickerid').val(), 10);
		base = $('#pack-baseprefix').val();
		length = $('#pack-length').val();

		if (title != '' && Number.isInteger(packid) && Number.isInteger(stickerid)) {
			if (lineemotes.appendPack(title, packid, stickerid, base, length)) {
				$('#line-appendpack').css('background-color', 'rgb(87, 169, 87)');
				$('#line-appendpack').text('Success');
				setTimeout(function(){ 
					$('#line-appendpack').css('background-color', '');
					$('#line-appendpack').text('Append');
				}, 1500);
			}
		} else {
			$('#line-appendpack').css('background-color', 'rgb(179, 33, 33)');
			$('#line-appendpack').text('Error');
			setTimeout(function(){ 
				$('#line-appendpack').css('background-color', '');
				$('#line-appendpack').text('Append');
			}, 1500);
			console.log('Error while parsing the values, title is empty or numbers are not numbers');
		}
	})
	
	$('#line-deletepack').click(function() {
		//if only one selection is left, return
		if ($("#line-deletepack-selector option").length == 1) {
			$('#line-deletepack').css('background-color', 'rgb(179, 33, 33)');
			$('#line-deletepack').text('Error');
			setTimeout(function(){ 
				$('#line-deletepack').css('background-color', '');
				$('#line-deletepack').text('Delete');
			}, 1500);
			return false
		}
		selection = $("#line-deletepack-selector").val();
		selection = parseInt(selection, 10);
		//if SOMEHOW removing an option for selector was unsuccessful
		if (!$("#line-deletepack-selector option[value=" + selection + "]").remove().length) {
			$('#line-deletepack').css('background-color', 'rgb(179, 33, 33)');
			$('#line-deletepack').text('Error');
			setTimeout(function(){ 
				$('#line-deletepack').css('background-color', '');
				$('#line-deletepack').text('Delete');
			}, 1500);
			return false
		} else {
			//sync the two selectors below
			$("#line-swappack-selector option[value=" + selection + "]").remove();
			$("#line-withpack-selector option[value=" + selection + "]").remove();
		}
		if (!lineemotes.deletePackByID(selection)) {
			$('#line-deletepack').css('background-color', 'rgb(179, 33, 33)');
			$('#line-deletepack').text('Error');
			setTimeout(function(){ 
				$('#line-deletepack').css('background-color', '');
				$('#line-deletepack').text('Delete');
			}, 1500);
			return false
		} else { 
			$('#line-deletepack').css('background-color', 'rgb(87, 169, 87)');
			$('#line-deletepack').text('Success');
			setTimeout(function(){ 
				$('#line-deletepack').css('background-color', '');
				$('#line-deletepack').text('Delete');
			}, 1500);
			return true 
		}
	}); //done extending emoji menu
	
	$('#line-swappack').click(function() {
		if (($("#line-swappack-selector option").length == 1) || ($("#line-withpack-selector option").length == 1)) {
			$('#line-swappack').css('background-color', 'rgb(179, 33, 33)');
			$('#line-swappack').text('Error');
			setTimeout(function(){ 
				$('#line-swappack').css('background-color', '');
				$('#line-swappack').text('Swap');
			}, 1500);
			return false
		}
		
		from_selection = parseInt($("#line-swappack-selector").val(), 10);
		to_selection   = parseInt($("#line-withpack-selector").val(), 10);
		
	
		//attempting a swap
		if (!lineemotes.swapPacksByIDs(from_selection, to_selection)) {
			//if attempt failed
			$('#line-swappack').css('background-color', 'rgb(179, 33, 33)');
			$('#line-swappack').text('Error');
			setTimeout(function(){ //revert the button
				$('#line-swappack').css('background-color', '');
				$('#line-swappack').text('Swap');
			}, 1500);
			return false
		} else { 
			//if attempt was successful
			$('#line-swappack').css('background-color', 'rgb(87, 169, 87)');
			$('#line-swappack').text('Success');
			setTimeout(function(){ //revert the button
				$('#line-swappack').css('background-color', '');
				$('#line-swappack').text('Swap');
			}, 1500);
			return true 
		}
	});
	
	
    if (this.lastTab == undefined) {
        this.lastTab = "bda-qem-favourite";
    }
	
    this.switchQem(this.lastTab);
	
	

	}
	
	//when in rome do as the romans do
	QuickEmoteMenu.prototype.switchQem = function(id) {
		var twitch = $("#bda-qem-twitch");
		var fav = $("#bda-qem-favourite");
		var emojis = $("#bda-qem-emojis");
		var line = $("#bda-qem-line");
		twitch.removeClass("active");
		fav.removeClass("active");
		emojis.removeClass("active");
		line.removeClass("active");
		$(".emoji-picker").hide();
		$("#bda-qem-favourite-container").hide();
		$("#bda-qem-twitch-container").hide();
		$("#bda-qem-line-container").hide();
		//lineemotes.hidePreview();	

		switch (id) {
		case "bda-qem-twitch":
			twitch.addClass("active");
			$('#bda-qem-line .bd-customicon-settings').remove()
			$("#bda-qem-twitch-container").show();
			break;
		case "bda-qem-favourite":
			fav.addClass("active");
			$('#bda-qem-line .bd-customicon-settings').remove()
			$("#bda-qem-favourite-container").show();
			break;
		case "bda-qem-emojis":
			emojis.addClass("active");
			$('#bda-qem-line .bd-customicon-settings').remove()
			$(".emoji-picker").show();
		
			break;
		case "bda-qem-line":
			line.addClass("active");
			//$('#bda-qem-line-container .settings').hide();
			$("#bda-qem-line-container").show();
			
			if ($('#bda-qem-line .bd-customicon-settings').length == 0) { //add a setting icon if there isn't one
				$('#bda-qem-line').prepend('<span><button class="bd-customicon-settings">⚙</button></span>');
				$('#bda-qem-line .bd-customicon-settings').click(function() {
					$('#bda-qem-line-container .settings').toggle();
				});
			};
			
		}
		this.lastTab = id;
		var emoteIcon = $(".emote-icon");
		emoteIcon.off();
		emoteIcon.on("click", function() {
			var emote = $(this).attr("title");
			var ta = $(".channel-textarea-inner textarea");
			ta.val(ta.val().slice(-1) == " " ? ta.val() + emote : ta.val() + " " + emote);
		});
		
		$('#preview-sticker').off('click');
		
		//attaching events to stickers
		$('#bda-qem-line-container .scroller img').mouseenter(function(e) { lineemotes.previewSticker(e.target.src); })
		                                          .mouseleave(function(e) { lineemotes.hidePreview(); });
												 
	}
    console.log("[" + this.getName() + "] Done loading");
};
lineemotes.prototype.unload = function () {
    //Called when plugin is unloaded
};
lineemotes.prototype.start = function () {
    console.log("[" + this.getName() + "] Start");
};
lineemotes.prototype.stop = function () {
    console.log("[" + this.getName() + "] Stop");
};

lineemotes.prototype.getName = function () {
    return "Line Stickers";
};
lineemotes.prototype.getDescription = function () {
    return "Extends emote menu to add Line stickers.";
};
lineemotes.prototype.getVersion = function () {
    return "0.5.3";
};
lineemotes.prototype.getAuthor = function () {
    return "Awakening";
};
lineemotes.prototype.getSettingsPanel = function () {
    return '';
};

lineemotes.reformContainer = function () {
	quickEmoteMenu.lsContainer = lineemotes.prototype.formContainer();
}

lineemotes.prototype.formContainer = function() {
	var lsContainer = "";
	var stickers;
	if (localStorage["bdlinestickers"]) { stickers = JSON.parse(atob(localStorage["bdlinestickers"])); }
	
	//inline styling
    lsContainer += "<style>"
	lsContainer += this.getStickersContainer()[1]
	lsContainer += this.getSettingContainer()[1];
	lsContainer += this.getCategoriesContainer()[1];
	lsContainer += this.getPreviewContainer()[1];
	lsContainer += "</style>";
	
	lsContainer += "<div id=\"bda-qem-line-container\">";	
	lsContainer += this.getStickersContainer(stickers)[0]
	lsContainer += this.getCategoriesContainer(stickers)[0]
	lsContainer += this.getSettingContainer(stickers)[0];
	lsContainer += this.getPreviewContainer()[0];
    lsContainer += "<\/div>";
	return lsContainer
}

lineemotes.prototype.getStickersContainer = function (stickers) {
	styling = ''
	container = ''
	
	styling += "#bda-qem-line-container { width: 455px; height: 327px; background-color: #353535; }"
	styling += "#bda-qem-line-container .emote-menu-inner { padding: 5px 15px 0 15px; }"
	styling += "#bda-qem-line-container .scroller-wrap {height:100%;}"
	styling += "#bda-qem-line-container .scroller { padding-bottom:44px; }"
	styling += ".bda-dark #bda-qem-line-container .scroller::-webkit-scrollbar, .bda-dark #bda-qem-line-container .scroller::-webkit-scrollbar-track, .bda-dark #bda-qem-line-container .scroller::-webkit-scrollbar-track-piece, .bda-dark #pubs-container .scroller::-webkit-scrollbar, .bda-dark #pubs-container .scroller::-webkit-scrollbar-track, .bda-dark #pubs-container .scroller::-webkit-scrollbar-track-piece {background-color: #303030!important; border-color: #303030!important;}"
	styling += ".bda-dark #bda-qem-line-container .scroller::-webkit-scrollbar-thumb {border-color: #202020!important; background-color: #202020!important;}"
	styling += "#bda-qem-line-container div div div div.emote-container {width: 75px; height: 75px;}" 
	styling += "#bda-qem-line-container .category-header { color: #98aab6; font-size: 12px; font-weight: 800; line-height: 32px; text-transform: uppercase; }"
	
	container += "    <div class=\"scroller-wrap fade\">";
    container += "        <div class=\"scroller\">";
    container += "            <div class=\"emote-menu-inner\" id=\"line-emote-container\" >";
	
	if (stickers) {
		for (var i = 0; i < stickers.length; i++) {
			var base_url = stickers[i].base + '<packid>/android/stickers/<stickerid>.png'
			container += "            <div class=\"category ll-toload\">"
			container += "                <div class=\"category-header\">" + stickers[i].title + "</div>"
			for (var j = 0; j < stickers[i].stickers.length; j++) {
				sticker = base_url.replace('<packid>', stickers[i].id.toString())
								.replace('<stickerid>', stickers[i].stickers[j].toString());
				container += "            <div class=\"emote-container\">";
				//container += "                <img class=\"emote-icon lazy\" src=data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw== data-original=\"" + sticker + "\" title=\"" + sticker + "\"></img>";
				container += "                <img class=\"emote-icon\" src=\"" + sticker + "\" title=\"" + sticker + "\"></img>";
				container += "            </div>";
			}
			container += "            </div>"
		}
	}

    container += "            <\/div>";
    container += "        <\/div>";
    container += "    <\/div>";
	return [container, styling]
}

lineemotes.prototype.getSettingContainer = function (stickers) {
	styling = ''
	container = ''
	pack_list = ''
	
	styling += "#bda-qem-line .bd-customicon-settings { background: none !important; border: none !important; box-shadow: none !important; }"
	styling += "#bda-qem-line-container .settings { position: absolute; top: 31px; background-color: rgba(53, 53, 53, 0.95); width: 100%; height: 327px; }"
	styling += "#bda-qem-line-container .settings .settings-item { display: inline; width: 50%; padding-left: 14px; padding-right: 14px; padding-top: 5px;}"
	styling += "#bda-qem-line-container .settings label { font-size: 11px; font-weight: 700; text-transform: uppercase; color: #87909c; display: block; }"
    styling += "#bda-qem-line-container .settings input  { font-size: 15px; font-weight: 400; background-color: rgba(53,53,53,0); color: #ffffff; border: none; outline: 0; border-bottom: 1px solid #656565; margin-bottom: 1px; width: 100%; resize: none; }"
    styling += "#bda-qem-line-container .settings .btn { width: 100px; padding: 5px 20px; font-size: 16px; line-height: 16px; font-weight: 600; transition: background-color .2s ease; position: relative; cursor: pointer; margin-top: 5px; }"
	styling += "#bda-qem-line-container .settings .btn-primary { border-radius: 3px; background-color: #7289da; color: #fff; }"
	styling += "#bda-qem-line-container .settings select { width: 100%; }"
	
	if (stickers) {
		for (var i = 0; i < stickers.length; i++) {
			pack_list += "<option value='"+stickers[i].id+"'>"+stickers[i].title+"</option>"
		}
		
		container += "    <div class='settings' style='display: none;'>"
		container += "        <div class='settings-item'>"
		container += '            <div class="category-header">Append a sticker pack</div><label for="pack-title">Title</label><input type="text" id="pack-title"><label for="pack-packid">Pack ID</label><input type="text" id="pack-packid"><label for="pack-stickerid">First Sticker ID</label><input type="text" id="pack-stickerid"><label for="pack-stickerid">Base Prefix</label><input type="text" id="pack-baseprefix"><label for="pack-stickerid">Length</label><input type="text" id="pack-length"><button class="btn btn-primary" id="line-appendpack">Append</button>'
		container += "        </div>"
		container += "        <div class='settings-item'>"
		container += "            <div style='margin-bottom: 15px;'>"
		container += "                <div class='category-header'>Delete pack</div>"
		container += "                <select id='line-deletepack-selector'>"
		container += pack_list;
	
		container += "                </select>"
		container += "                <button class='btn btn-primary' id='line-deletepack'>Delete</button>"
		container += "            </div>"
		container += "            <div>"
		container += "                <div class='category-header'>Swap positions</div>"
		container += "                <label style='margin-bottom: 5px;'>Swap</label>"
		container += "                <select id='line-swappack-selector'>"
		container += pack_list;
	
		container += "                </select>"
		container += "                <label style='margin-top: 5px; margin-bottom: 5px;'>with</label>"
		container += "                <select id='line-withpack-selector'>"
		container += pack_list;
		container += "                </select>"
		container += "                <button class='btn btn-primary' id='line-swappack'>Swap</button>"
		container += "            </div>"
		container += "        </div>"
		container += "    </div>"
	}
	return [container, styling]
}

lineemotes.prototype.getPreviewContainer = function () {
	styling = "#preview-sticker { opacity: 0; }"
	styling += "#preview-sticker-wrapper { position: absolute; height: 358px; width: 256px; transform: translateX(-256px) translateY(-358px) translateZ(0px); background: #353535; box-shadow: -10px 0px 80px 0px rgba(0, 0, 0, 0.2); border-top-left-radius: 3px; border-bottom-left-radius: 3px; transition: all .15s cubic-bezier(0.4, 0, 0.2, 1) .15s; background-size: contain; }"
	
	container  = "<div class=\"preview\">"
	container +=     "<div id=\"preview-sticker-wrapper\" style=\"background-position: center; visibility: hidden; opacity: 0; background-size: contain;\"></div>"
	container += "</div>"
	
	return [container, styling]
}

lineemotes.prototype.getCategoriesContainer = function (stickers) {
	styling   = '';
	container = '';
	
	styling += "#bda-qem-line-container .categories { overflow: hidden; position: absolute; bottom: 0; z-index: 1; width: 441px; background-color: #353535; height: 44px; border-top: 1px solid rgba(0,0,0,.1); margin-top: -44px; }"
	styling += "#bda-qem-line-container .categories .item:hover { -webkit-filter: grayscale(0%) !important; }"
	styling += "#bda-qem-line-container .categories .item { display: inline-block; -webkit-filter: grayscale(100%); box-sizing: border-box; width: 28px; height: 44px; background-position: center; background-repeat: no-repeat; background-size: 32px 32px; border-bottom: 3px solid transparent; transition: border-bottom-color .1s ease-in-out; margin-right: 4px; cursor: pointer; margin-left: 2.5px; }"
	
	if (stickers) {
		container += "<div class='categories'>"
		container +=     "<div id='categories-wrapper' style='white-space: nowrap; overflow-x: scroll; overflow-y: hidden;'>";
	
		container +=         "<div class='item' onclick=\"$('#bda-qem-line-container .category')[0].scrollIntoView()\" style='background-image: url(" + stickers[0].base + stickers[0].id.toString() + "/LINEStorePC/main.png); margin-left: 15px; '></div>"
		for (var i = 1; i < stickers.length; i++) {
			container +=     "<div class='item' onclick=\"$('#bda-qem-line-container .category')[" + i + "].scrollIntoView()\" style='background-image: url(" + stickers[i].base + stickers[i].id.toString() + "/LINEStorePC/main.png)'></div>"
		}
		container +=     "</div>"
		container += "</div>"
	}
	
	return [container, styling]
}

lineemotes.previewSticker = function (url) {
	$('#preview-sticker-wrapper').css('visibility', 'visible');
	$('#preview-sticker-wrapper').css('opacity', '1');
	$('#preview-sticker-wrapper').css('background', 'url("'+ url +'") rgb(53, 53, 53) no-repeat center');
	
	$('#preview-sticker-wrapper').css('background-image', 'url(' + url + ')');
}

lineemotes.hidePreview = function () {
	$('#preview-sticker-wrapper').css('visibility', 'hidden');
	$('#preview-sticker-wrapper').css('opacity', '0');
}

lineemotes.getStickers = function (title, packid, stickerid, base, length) {
	base = typeof base !== 'undefined' ? base : 'https://sdl-stickershop.line.naver.jp/products/0/0/1/';
	length = typeof base !== 'undefined' ? length : 40;
	
	try { 
		if (parseInt(base, 10)) {base = 'https://sdl-stickershop.line.naver.jp/products/0/0/' + base + '/'; }
		else if (base == '') { base = 'https://sdl-stickershop.line.naver.jp/products/0/0/1/'; }
	} catch(e) {}
	
	if (Number.isInteger(base)) { base = 'https://sdl-stickershop.line.naver.jp/products/0/0/' + base.toString() + '/'; }
	else if (base.slice(-1) != '/') { base += '/'; }
	
	if (length == '') { length = 40; }
	else if (!parseInt(length, 10)) { length = 40; }
	output = {};
	output['title'] = title;
	output['id'] = packid;
	output['base'] = base;
	output['stickers'] = [];
	for (var i = 0; i < length; i++) {
		//sticker = base.replace('<packid>', packid).replace('<stickerid>', (stickerid + i).toString());
		//output.stickers.push(sticker);
		output.stickers.push(stickerid + i);
	}
	return output
};

lineemotes.backup = function() {
	localStorage["bdlinestickers_backup"] = localStorage["bdlinestickers"];
	return true
}

lineemotes.restoreBackup = function() {
	localStorage["bdlinestickers"] = localStorage["bdlinestickers_backup"];
	return true
}

lineemotes.appendPack = function (title, packid, stickerid, base, length) {
	base = typeof base !== 'undefined' ? base : 'https://sdl-stickershop.line.naver.jp/products/0/0/1/';
	length = typeof base !== 'undefined' ? length : 40;

	packid = parseInt(packid, 10);
	stickerid = parseInt(stickerid, 10);
	stickers = lineemotes.getStickers(title, packid, stickerid, base, length);
	try {
		storage = JSON.parse(atob(localStorage["bdlinestickers"]));
	} catch(err) {
		console.log('Erorr while parsing local storage, is it empty?');
		storage = []
	}
	storage.push(stickers);
	lineemotes.backup();
	localStorage["bdlinestickers"] = btoa(JSON.stringify(storage));
	console.log('Done');
	console.log('Reforming container');
	lineemotes.reformContainer();
	return true;
}

lineemotes.deletePack = function (position) {
	try {
		storage = JSON.parse(atob(localStorage["bdlinestickers"]));
	} catch(err) {
		console.log('Erorr while parsing local storage, is it empty? Aborting');
		return false
	}
	storage.splice(position, 1);
	console.log('Saving');
	lineemotes.backup();
	localStorage["bdlinestickers"] = btoa(JSON.stringify(storage));
	lineemotes.reformContainer();
}

lineemotes.deletePackByID = function (id) {
	try {
		storage = JSON.parse(atob(localStorage["bdlinestickers"]));
	} catch(err) {
		console.log('Erorr while parsing local storage, is it empty? Aborting');
		return false
	}
	for (var i = 0; i < storage.length; i++) {
		if (storage[i].id == id) {
			storage.splice(i, 1);
			break;
		}
	}
	console.log('Saving');
	lineemotes.backup();
	localStorage["bdlinestickers"] = btoa(JSON.stringify(storage));
	lineemotes.reformContainer();
	return true
}

lineemotes.swapPacks = function (from_position, to_position) {
	try {
		storage = JSON.parse(atob(localStorage["bdlinestickers"]));
	} catch(err) {
		console.log('Erorr while parsing local storage, is it empty? Aborting');
		return false
	}
	this.backup();
	storage.swap(from_position, to_position);
	console.log('Saving');
	localStorage["bdlinestickers"] = btoa(JSON.stringify(storage));
	this.reformContainer();
	return true
}

lineemotes.swapPacksByIDs = function (from_id, to_id) {
	try {
		storage = JSON.parse(atob(localStorage["bdlinestickers"]));
	} catch(err) {
		console.log('Erorr while parsing local storage, is it empty? Aborting');
		return false
	}
	
	from_position = 0;
	to_position = 0;
	for (var i = 0; i < storage.length; i++) {
		if (storage[i].id == from_id) from_position = i;
		if (storage[i].id == to_id) to_position = i;
	}
	if ((from_position != 0) && (to_position != 0)) {
		this.swapPacks(from_position, to_position);
	}
	delete from_position;
	delete to_position;
	return true;
}

lineemotes.prototype.observer = function (mutation) {
    for (var i = 0; i < mutation.addedNodes.length; ++i) {
        var next = mutation.addedNodes.item(i);
        if (next) {
            var nodes = lineemotes.prototype.getNodes(next);
            for (var node in nodes) {
                if (nodes.hasOwnProperty(node)) {
                    var elem = nodes[node].parentElement;
					
                    if (elem && elem.classList.contains('edited')) { lineemotes.inject(elem); }
                    else { lineemotes.inject(nodes[node]); }
					
                    if (elem && elem.tagName == "TEXTAREA" && elem.style.display == "none") {
                    	elem.style.display = "";
                    }
                }
            }
        }
    }
};
lineemotes.prototype.getNodes = function (node) {
    var next;
    var nodes = [];
    var treeWalker = document.createTreeWalker(node, NodeFilter.SHOW_TEXT, null, false);
    while (next = treeWalker.nextNode()) {
        nodes.push(next);
    }
    return nodes;
};
lineemotes.inject = function (node) {
	if ((node.textContent.match(/sdl-stickershop.line.naver.jp/g)||[]).length < 1) return
	$(node).parent()[0].style.display = "none";
};