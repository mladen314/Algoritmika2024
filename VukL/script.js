
    const cm = document.getElementById("centimeters").value;
    const resultDiv = document.getElementById("result");

    if (cm === "" || cm <= 0) {
      resultDiv.innerHTML = "<span>Please enter a valid number greater than 0.</span>";
    } else {
      const mm = cm * 10;
      resultDiv.innerHTML = `<span>${cm} cm</span> is equal to <span>${mm} mm</span>`;
    }
  