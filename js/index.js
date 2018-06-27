
// Variables
let picResults = []; //Pictures
let picSelected = new Map(); // Marked pictures
let ifGallery = false; // if gallery mode"mode"

// flickr Setup for options
let options = { 
	"api_key": "0f02d0059fa490a3c8487414483f8ef1",
	"method": "flickr.photos.search", 
	"sort" : "relevance",
	"format": "json",
	"nojsoncallback": "1",
	"text": "flickr"
}


// show selected pictures
let seeGallery = function() {
	ifGallery = true;
	showPhotos(picSelected);
};

// Request flickr REST API
let makeFlickrRequest = function(options, cb) {
	let url, xhr, item, first;

	url = "https://api.flickr.com/services/rest/";
	first = true;

	for (item in options) {
		if (options.hasOwnProperty(item)) {
			url += (first ? "?" : "&") + item + "=" + options[item];
			first = false;
		}
	}

	xhr = new XMLHttpRequest();
	xhr.onload = function() { cb(this.response); };
	xhr.open('get', url, true);
	xhr.send();

};

// search flickr
let searchFlickr = function(searchText) {
	ifGallery = false;
	options['text'] = searchText;
	makeFlickrRequest(options, function(data) {
		let results = JSON.parse(data);
		//picResults = results.photos.photo;
		picResults = new Map(results.photos.photo.map((i) => [i.id, i])); // convert to hash map
    for (let i=0; i < results.photos.photo.length; i++) {
      console.log(results)
    }
    console.log(results.photos.photo.length);
		showPhotos(picResults);

	});
	return false;
};

// show pictures from JSON flickr data
let showPhotos = function(photosJSON) {
	let container = document.getElementById("img-container");

	// empty image vessel
	while (container.firstChild) {
		container.removeChild(container.firstChild);
	}

	// append pictures for results
	photosJSON.forEach(function(photo) {
		try {
			let img = createImg(photo.farm, photo.server, photo.id, photo.secret, photo.title);
			container.appendChild(img);
		} catch(err) {
			console.log(err.message);
		}
	});

};

// creates and returns an image DOM from flickr variables
let createImg = function(farm_id, server_id, id, secret, title) {

	// picture block
	let imgBlock = document.createElement("div");
	imgBlock.classList.add("img-block");
	imgBlock.setAttribute("id", id);

	imgBlock.addEventListener("click", imgClick, false);


	// q=big square 150x150 and n=small, 320
	let imgSize = (ifGallery) ? 'q' : 'n';


	// picture DOM
	let src_url = "https://farm"+farm_id+".staticflickr.com/"+server_id+"/"+id+"_"+secret+"_"+imgSize+".jpg";
	let img_DOM = document.createElement("img");
	img_DOM.setAttribute("src", src_url);
	img_DOM.setAttribute("alt", title);
	img_DOM.setAttribute("title", title);
	imgBlock.appendChild(img_DOM);

	// if selected add selection
	if (!ifGallery && picSelected.has(id)) {
		imgBlock.classList.add('selected');
	}

	// picture title DOM
	let imgBlockTitle = document.createElement("div");
	imgBlockTitle.classList.add("img-block-title");

	let title_text = document.createTextNode(title);
	imgBlockTitle.appendChild(title_text);
	imgBlock.appendChild(imgBlockTitle);

	return imgBlock;
};

// picture click
let imgClick = function(element) {
	if(ifGallery) {
		zoomImg(element);
	} else {
		toggleSelect(element);
	}
};

// toggle picture
let toggleSelect = function(element) {
	let selectedImgBlock = element.target.parentElement;
	let imgID = selectedImgBlock.id;


	// if in in array
	if (picSelected.has(imgID)) {
		picSelected.delete(imgID);
		selectedImgBlock.classList.remove('selected');
	} else {
		picSelected.set(imgID,picResults.get(imgID));
		selectedImgBlock.classList.add('selected');
	}
	
};

// picture full size
let zoomImg = function(element) {
	let modal = document.getElementById('imgModal');
	let modalImg = document.getElementById("displayImg");
	let modalCaption = document.getElementById("caption");

	modal.style.display = "block";
	let selectedImgBlock = element.target.parentElement;
	let selectedImg = picSelected.get(selectedImgBlock.id);

	let img_url = "https://farm"+selectedImg.farm+".staticflickr.com/"+selectedImg.server+"/"+selectedImg.id+"_"+selectedImg.secret+".jpg";
	modalImg.src = img_url;
	modalCaption.innerHTML = element.target.title;
};


// Stick footer / header
window.onscroll = function() {myFunction()};

let header = document.getElementById("myHeader");
let sticky = header.offsetTop;

function myFunction() {
  if (window.pageYOffset > sticky) {
    header.classList.add("sticky");
  } else {
    header.classList.remove("sticky");
  }
}
