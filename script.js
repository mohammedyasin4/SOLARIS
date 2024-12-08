
var planets;

let focusedPlanet = null;

let planetsColors = [
    'yellow', // SOl
    '#8b8983',
    '#e6cbca',
    '#418ed5',
    '#eb5c5d',
    '#e29468',
    '#c7aa72',
    '#c9d4f1',
    '#7a91a7'
];

async function getApiData(){
    let resp = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
        method: 'POST',
        headers: {'x-zocom': 'solaris-2ngXkR6S02ijFrTP'}
    })
    let data = await resp.json();
   
    let bodies = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies',
        {
            method: 'GET',
            headers: {'x-zocom': data.key}
        }
    )
    let result = await bodies.json();
    planets = result.bodies;
}

async function generatePlanets() {
    const solarSystem = document.getElementById('solarSystem');

    // Get API key then data of planets
    await getApiData();

    let distanceBetweenPlanets = 0;

    // Generate planets and orbits
    planets.forEach((planet, index) => {
        if(index == 0){
            return; // vi skippar solen eftersom den ritas i css filen 
        }
        if(index == 4){
            planet.distance = 228000000; // API visar fel distans för planeten Mars
        }
   
        
        const planetContainer = document.createElement('div');
        planetContainer.className = 'planet-container';
        planetContainer.style.zIndex = planets.length - index; 
        
        const planetElement = document.createElement('div');
        planetElement.className = 'planet';
        planetElement.style.width = (planet.circumference / planets[0].circumference) * 1500 + 'px'; // planetens omkrets / solens omkrets
        planetElement.style.height = (planet.circumference / planets[0].circumference) * 1500 + 'px';
        planetElement.style.backgroundColor = planetsColors[index];
        planetElement.style.top = '-1rem';
        if(planet.name=='Merkurius'){
            distanceBetweenPlanets = 300; // px
            planetElement.style.left = distanceBetweenPlanets + 'px';
        }
        else{
            planetElement.style.left = distanceBetweenPlanets + 'px';
        }
        distanceBetweenPlanets += 185;

       planetElement.addEventListener('click', (event) => {
            event.stopPropagation();
            handlePlanetClick(planet.name);
        });

        planetContainer.appendChild(planetElement);
        solarSystem.appendChild(planetContainer);
    });
}



function handlePlanetClick(planetName) {
    if (planetName){focusedPlanet = planetName;
    }else{
        
            focusedPlanet = null;
            document.getElementById('searchInput').value = ''; // Clear the search input
        
    }

    updatePlanetFocus();
}

function updatePlanetFocus() {
    const focusedPlanetInfo = document.getElementById('focusedPlanetInfo');
    const planetElements = document.querySelectorAll('.planet');

    if (focusedPlanet) {
        const planet = planets.find(p => p.name === focusedPlanet);
        document.getElementById('focusedPlanetName').textContent = planet.name;
        document.getElementById('focusedPlanetDescription').textContent = planet.desc;
        focusedPlanetInfo.style.display = 'grid';
        setTimeout(() => focusedPlanetInfo.classList.add('visible'), 10);

        planetElements.forEach(el => {
            if (el.parentNode.style.animation.includes(`${15 + planets.findIndex(p => p.name === focusedPlanet) * 5}s`)) {
                el.classList.add('focused');
            } else {
                el.classList.add('dimmed');
            }
        });
    } else {
        focusedPlanetInfo.classList.remove('visible');
        setTimeout(() => focusedPlanetInfo.style.display = 'none', 300);

        planetElements.forEach(el => {
            el.classList.remove('focused', 'dimmed');
        });
    }
}
function searchPlanet() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const planet = planets.find(p => p.name.toLowerCase() === searchInput);

    if (planet) {
        focusedPlanet = planet.name; // Set the focused planet
        updatePlanetFocus(); // Update the display
    } else {
        focusedPlanet = null; // Reset if no match
        updatePlanetFocus(); // Update the display
    }
}

function checkEnter(event) {
    if (event.key === 'Enter') {
        searchPlanet(); // Call the search function when Enter is pressed
    }
}

generatePlanets();