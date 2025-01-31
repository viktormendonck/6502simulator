var sim;

document.addEventListener('DOMContentLoaded', function () {
	// Initialize the widget
	document.querySelectorAll('.widget').forEach(function(widget) {
	  sim = SimulatorWidget(widget);
	});
});





document.addEventListener('DOMContentLoaded', function () {
	// Function to create a clickable button element
	function createClickableItem(text, code) {
		const button = document.createElement('button');
		button.classList.add('clickable-item');
		button.textContent = text;
		button.addEventListener('click', () => {
			var textarea = document.querySelector('.code');
			textarea.value = code;
			sim.ui.initialize();
		});
		return button;
	}

	// Function to create a subchapter section
	function createSubchapter(subchapterData) {
		const subchapter = document.createElement('div');
		subchapter.classList.add('subchapter');

		const header = document.createElement('div');
		header.classList.add('subchapter-header');
		header.textContent = subchapterData.title;

		const content = document.createElement('div');
		content.classList.add('subchapter-content');

		subchapterData.content.forEach(item => {
			if (item.type === 'element') {
				const clickableItem = createClickableItem(item.text, item.code); // Pass the code field
				content.appendChild(clickableItem);
			} else if (item.type === 'subchapter') {
				const nestedSubchapter = createSubchapter(item);
				content.appendChild(nestedSubchapter);
			}
		});

		subchapter.appendChild(header);
		subchapter.appendChild(content);

		header.addEventListener('click', () => {
			subchapter.classList.toggle('active');
			const isVisible = subchapter.classList.contains('active');
			content.style.display = isVisible ? 'block' : 'none';
		});

		return subchapter;
	}

	// Function to create a chapter section
	function createChapter(chapterData) {
		const chapter = document.createElement('div');
		chapter.classList.add('chapter');

		const header = document.createElement('div');
		header.classList.add('chapter-header');

		const title = document.createElement('span');
		title.textContent = chapterData.title;

		// Expand/Collapse buttons using symbols
		const expandButton = document.createElement('span');
		expandButton.textContent = '+';
		expandButton.classList.add('expand-collapse-btn');
		expandButton.addEventListener('click', (event) => {
			event.stopPropagation();
			content.querySelectorAll('.subchapter').forEach(sub => {
				sub.classList.add('active');
				sub.querySelector('.subchapter-content').style.display = 'block';
			});
		});

		const collapseButton = document.createElement('span');
		collapseButton.textContent = '-';
		collapseButton.classList.add('expand-collapse-btn');
		collapseButton.addEventListener('click', (event) => {
			event.stopPropagation();
			content.querySelectorAll('.subchapter').forEach(sub => {
				sub.classList.remove('active');
				sub.querySelector('.subchapter-content').style.display = 'none';
			});
		});

		const buttonsWrapper = document.createElement('span');
		buttonsWrapper.classList.add('expand-collapse-wrapper');
		buttonsWrapper.appendChild(expandButton);
		buttonsWrapper.appendChild(collapseButton);

		header.appendChild(title);
		header.appendChild(buttonsWrapper);

		const content = document.createElement('div');
		content.classList.add('chapter-content');

		chapterData.content.forEach(item => {
			if (item.type === 'element') {
				const clickableItem = createClickableItem(item.text, item.code); // Pass the code field
				content.appendChild(clickableItem);
			} else if (item.type === 'subchapter') {
				const subchapter = createSubchapter(item);
				content.appendChild(subchapter);
			}
		});

		chapter.appendChild(header);
		chapter.appendChild(content);

		header.addEventListener('click', () => {
			chapter.classList.toggle('active');
			const isVisible = chapter.classList.contains('active');
			content.style.display = isVisible ? 'block' : 'none';
		});

		if (chapterData.isFirst) {
			chapter.classList.add('active');
			content.style.display = 'block';
		} else {
			content.style.display = 'none';
		}

		return chapter;
	}

	// Fetch the JSON data and create chapters
	fetch('chapters.json')
		.then(response => response.json())
		.then(data => {
			const chaptersContainer = document.getElementById('chapters-container');

			data.forEach((chapterData, index) => {
				chapterData.isFirst = index === 0;
				const chapter = createChapter(chapterData);
				chaptersContainer.appendChild(chapter);
			});
		})
		.catch(error => {
			console.error('Error loading chapter data:', error);
		});
});
