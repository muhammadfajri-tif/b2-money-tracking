
import { loadFileContent, isDataValid, initializeDataToLocalStorage } from './utils/file.mjs';

const fileSelector = document.getElementById('file-select'); // must be appropriate
fileSelector.addEventListener('change', readFile, false);

/**
 * Module event handler untuk membaca file CSV pengelola keuangan
 */
function readFile() {
  // check if DOM File API is supported/not
  if (!window.File || !window.FileReader || !window.FileList || !window.Blob) {
    console.log('PLEASE ENABLE/USE BROWSER WITH HTML5 SUPPORT');
    console.error('The File APIs are not fully supported in this browser.');
    return;
  }

  // check file
  if (!fileSelector.files) {
    console.error(
      "This browser doesn't seem to support the `files` property of file inputs."
    );
  } else if (!fileSelector.files[0]) {
    console.warn('No file selected.');
  } else {
    // get file
    let file = fileSelector.files[0];

    // baca isi file data & handle
    loadFileContent(file, reader => {
      // validate data
      if (isDataValid(reader.target.result, file.type)) {
        // save data to local storage
        initializeDataToLocalStorage(JSON.parse(reader.target.result));
        console.log("loaded ", reader.target.result);
      } else {
        console.error("File type not supported!");
      }

    });
  }
}

