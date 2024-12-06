
var planets;

let focusedPlanet = null;

async function getApiData(){
    let resp = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
        method: 'POST',
        headers: {'x-zocom': 'solaris-2ngXkR6S02ijFrTP'}
    })
    let data = await resp.json();
    console.log(data.key);
    let bodies = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies',
        {
            method: 'GET',
            headers: {'x-zocom': data.key}
        }
    )
    let result = await bodies.json();
    console.log(result);
    planets = result.bodies;

}

async function generatePlanets() {
    const solarSystem = document.getElementById('solarSystem');

    await getApiData();

    // Generate planets and orbits
    planets.forEach((planet, index) => {
        const orbit = document.createElement('div');
        orbit.className = 'orbit';
        orbit.style.width = (planet.distance / 1000000) +'px';
        orbit.style.height = (planet.distance / 1000000) +'px';
        solarSystem.appendChild(orbit);

        const planetContainer = document.createElement('div');
        planetContainer.className = 'planet-container';
        planetContainer.style.animation = `orbit ${15 + index * 5}s linear infinite`;
        planetContainer.style.zIndex = planets.length - index; // Add this line

        const planetElement = document.createElement('div');
        planetElement.className = 'planet';
        planetElement.style.width = (planet.circumference / 100) + 'px';
        planetElement.style.height = (planet.circumference / 100) + 'px';
        planetElement.style.backgroundColor = 'red';
        planetElement.style.top = `-${planet.circumference / 100}px`;
        planetElement.style.left = `${(planet.distance / 1000000)- planet.circumference / 100 }px`;

       planetElement.addEventListener('click', (event) => {
            event.stopPropagation();
            handlePlanetClick(planet.name);
        });

        planetContainer.appendChild(planetElement);
        solarSystem.appendChild(planetContainer);
    });
}



function handlePlanetHover(planetName) {
    const planetInfo = document.getElementById('planetInfo');
    if (planetName && !focusedPlanet) {
        planetInfo.textContent = planetName;
        planetInfo.style.display = 'none';
        selectedPlanet = planetName;
    } else {
        planetInfo.style.display = 'none';
        selectedPlanet = null;
    }
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

