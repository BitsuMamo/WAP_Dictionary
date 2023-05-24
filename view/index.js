
const baseURL = "http://localhost:8080";

let count = 9;
let offset = 0;
let totalCount = 0;

$("#search-btn").click(async (e) => {
    e.preventDefault();

    offset = 0;
    const term = $("#term-input").val();
    await updateTotalCount();

    if (term == "" || term == null) {
        initializeScreen();
        return;
    }

    const URL = `${baseURL}/getWords/${term}?offset=${offset}&count=${count}`;
    const data = await getWords(URL);
    refreshPage(data);
});

$("#next-btn").click( async (e) => { 
    e.preventDefault();
    offset += count;

    const term = $("#term-input").val()
    const URL = `${baseURL}/getWords/${term}?offset=${offset}&count=${count}`;

    const data = await getWords(
        (term == "" || term == null) ? `${baseURL}?offset=${offset}&count=${count}` : URL
    );

    refreshPage(data);
    
});

$("#previous-btn").click(async (e) => { 
    e.preventDefault();
    if (offset > 0)
        offset -= count;

    const term = $("#term-input").val()
    const URL = `${baseURL}/getWords/${term}?offset=${offset}&count=${count}`;

    const data = await getWords(
        (term == "" || term == null) ? `${baseURL}?offset=${offset}&count=${count}` : URL
    );

    refreshPage(data);
    
});

$("#term-input").keydown(function (e) { 
    if (e.key === "Enter") {
        e.preventDefault();
        $("#search-btn").click();
    }
});


function refreshPage(data) {

    $("#output").empty();

    data.forEach(data => {
        const card = createCard(data);
        // output.appendChild(card);
        $("#output").append(card)
    });

    disableNexPrevBtn();

}


function disableNexPrevBtn() {
    if (offset < count) {
        previousBtn.disabled = true;
    } else {
        previousBtn.disabled = false;
    }



    if (offset >= totalCount - count) {
        nextBtn.disabled = true;
    } else {
        nextBtn.disabled = false;
    }

}

async function getWords(URL) {

    const response = await fetch(URL);

    if (!response.ok) {
        console.log("something");
    }

    const data = await response.json();
    return data;
}




function createCard(data) {

    const card = $(`
        <div class="card">
            <div class="card-title">
                ${data.word}
            </div>
            <div class="card-sub-title">
                ${data.wordtype}
            </div>
            <div class="card-body">
                ${data.definition}
            </div>
        </div>
    `)

    return card;
}

async function updateTotalCount() {
    const word = $("#term-input").val();
    const totalCountResponse = await fetch(`${baseURL}/count?word=${word}`)
    totalCount = await totalCountResponse.json();
}

async function initializeScreen() {
    const data = await getWords(baseURL);

    await updateTotalCount();
    refreshPage(data);
}

initializeScreen();

