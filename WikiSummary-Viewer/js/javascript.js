function appear_input_box() {
	$('document').ready(function(){

			$('center').html('<span id="search_box"> <input type="text" title="press enter" value=""class="form-control" placeholder="Enter Query" onkeydown="get_value(this)" style="border:none;background-color:#fc6464;"></span>').animate({opacity:'1'},1000);
			$('#search_box').animate({width:'400px'},1000);

		});

}

function get_value(temp) {
	var val;

	if (event.keyCode == 13) {
		val = temp.value;

		get_heading_raw(val);
		//console.log (val);	
		temp.value = "";
		
		
	}

}


function get_heading_raw (val) {

		//******************JSONP*******************
		(function($) {
			var url = "https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch="+encodeURIComponent(val);

			$.ajax({
			    type: 'GET',
				url: url,
				async: false,
				contentType: "application/json",
				dataType: 'jsonp',
				success:function(json){
				
					//console.log(json);
					get_ids(json);

				}
			});
		})(jQuery);


}


var summary ={};
function get_ids (result){
	if (result == undefined || result.query == undefined) {
		alert("Wrong Input");
		$(document).ready(function() {
			$('#main').text(" ");
		});

		return;
	}
	var content={}
	
	var pages = result.query.pages;
	//console.log(pages);


	for (x in pages){
		content[pages[x]["title"]] = pages[x].extract;
	}

	console.log(content);
	get_summary(content,summary);

	suggestion (content,summary);

}

//****************object with heading ---->>>>> extract done*************

function get_summary(content,summary) {

	for (x in content) {
		//console.log(x);
		extract_data(x,summary);
	}

	console.log(summary);
}

//********* geting summary by heading done*************
function extract_data(x,summary) {
	(function($){
		var url;
		url = "https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro=&explaintext=&titles=" + encodeURIComponent(x);

		$.ajax({
			type: 'GET',
			url: url,
			async:false,
			dataType: 'jsonp',
			contentType:'application/jsonp',
			success:function(json){
				var temp = json.query.pages;
				for (y in temp){
					//console.log(temp[y].extract);
					summary[x] = temp[y].extract;
					//console.log(x);
				}
				//console.log(summary);

			}

		});
	})(jQuery);
}


//https://en.wikipedia.org/w/api.php?format=jsonfm&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=iit
//https://en.wikipedia.org/w/api.php?format=jsonfm&action=query&prop=extracts&exintro=&explaintext=&titles=Stack%20Overflow



//suggestion function 

function suggestion(content) {
	$(document).ready(function() {
		$('center').css({marginTop:'2%'})
		$('#main').text(" ");

		for (x in content) {
			$('#main').append("<div class='well' style='margin-top:2%;'><h3 style='cursor:pointer' onclick='display(this)'>" + x +"</h3><p>" + content[x] + "</p></div>");
		}
	});
}

function display(val){
	console.log(val.innerHTML);
	if (typeof(Storage) !== "undefined") {

		window.sessionStorage['heading'] = val.innerHTML;
		window.sessionStorage['sum'] = summary[val.innerHTML];
	}
	

	window.open("main_content.html");	
}