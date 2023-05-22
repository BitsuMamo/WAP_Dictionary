const output = document.getElementById("output");
const searchBtn = document.getElementById("search-btn");
const termInput = document.getElementById("term-input");
const nextBtn = document.getElementById("next-btn");
const previousBtn = document.getElementById("previous-btn");

const baseURL = "http://localhost:8080";

let count = 9;
let offset = 0;
let totalCount = 0;

searchBtn.addEventListener("click", async (e) => {
    e.preventDefault();

    offset = 0;
    const term = termInput.value;
    updateTotalCount();

    if (term == "" || term == null) {
        initializeScreen();
        return;
    }

    const URL = `${baseURL}/getWords/${term}?offset=${offset}&count=${count}`;
    const data = await getWords(URL);
    refreshPage(data);
});



nextBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    offset += count;

    const term = termInput.value;
    const URL = `${baseURL}/getWords/${term}?offset=${offset}&count=${count}`;

    const data = await getWords(
        (term == "" || term == null) ? `${baseURL}?offset=${offset}&count=${count}` : URL
    );

    refreshPage(data);
});

previousBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    if (offset > 0)
        offset -= count;

    const term = termInput.value;
    const URL = `${baseURL}/getWords/${term}?offset=${offset}&count=${count}`;

    const data = await getWords(
        (termInput.value == "" || termInput.value == null) ? `${baseURL}?offset=${offset}&count=${count}` : URL
    );

    refreshPage(data);
})

function refreshPage(data) {
    while (output.firstChild) {
        output.removeChild(output.firstChild);
    }

    data.forEach(element => {
        const card = createCard(element);
        output.appendChild(card);
    });

    disableNexPrevBtn();

}

function disableNexPrevBtn() {
    if (offset < count) {
        previousBtn.disabled = true;
    } else {
        previousBtn.disabled = false;
    }

    console.log(`Offset: ${offset}\nCalc: ${totalCount - count}`);


    if (offset >= totalCount - count) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }

}

async function getWords(URL) {
    console.log(URL)

    const response = await fetch(URL);

    if (!response.ok) {
        console.log("something");
    }

    const data = await response.json();
    return data;
}

termInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchBtn.click();
    }
});

function createCard(data) {
    const card = document.createElement("div");
    card.classList.add("card");

    const word = document.createElement("div");
    word.classList.add("card-title");
    word.innerHTML = data.word;

    const wordType = document.createElement("div");
    wordType.classList.add("card-sub-title");
    wordType.innerHTML = data.wordtype;

    const definition = document.createElement("div");
    definition.classList.add("card-body");
    definition.innerHTML = data.definition;

    card.appendChild(word);
    card.appendChild(wordType);
    card.appendChild(definition);
    return card;
}

async function updateTotalCount() {
    const word = termInput.value;
    console.log(word);
    const totalCountResponse = await fetch(`${baseURL}/count?word=${word}`)
    totalCount = await totalCountResponse.json();
}

async function initializeScreen() {
    const data = await getWords(baseURL);

    updateTotalCount();
    refreshPage(data);
}

initializeScreen();

