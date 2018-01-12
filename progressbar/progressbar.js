var live_data = "";	
	function progressupdate(btn, limit){
	
		var e = document.getElementById("selectprogess"); 
		var selectedprogess = e.options[e.selectedIndex].value;	
		
		var oldval = document.getElementById("percent-"+selectedprogess).innerHTML;
		oldval = oldval.slice(0, - 1);
		
		btn = parseInt(btn,0) + parseInt(oldval,0);
		if (btn >= limit){
			document.getElementById(selectedprogess).style="background-color: red;width:"+btn+"%; visibility: visible;transition: width 0.25s";
			document.getElementById("percent-"+selectedprogess).innerHTML = btn+"%";		
		} else if (btn > 0 ){		
			document.getElementById(selectedprogess).style="width:"+btn+"%; visibility: visible;transition: width 0.25s";
			document.getElementById("percent-"+selectedprogess).innerHTML = btn+"%";		
		} else {
			document.getElementById(selectedprogess).style="width:0%;visibility: hidden;";
			document.getElementById("percent-"+selectedprogess).innerHTML = "0%";
		}
	}
	
	function processresponse(json_input){
		if (typeof json_input == "object"){
			live_data = json_input;			
		} else {
			live_data = JSON.parse(json_input);
		}
		
		var btnselector = "";
		for (var i = 0; i < live_data.buttons.length; i++) {
			btnselector = btnselector + "<button class='btncontrols' onclick='progressupdate("+live_data.buttons[i]+","+100+")' value='"+live_data.buttons[i]+"'>"+ live_data.buttons[i] +"</button>";
		}
		
		document.getElementById("btnctrls").innerHTML = btnselector;
		
		var barselector = "<select id='selectprogess'>";
		var progressUI = "";
		
		
		for (var j = 0; j < live_data.bars.length; j++){
			var counter = j + 1;
			barselector = barselector+ "<option value='progress"+counter+"'>#progress"+ counter +"</option>";
			progressUI = progressUI + "<div class='prog-border'><div id='progress"+counter+"' class='prog-container prog-gray' style='width:"+ live_data.bars[j]+"%'></div><div class='percent' title='"+live_data.limit+"' id='percent-progress"+counter+"'>"+live_data.bars[j]+"%</div></div>";
		}
		barselector = barselector + "</select>";
		
		document.getElementById("barctrls").innerHTML = barselector;
		document.getElementById("prog").innerHTML = progressUI;
	}
	function loadJSON(path, success, error)	{
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function()
		{
			if (xhr.readyState === XMLHttpRequest.DONE) {
				if (xhr.status === 200) {
					if (success)
						success(JSON.parse(xhr.responseText));
				} else {
					if (error)
						error(xhr);
				}
			}
		};
		xhr.open("GET", path, true);
		xhr.send();
	}
	loadJSON('http://pb-api.herokuapp.com/bars',
         function(data) { 
		 console.log(data);
			processresponse(data); 			
		 },
         function(data) { 	//302 OK
			console.log(data.response);
			processresponse(data.response); 
			
		 }
	);	