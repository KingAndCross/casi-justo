document.addEventListener("DOMContentLoaded", (event) => {
  const numberButtons = document.querySelectorAll(".number-btn");
  const inputNumbers = document.querySelectorAll(".input-number");
  const resetButton = document.querySelector(".reset-btn");
  const targetNumber = document.querySelector(".target-number");
  const pointsPopup = document.querySelector(".points-pop-up");
  const roundIndicator = document.querySelectorAll(".indicator");
  const newgameButtons = document.querySelectorAll(".newgame-btn");
  const gameoverModal = document.getElementById("gameover-modal");
  const timerElement = document.querySelector(".timer");
  const activeButtons = document.querySelectorAll(
    ".number-btn:not([disabled])"
  );

  const maxRounds = 5;
  let round = 0;
  let product = 1;
  let target;

  let timerID;
  const time = 15;

  let points = 0;
  let minimalPossiblePoints = 0;
  let inputIndex = 0;

  const possibleFactors = Array.from(activeButtons).map(
    (button) => button.value
  );

  newgameButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      btn.parentElement.parentElement.close();
      roundIndicator.forEach((round) => round.classList.remove("done"));
      newGame();
    });
  });

  numberButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const inputNumber = inputNumbers[inputIndex];
      inputNumber.textContent = button.value;
      product *= button.value;
      inputIndex++;

      inputNumber.classList.add("animate");

      inputNumber.addEventListener(
        "animationend",
        () => {
          inputNumber.classList.remove("animate");
        },
        { once: true }
      );
      if (inputIndex >= 2) {
        checkResult();
        newRound();
      }
    });
  });

  resetButton.addEventListener("click", clearInputs);

  function checkResult() {
    const difference = Math.abs(product - target);
    const addedPoints = difference > 5 ? 5 : difference;
    pointsAnimation(addedPoints);
    points += addedPoints;
    minimalPossiblePoints += smallestDifferenceFromTarget(
      possibleFactors,
      target
    );
  }

  function newGame() {
    round = 0;
    points = 0;
    inputIndex = 0;
    setTimer();
    clearInputs();
    setObjective();
  }

  function _newRound() {
    clearInputs();
    if (round < maxRounds) {
      nextRound();
      setObjective();
    } else {
      gameOver();
    }
  }

  function gameOver() {
    gameoverMessage();
    gameoverModal.showModal();
    clearTimeout(timerID);
    timerElement.style.visibility = "hidden";
    timerElement.style.animationName = "none";
    timerElement.offsetWidth;
  }

  function newRound(delay = 200) {
    setTimer();
    setTimeout(() => {
      _newRound();
    }, delay);
  }

  function clearInputs() {
    inputNumbers.forEach((input) => (input.textContent = ""));
    inputIndex = 0;
    product = 1;
  }

  function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
  }

  function setObjective() {
    target = getRandomInt(2, 81);
    targetNumber.innerHTML = `<p>${target}</p>`;
  }

  function nextRound() {
    roundIndicator[round].classList.add("done");
    round += 1;
  }

  function setTimer() {
    clearTimeout(timerID);
    timerElement.style = `--duration: ${time}s`;
    timerElement.style.animationName = "none";
    timerElement.offsetWidth;
    timerElement.style.animationName = "timer";
    timerID = setTimeout(() => {
      newRound();
      console.log("fin del tiempo siguiente ronda");
    }, time * 1000);
  }

  function pointsAnimation(addedPoints) {
    const msg = (() => {
      if (addedPoints === 0) {
        return "¡Justo!";
      } else if (addedPoints < 4) {
        return "¡Casi!";
      } else {
        return "";
      }
    })();
    pointsPopup.innerHTML = `
        <h3>${msg}</h3>
        <h3>+${addedPoints}</h3>
    `;

    pointsPopup.classList.add("animate");

    pointsPopup.addEventListener(
      "animationend",
      () => {
        pointsPopup.classList.remove("animate");
      },
      { once: true }
    );
  }

  function smallestDifferenceFromTarget(numbers, target) {
    let smallestDifference = 5;
    for (let i = 0; i < numbers.length; i++) {
      for (let j = i; j < numbers.length; j++) {
        const product = numbers[i] * numbers[j];
        const difference = target - product;
        if (difference === 0) {
          return 0;
        }
        if (Math.abs(difference) < Math.abs(smallestDifference)) {
          smallestDifference = difference;
        }
      }
    }
    return smallestDifference;
  }

  function gameoverMessage() {
    const gameoverText = gameoverModal.querySelector(".gameover-text");
    gameoverText.innerHTML = `Obtuviste ${points} puntos, el puntaje más bajo posible era ${minimalPossiblePoints}.`;
  }
});
