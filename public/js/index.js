var urlInput = document.getElementById("input-url");
var shortUrlInput = document.getElementById('short-url');
var successCard = document.getElementById('success-output');
var errorCard = document.getElementById('error-output');
var focusInput = true;

document.getElementById("form-input-url").addEventListener('submit', (e) => {
	e.preventDefault();
	let APIUrl = window.location.href + "new";
	let url = urlInput.value;
	let data = {'url': url};

	fetch(APIUrl, {
		method: 'POST',
		body: JSON.stringify(data),
		headers: {
			'Content-Type': 'application/json'
		}
	}).then( (response) => {
		if (response.ok) {
			focusInput = true;
			response.json().then((data) => {
				if (data.error) {
					errorCard.classList.add('card-show');
			  	errorCard.classList.remove('card-hide');
			  	focusInput = true;
				} else {
					shortUrlInput.innerText = window.location.href + data.short_url;
					successCard.classList.add('card-show');
					successCard.classList.remove('card-hide');
				}
			});
		} else {
      throw Error( `Request rejected with status ${res.status}` );		
		}
	}).catch(error => console.log(error));
});

urlInput.addEventListener("input", (e) => {
	if (focusInput) {
		focusInput = false;
		errorCard.classList.add('card-hide');
  	errorCard.classList.remove('card-show');
  	successCard.classList.add('card-hide');
  	successCard.classList.remove('card-show');
	}
});

shortUrlInput.addEventListener('click', (e) => {
	// Thanks https://stackoverflow.com/a/48020189!
	let range = document.createRange();
	range.selectNode(shortUrlInput);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(range);
	document.execCommand("copy");
});
