
var planets; // vi deklarerar variablen planet 

let focusedPlanet = null;

let planetsColors = [
    'yellow', // SOl
    '#8b8983', // Merkurius
    '#e6cbca', // Venus
    '#418ed5', // Jorden
    '#eb5c5d',
    '#e29468',
    '#c7aa72',
    '#c9d4f1',
    '#7a91a7'
];

async function getApiData(){ // Asynkron funktion för att hämta data från ett API
    let resp = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/keys', {
        method: 'POST', // Väntar på svaret från API:et efter att ha skickat en POST
        headers: {'x-zocom': 'solaris-2ngXkR6S02ijFrTP'}
    })
    let data = await resp.json(); // Nu väntar på att svaret ska konverteras till JSON format
   
    let bodies = await fetch('https://n5n3eiyjb0.execute-api.eu-north-1.amazonaws.com/bodies', // Väntar på att hämta data från API som returnerar information om "bodies"
        {
            method: 'GET', // Definierar alternativ för fetch-anropet för att hämta data
            headers: {'x-zocom': data.key}
        }
    )
    let result = await bodies.json(); // 'result' kommer nu att innehålla den hämtade informationen från API:et
    planets = result.bodies;
}

async function generatePlanets() { // Denna funktion kommer att hämta information om planeter från ett API
    const solarSystem = document.getElementById('solarSystem');

    await getApiData(); // Väntar på att hämta data från API:et

    let distanceBetweenPlanets = 0;

    // Itererar över varje planet i planets-arrayen
    planets.forEach((planet, index) => {
        if(index == 0){
            return; // vi skippar solen eftersom den ritas i CSS filen 
        }
        if(index == 4){
            planet.distance = 228000000; // API visar fel distans för planeten Mars
        }
   
        
        const planetContainer = document.createElement('section');
        planetContainer.className = 'planet-container';
        planetContainer.style.zIndex = planets.length - index; 
        
        const planetElement = document.createElement('section');// Skapar ett nytt HTML-element av typen 'section'
        planetElement.className = 'planet';
        planetElement.style.width = (planet.circumference / planets[0].circumference) * 1500 + 'px'; // Skalar omkretsen i förhållande till solens omkrets för att sätta bredden i pixlar
        planetElement.style.height = (planet.circumference / planets[0].circumference) * 1500 + 'px'; // Skalar omkretsen i förhållande till solens omkrets för att sätta höjden i pixlar
        planetElement.style.backgroundColor = planetsColors[index]; // Sätter bakgrundsfärgen för planetElement baserat på planetens färg
        planetElement.style.top = '-1rem'; // Sätter den vertikala positionen för planetElement till -1rem
        if(planet.name=='Merkurius'){ // Kontrollerar om den aktuella planeten är Merkurius
            distanceBetweenPlanets = 300; 
            planetElement.style.left = distanceBetweenPlanets + 'px'; 
        }
        else{
            planetElement.style.left = distanceBetweenPlanets + 'px'; 
        }
        distanceBetweenPlanets += 185;

       planetElement.addEventListener('click', (event) => { // Lägger till en klick-händelselyssnare på planetElement
            event.stopPropagation();  // Stoppar händelsepropagering så att klicket inte påverkar andra element
            handlePlanetClick(planet.name);
        });
 
        planetContainer.appendChild(planetElement); // Lägger till planetElement som ett barn till planetContainer
        solarSystem.appendChild(planetContainer); // Detta placerar hela planetcontainern inom solsystemets layout
    });
}



function handlePlanetClick(planetName) { // Funktion för att hantera klick på en planet
    if (planetName){focusedPlanet = planetName;
    }else{
        
            focusedPlanet = null;
            document.getElementById('searchInput').value = '';
        
    }

    updatePlanetFocus();
}

function updatePlanetFocus() { // Funktion för att uppdatera informationen om den fokuserade planeten
    const focusedPlanetInfo = document.getElementById('focusedPlanetInfo');
    const planetElements = document.querySelectorAll('.planet');

    if (focusedPlanet) {
        const planet = planets.find(p => p.name === focusedPlanet); // Söker efter den planet som matchar namnet på den fokuserade planeten
        document.getElementById('focusedPlanetName').textContent = planet.name;
        document.getElementById('focusedPlanetDescription').textContent = planet.desc; // Uppdaterar innehållet i elementet som visar beskrivningen av den fokuserade planeten
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
function searchPlanet() { // Funktion för att söka efter en planet 
    const searchInput = document.getElementById('searchInput').value.toLowerCase(); // Hämtar värdet från sökfältet med id 'searchInput'
    const planet = planets.find(p => p.name.toLowerCase() === searchInput); // Söker efter planeten i planets-arrayen vars namn matchar söksträngen

    if (planet) {
        focusedPlanet = planet.name;     // Om en matchande planet hittas, uppdateras focusedPlanet med planetens namn
        updatePlanetFocus();
    } else {
        focusedPlanet = null; 
        updatePlanetFocus(); 
    }
}

function checkEnter(event) { // Syftet är att reagera på Enter-tangenten för att söka efter en planet
    if (event.key === 'Enter') {
        searchPlanet(); 
    }
}

generatePlanets();