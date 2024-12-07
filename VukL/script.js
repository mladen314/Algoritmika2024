
    function convertToMM() {
    let resultDiv = document.getElementById("cmInput");
    let result = document.querySelector ('#result')
    let cm = resultDiv.value;

    if (cm === "" || cm <= 0) {
        result.innerHTML = "Please enter a valid number greater than 0.";
    } else {
      let mm = cm * 10;
      result.innerHTML = `${cm} cm</span> is equal to <span>${mm} mm`;
    }
}