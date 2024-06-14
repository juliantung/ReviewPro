function generateOutputs() {
    const reviewsInput = document.getElementById('reviews-input').value;
    const reviewLink = document.getElementById('review-link').value;
    const reviewPhotos = document.getElementById('review-photos').files;
    const reviews = reviewsInput.split(/\n\n/);
    const outputContainer = document.getElementById('output-container');
    outputContainer.innerHTML = '';

    const photoUrls = [];

    if (reviewPhotos.length > 0) {
        let loadedImagesCount = 0;

        Array.from(reviewPhotos).forEach((photo, index) => {
            const reader = new FileReader();
            reader.onload = function(e) {
                photoUrls[index] = e.target.result;
                loadedImagesCount++;
                if (loadedImagesCount === reviewPhotos.length) {
                    reviews.forEach((review, index) => {
                        const photoUrl = photoUrls[index] || null;
                        addReviewElement(review, reviewLink, photoUrl, index);
                    });
                    updateStats();
                }
            };
            reader.readAsDataURL(photo);
        });
    } else {
        reviews.forEach((review, index) => {
            addReviewElement(review, reviewLink, null, index);
        });
        updateStats();
    }
}

function addReviewElement(review, link, photoUrl, index) {
    const outputContainer = document.getElementById('output-container');
    const outputDiv = document.createElement('div');
    outputDiv.className = 'output';
    outputDiv.id = `output-${index}`;

    const linkElement = document.createElement('p');
    linkElement.innerHTML = `Click: <a href="${link}" target="_blank">${link}</a>`;
    outputDiv.appendChild(linkElement);

    const reviewElement = document.createElement('p');
    reviewElement.textContent = review;
    outputDiv.appendChild(reviewElement);

    if (photoUrl) {
        const imgElement = document.createElement('img');
        imgElement.src = photoUrl;
        outputDiv.appendChild(imgElement);
    }

    const copyButton = document.createElement('button');
    copyButton.className = 'copy-btn';
    copyButton.textContent = 'Copy';
    copyButton.onclick = () => copyToClipboard(review);
    outputDiv.appendChild(copyButton);

    const doneButton = document.createElement('button');
    doneButton.className = 'done-btn';
    doneButton.textContent = 'Mark as Done';
    doneButton.onclick = () => markAsDone(outputDiv);
    outputDiv.appendChild(doneButton);

    const undoneButton = document.createElement('button');
    undoneButton.className = 'undone-btn';
    undoneButton.textContent = 'Mark as Undone';
    undoneButton.onclick = () => markAsUndone(outputDiv);
    outputDiv.appendChild(undoneButton);

    outputContainer.appendChild(outputDiv);
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        alert('Copied to clipboard!');
    }, () => {
        alert('Failed to copy!');
    });
}

function markAsDone(element) {
    element.classList.add('done');
    updateStats();
}

function markAsUndone(element) {
    element.classList.remove('done');
    updateStats();
}

function updateStats() {
    const totalReviews = document.querySelectorAll('.output').length;
    const doneReviews = document.querySelectorAll('.output.done').length;
    const undoneReviews = totalReviews - doneReviews;

    document.getElementById('total-reviews').textContent = totalReviews;
    document.getElementById('done-count').textContent = doneReviews;
    document.getElementById('undone-count').textContent = undoneReviews;
}

function saveData() {
    const outputs = document.querySelectorAll('.output');
    const data = Array.from(outputs).map(output => {
        const img = output.querySelector('img');
        return {
            link: output.querySelector('a').href,
            review: output.querySelector('p:nth-of-type(2)').textContent,
            photo: img ? img.src : null,
            done: output.classList.contains('done')
        };
    });
    const dataStr = JSON.stringify(data, null, 2);
    const dataOutput = document.getElementById('data-output');
    dataOutput.value = dataStr;
    copyToClipboard(dataStr);
}

function loadData() {
    const dataInput = document.getElementById('data-input').value;
    const outputContainer = document.getElementById('output-container');
    outputContainer.innerHTML = '';

    try {
        const data = JSON.parse(dataInput);
        data.forEach((item, index) => {
            addReviewElement(item.review, item.link, item.photo, index);
            if (item.done) {
                document.getElementById(`output-${index}`).classList.add('done');
            }
        });
        updateStats();
    } catch (error) {
        alert('Invalid data format');
    }
}






