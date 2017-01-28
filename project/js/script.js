$(document).ready(function(){
	
	// btnShort call back
	$("#btnShort").click(function(){
		if($(this).find('span').html() == 'ENCURTAR'){
			var txtURL = $('#txtURL');
			var span = $(this).find('span');
			//get url from input text
			var url = txtURL.val();

			//verify if input is not empy and if it is a valid link
			if(txtURL.val() == "" || txtURL.val().match(/^(http:\/\/)?(w{3})?\w+(\.\w+)+$/) == null) {
				alert('Please, insert a valid link to short');
				return ;
			}

			//animation
			span.fadeOut('slow', function(){
				txtURL.css({'color':'#FFF', 'transition': 'color 1s' });
				var btnClose = $('#btnClose').toggle(true).hide();
				var btnShort = span.html('COPIAR');
				searchData(url); 
				btnShort.add(btnClose).fadeIn('slow');
			
			}).add(txtURL.css(
			{'color': 'rgba(255,255,255, 0)','font-weight':'bold',
			'transition':'color 500, font-weight 700'}));
			txtURL.prop('disabled', true);
		}
		else {
			//enable
			$('#txtURL').prop('disabled', false);
			//raw js
			var elem = document.getElementById("txtURL");
			elem.focus();
			elem.setSelectionRange(0, elem.value.length);
			
			var succed;
			try{
				succed = document.execCommand("copy");
			}
			catch(e){
				console.log(e);
			}

			//disable
			$('#txtURL').prop('disabled', true);
			$(this).focus();
		}
	});
	
	//btnClose call back
	$('#btnClose').click(function (){
		var txtURL = $('#txtURL');
		var btnShort = $('#btnShort').find('span');
		
		//animation 
		$(this).add(btnShort).fadeOut('slow', function(){
			txtURL.css({'color':'#EA611F', 'transition': 'color 1s' });
			$('#btnShort')
				.find('span').html('ENCURTAR').fadeIn('slow')
				.add(txtURL.val('').prop('disabled', false));
		
		}).add(txtURL.css(
		{'color': 'rgba(255,255,255, 0)','font-weight':'normal',
		'transition':'color 500, font-weight 700'}));
		
	});

	getPreviewData();
});

//function that load initial data
getPreviewData = function(){
	/* function used to compare data*/
	compare = function (a,b){
		if (a.hits > b.hits)
			return -1;
		if (a.hits < b.hits)
			return 1
		return 0;
	}

	/*get top 5 and count Hits from json data*/
	$.getJSON('../../Assets/urls.json', function(arrJsonData, statJson, xhr){
		if (statJson == 'success'){
			sArray = arrJsonData.sort(compare);
			var chits = 0; 
			for(var i = 0; i < 5; i++){
				//create content string
				var rowContent = '<div class="row">';
			
				var contentURL = '<div class="' + (i < 4 ? 
				'cellURL">' : 'cellLastURL">')
				+ sArray[i]['shortUrl'] +
				"</div>";
				
				var contentHits = '<div class="' + (i < 4 ? 
					'cellHits">' : 'cellLastHits">')
				+ formatNumber(sArray[i]['hits']) +
				"</div>";
				
				//concat rowContent, contentURL, contentHits and </div> to close 
				//div row
				rowContent = rowContent.concat(contentURL).
				concat(contentHits).concat("</div>");
				$(".table").append(rowContent);
				chits += sArray[i]['hits'];
			}
		
			//continue interating over array only for get countHits
			for (var i = 5; i < sArray.length; i++){
				chits += sArray[i]['hits'];
			}
			//print number 
			$("#showHits").html(formatNumber(chits));
		}	
		else 
			console.log('Something is wrong !');
	});
};

//formating number, putting a dot between digits. ex: 1203 -> 1.203
formatNumber = function (number){
	var tmp = "" + number;
	var strFormatted = "";
	var i;
	for (i = tmp.length - 1; i >= 0;i-=3){
		if (i-2 < 0){
			break;
			console.log('enter');
		}
		var hundred = tmp.charAt(i-2) + tmp.charAt(i - 1) + tmp.charAt(i); 
		strFormatted = (i - 2 == 0 ? "": ".")  + hundred + strFormatted;
		
	}
	strFormatted = tmp.substr(0,i + 1) + strFormatted;
	return strFormatted;
};

//function that retrieves a link if it exists. If not, a default link is returned.
searchData = function(url){
	//compare by url
	compare = function(a,b){
		return a['url'].localeCompare(b['url']);
	}
	
	var shortUrl = "";
	//get JSON data and  search by binary search
	$.getJSON('../../Assets/urls.json', function(arrJsonData, statJson, xhr){
		if (statJson == 'success'){
			sortedArray = arrJsonData.sort(compare);
			var begin = 0, end = sortedArray.length;
			//console.log(sortedArray);
			//binary search
			while (begin <= end){
				var mid = Math.floor((begin + end)/2);
				if (sortedArray[mid]['url'].localeCompare(url) < 0)
					begin = mid + 1;
				else if (sortedArray[mid]['url'].localeCompare(url) > 0)
					end = mid - 1;
				else {
					shortUrl = sortedArray[mid]['shortUrl'];
					break;
				}
			}
			if(shortUrl == "")
				shortUrl = "http://chr.dc/yuiyui";
		
			console.log(shortUrl);
			$('#txtURL').val(shortUrl);
		}
		else 
			console.log('Something is wrong !');
	});
	
};
