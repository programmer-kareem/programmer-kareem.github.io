//initialisation(imported) from html
let verseParagraph = document
  .querySelector("#verseParagraph");
let printBtn = document
  .querySelector(
  "#printBtn");
let referenceSurahAndAyah = document
  .querySelector(
    "#referenceSurahAndAyah");
let referenceOnlyAyah = document
  .querySelector("#referenceOnlyAyah");
let previousIconBox = document
  .querySelector("#previousIconBox");
let nextIconBox = document
  .querySelector("#nextIconBox");
let readingAreaBox = document
  .querySelector("#readingAreaBox");
let readingArea = document
  .querySelector("#readingArea");
let searchInputBox = document
  .querySelector("#searchInput");
let verseSearchButton = document
  .querySelector("#searchIcon");
let paragraphForEyeContrast = document
  .querySelectorAll(
    ".readingAreaParagraph");
let contrastBtnIconBox = document
  .querySelector("#HCIconBox");
let contrastBtnIcon = document
  .querySelector("#eyeIcon");
let fontSizeDropDown = document
  .querySelector("#FontSizeSelector");
let languageDropDown = document
  .querySelector("#languageSelector");
let verseNumberDisplayer = document
  .querySelector(
    "#verseCollectionNavigation");
//initialisation 
let verseCollection = [];
let currentVerseIndex = 0;
let previousVerseIndex;
let searchValue;
let finalSearchValue;
let languageToPrint = "en.asad";
let isContrastModeTurnedOn = false;
let doCurrentVerseHaveSajdah = false;
//first verse of the Qur'an, this will be added to verse collection so that way, this will be  first verse of the collection without fetching it.
{
  let FirstVerse = {
    text: "In the name of God, The Most Gracious, The Dispenser of Grace:",
    verseNumberInSurah: 0,
    surahNumber: 0,
    verseNumberInQuran: 0,
    sajdah: false,
  }
  verseCollection.push(FirstVerse);
}
//test
//generates number between 1-6236 randomly and give it to fetch the ayah of that number 
let findRandomVerse = async () => {
  let randomAyahNumber = Math.floor(
    (Math.random() * 6236) + 1);
  let URL =
    `https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/${languageToPrint}`;
  verseParagraph.innerText =
    "loading verse..."
  fetchAndCatchError(URL);
}
//gets the searched term and change it to a format, creates a url and send it to fetch.
findSearchedVerse = async () => {
searchValue = searchInputBox.value
    .trim();
  if (searchValue != "") {
    if (searchValue.includes(".")) {
     finalSearchValue = searchValue
        .replace(".", ":");
  
    }
    else if (!searchValue.includes(".")) {
      finalSearchValue =
        searchValue;
    }
  }
  let URL =
    `https://api.alquran.cloud/v1/ayah/${finalSearchValue}/${languageToPrint}`;
  verseParagraph.innerText =
    "loading verse..."
  fetchAndCatchError(URL);
}
//fetches the URL and if there is an error, it catches iit and if there is not, it sends the verse to print.
async function fetchAndCatchError(URL) {
  let statusCode;
  try {
    let response = await fetch(URL);
    statusCode = response
    .status; // Capture the status code here

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${statusCode}`
        );
    }

    let data = await response.json();
    let verse = {
      text: data.data.text,
      verseNumberInSurah: data.data
        .numberInSurah,
      surahNumber: data.data.surah
        .number,
      verseNumberInQuran: data.data
        .number,
      sajdah: data.data.sajda,
    };
    await printVerse(verse);
    verseCollection.push(verse);
    currentVerseIndex++;
    verseNumberDisplayer.innerText =
      currentVerseIndex;

  } catch (error) {
    console.log(
      `Error: ${error.message}`);
    if (statusCode >= 300 &&
      statusCode <= 399) {
      if (statusCode === 301) {
        verseParagraph.innerText =
          "The resource has permanently moved to a new URL.";
      } else if (statusCode === 302) {
        verseParagraph.innerText =
          "The resource is temporarily down, please try again later!";
      }
    } else if (statusCode >= 400 &&
      statusCode <= 499) {
      if (statusCode === 400) {
        verseParagraph.innerText =
          "Invalid input. Use the correct format (Verse number) or (Surah number.Verse number).";
      } else if (statusCode === 404) {
        verseParagraph.innerText =
          "Verse not found. make sure you have searched between 1 to 6236 or it is in correct format. try searching '3.185'";
      } else if (statusCode === 429) {
        verseParagraph.innerText =
          "Too many requests. Please wait before trying again.";
      }
    } else if (statusCode >= 500 &&
      statusCode <= 599) {
      verseParagraph.innerText =
        "Server issue. Please try again later.";
    } else if (!navigator.onLine) {
      verseParagraph.innerText =
        "You are offline. Check your internet connection and try again.";
    } else {
      verseParagraph.innerText =
        "An unknown error occurred.";
    }
  }
}
//prints the verse which it got by fetching.
function printVerse(verse) {

  verseParagraph.innerText =
    `${verse.text}`;
  referenceSurahAndAyah.innerText =
    `${verse.surahNumber}:${verse.verseNumberInSurah}`
  referenceOnlyAyah.innerText =
    `${verse.verseNumberInQuran}`;
  checkForSajdah(verse);
}
//changes the language to which user wants(currently, it changes the language of verse which will be fetched after changing language, it will be updated later to change all the verse in the verse collection.)
function verseLanguage() {
  languageToPrint = languageDropDown
    .value
}
//checks if there is any sajdah in searched or randomly found verse
function checkForSajdah(verseToPrint) {
  if (verseToPrint.sajdah != false) {
    doCurrentVerseHaveSajdah = true;
    verseParagraph.style.color = "red";
  } else {
    doCurrentVerseHaveSajdah = false;

    if (!isContrastModeTurnedOn) {
      verseParagraph.style.color = "";
    } else {
      verseParagraph.style.color =
        "#FFFF00";
    }
  }
}
//displays the previously fetched ayah of the currently displayed.
function displayPreviousAyah() {
  if (currentVerseIndex != 0) {
    let previousVerseIndex =
      currentVerseIndex - 1;
    let verseToPrint = verseCollection[
      previousVerseIndex];
    verseParagraph.innerText =
      verseToPrint.text;
    referenceOnlyAyah.innerText =
      verseToPrint.verseNumberInQuran;
    referenceSurahAndAyah.innerText =
      `${verseToPrint.surahNumber}:${verseToPrint.verseNumberInSurah}`;
    currentVerseIndex--;
    verseNumberDisplayer.innerText =
      currentVerseIndex;
    checkForSajdah(verseToPrint);
  } else {}
}
//displays the next ayah to the ayah which is currently displayed.
function displayNextAyah() {
  if (verseCollection.length !=
    currentVerseIndex + 1) {
    let nextVerseIndex =
      currentVerseIndex + 1;
    let verseToPrint = verseCollection[
      nextVerseIndex];
    verseParagraph.innerText =
      verseToPrint.text;
    referenceOnlyAyah.innerText =
      verseToPrint.verseNumberInQuran;
    referenceSurahAndAyah.innerText =
      `${verseToPrint.surahNumber}:${verseToPrint.verseNumberInSurah}`;
    currentVerseIndex++;
    verseNumberDisplayer.innerText =
      currentVerseIndex;
    checkForSajdah(verseToPrint);
  }
}
//changes the sajdah verse color to red after contrast mode is turned off''.
function setEyeContrastMode() {
  if (!isContrastModeTurnedOn) {
    // Enable contrast mode
    readingAreaBox.style.backgroundColor = "#2F2F2F";
    paragraphForEyeContrast.forEach((paragraph) => {
      paragraph.style.color = "#FFFF00";
    });
    if (doCurrentVerseHaveSajdah) {
      verseParagraph.style.color = "red";
    } else {
      verseParagraph.style.color = "#FFFF00";
    }
    
    contrastBtnIcon.style.color = "white";
    
    isContrastModeTurnedOn = true;

  } else {
    readingAreaBox.style.backgroundColor = "";
    paragraphForEyeContrast.forEach((paragraph) => {
      paragraph.style.color = "";
    });
    contrastBtnIcon.style.color = "";
    if (doCurrentVerseHaveSajdah) {
      verseParagraph.style.color = "red";
    } else {
      verseParagraph.style.color = "";
    }

    isContrastModeTurnedOn = false;
  }
}
//font size changing function, changes font size as per user wants.
function changeFontSize() {
  let userFontSizeChoice =
    fontSizeDropDown.value;
  readingArea.style.fontSize =
    `${userFontSizeChoice}`;
}
//dom manipulation
fontSizeDropDown.onchange = () => {
  changeFontSize();
}
contrastBtnIconBox.onclick = () => {
  setEyeContrastMode();
}
verseSearchButton.onclick = () => {
  if (searchInputBox.value!="") {
    findSearchedVerse()
  }
}
//enter key
searchInputBox.addEventListener("keyup",
  (event) => {
    if (event.keyCode === 13) {
      findSearchedVerse();
    }
  });
previousIconBox.onclick = () => {
  displayPreviousAyah();
}
nextIconBox.onclick = () => {
  displayNextAyah();
}
printBtn.onclick = () => {
  findRandomVerse();
}
languageDropDown.onchange = () => {
  verseLanguage();
}