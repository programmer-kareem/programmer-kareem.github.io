let verseParagraph = document
  .querySelector("#verseParagraph");
let generateOrSearchBtn = document
  .querySelector(
  "#generateOrSearchBtn");
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
let verseCollection = [];
let currentVerseIndex = 0;
let previousVerseIndex;
let searchValue;
let languageToPrint = "en.asad";
let isContrastModeTurnedOn = false;
let doCurrentVerseHaveSajdah = false;
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


let printRandomVerse = async () => {
  let randomAyahNumber = Math.floor(
    (Math.random() * 6236) + 1);
  let URL =
    `https://api.alquran.cloud/v1/ayah/${randomAyahNumber}/${languageToPrint}`;
  verseParagraph.innerText =
    "loading verse..."
  fetchAndCatchError(URL);
}
printSearchedVerse = async (
  finalSearchValue) => {
  let URL =
    `https://api.alquran.cloud/v1/ayah/${finalSearchValue}/${languageToPrint}`;
  verseParagraph.innerText =
    "loading verse..."
  fetchAndCatchError(URL);
}
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
          "Verse not found. Last Ayah number: 6236, Last Surah number: 114.";
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
        "You are offline. Check your internet connection.";
    } else {
      verseParagraph.innerText =
        "An unknown error occurred.";
    }
  }
}

function printVerse(verse) {

  verseParagraph.innerText =
    `${verse.text}`;
  referenceSurahAndAyah.innerText =
    `${verse.surahNumber}:${verse.verseNumberInSurah}`
  referenceOnlyAyah.innerText =
    `${verse.verseNumberInQuran}`;
  checkForSajdah(verse);
}

function verseLanguage() {
  languageToPrint = languageDropDown
    .value

}

function searchFunction() {
  searchValue = searchInput.value
.trim();
  if (searchValue != "") {
    if (searchValue.includes(".")) {
      let finalSearchValue = searchValue
        .replace(".", ":");
      printSearchedVerse(
        finalSearchValue);

    }
    if (!searchValue.includes(".")) {
      let finalSearchValue =
      searchValue;
      printSearchedVerse(
        finalSearchValue);
    }
  }
}

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

function displayNextAyah() {
  if (verseCollection.length ===
    currentVerseIndex + 1) {
    verseParagraph.innerText =
      `you have reached end.`
  } else {

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
//contrast mode function
function setEyeContrastMode() {
  if (!isContrastModeTurnedOn) {
    readingAreaBox.style
      .backgroundColor = "#2F2F2F";
    paragraphForEyeContrast.forEach((
      paragraph) => {
      paragraph.style.color =
        "#FFFF00";
    })
    contrastBtnIcon.style.color =
      "white";

    isContrastModeTurnedOn = true;

  } else {
    readingAreaBox.style
      .backgroundColor = "";
    paragraphForEyeContrast.forEach((
      paragraph) => {
      paragraph.style.color = "";
    })
    contrastBtnIcon.style.color = "";

    isContrastModeTurnedOn = false;

  }
}

function changeFontSize() {
  let userFontSizeChoice =
    fontSizeDropDown.value;
  readingArea.style.fontSize =
    `${userFontSizeChoice}`;
}
fontSizeDropDown.onchange = () => {
  changeFontSize();
}
contrastBtnIconBox.onclick = () => {
  setEyeContrastMode();
}
verseSearchButton.onclick = () => {
  searchFunction()
}
searchInputBox.addEventListener("keyup",
  (event) => {
    if (event.keyCode === 13) {
      searchFunction();
    }
  });
previousIconBox.onclick = () => {
  displayPreviousAyah();
}
nextIconBox.onclick = () => {
  displayNextAyah();
}
generateOrSearchBtn.onclick = () => {
  printRandomVerse();
}
languageDropDown.onchange = () => {
  verseLanguage();
}