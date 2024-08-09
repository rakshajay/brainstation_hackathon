let clickcounter = 0;

document.getElementById('generate-grid').addEventListener('click', async function () {
    const gridSize = parseInt(document.getElementById('grid-size').value);
    const gridContainer = document.getElementById('grid');

    if (isNaN(gridSize) || gridSize < 1 || gridSize > 10) {
        alert('Please enter a valid number between 2 to 10');
        return;
    }
    let winningIndex = -1;
    const gridItems = [];

    // Clear previous grid
    gridContainer.innerHTML = '';
    gridContainer.style.pointerEvents = 'auto';

    // Set grid template
    gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    gridContainer.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    // Generate grid and set background images
    const setBackgroundPromises = [];
    for (let i = 0; i < gridSize * gridSize; i++) {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        gridItem.innerHTML = `
            <div class="grid-item-inner">
                <div class="grid-item-front"></div>
                <div class="grid-item-back"></div>
            </div>
        `;
        gridItems.push(gridItem);
        gridContainer.appendChild(gridItem);

        // Fetch a random color from the Color API
        try {
            const response = await fetch('https://www.thecolorapi.com/id?format=json&hex=' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0'));
            const data = await response.json();
            gridItem.querySelector('.grid-item-front').style.backgroundColor = data.hex.value;
        } catch (error) {
            console.error('Error fetching color:', error);
        }

        // Add click event listener for flipping
        gridItem.addEventListener('click', function () {
            clickcounter += 1;
            console.log(clickcounter);
            gridItem.classList.toggle('flipped');

            if (gridItems.indexOf(gridItem) === winningIndex) {
                setTimeout(() => {
                    alert("Play Again?");
                    window.location = '.'
                }, 3000);
            }
        });

        // Set background image for the back side
        setBackgroundPromises.push(setBackgroundImage(gridItem.querySelector('.grid-item-back')));
    }

    // Wait for all background images to be set
    await Promise.all(setBackgroundPromises);

    // Randomly select one item to have a different background
    const randomIndex = Math.floor(Math.random() * gridItems.length);
    winningIndex = randomIndex;
    console.log('Setting special background image for item at index:', randomIndex);
    await setSpecialBackgroundImage(gridItems[randomIndex].querySelector('.grid-item-back'));

    const winText = document.createElement('p');
    // winText.className = 'cat-win';

    gridItems[winningIndex].appendChild(winText);
    winText.style.position = 'absolute';
    winText.style.visibility = 'hidden';
    gridItems[winningIndex].addEventListener('click', function () {
        winText.textContent = 'YOU WIN - # of clicks: ' + clickcounter;
        // gridItems[winningIndex].textContent = "YOU WIN";
        winText.style.visibility = 'visible';

        gridContainer.style.pointerEvents = 'none';
        clickcounter = 0;
        // winText.classList.toggle('cat-win');

        gridItems[winningIndex].classList.toggle('cat-win');
    });

});

async function setBackgroundImage(element) {
    try {
        const response = await fetch('https://dog.ceo/api/breeds/image/random');
        const data = await response.json();

        const imageUrl = data.message;
        await preloadImage(imageUrl);
        element.style.backgroundImage = `url(${imageUrl})`;
        element.style.backgroundSize = 'cover';
    } catch (error) {
        console.error('Error fetching image:', error);
    }
}

async function setSpecialBackgroundImage(element) {
    try {
        const response = await fetch('https://api.thecatapi.com/v1/images/search');
        const data = await response.json();

        const imageUrl = data[0].url;
        await preloadImage(imageUrl);
        console.log('Special background image URL:', imageUrl);
        element.style.backgroundImage = `url(${imageUrl})`;
        element.style.backgroundSize = 'cover';
        element.style.border = '5px solid red';
        // gridItems[winningIndex].addEventListener('click', function () {
        //     gridItems[winningIndex].classList.add('cat-win');
        // });

    } catch (error) {
        console.error('Error fetching special image:', error);
    }
}
function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = resolve;
        img.onerror = reject;
    });
}
