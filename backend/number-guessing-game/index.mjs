import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function askQuestion(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("Welcome to the Number Guessing Game!");
  console.log("I'm thinking of a number between 1 and 100.");
  console.log("Please select your difficulty level:");
  console.log("1. Easy (10 chances)");
  console.log("2. Medium (5 chances)");
  console.log("3. Hard (3 chances)");

  let difficulty = await askQuestion("Enter your choice: ");
  difficulty = parseInt(difficulty);

  let attempts;
  switch (difficulty) {
    case 1:
      attempts = 10;
      break;
    case 2:
      attempts = 5;
      break;
    case 3:
      attempts = 3;
      break;
    default:
      console.error("Invalid choice. Defaulting to Medium difficulty.");
      attempts = 5;
  }

  console.log(`Great! You have ${attempts} chances. Let's start the game!`);

  const randomNum = getRandomInt(1, 100);
  let attemptsUsed = 0;
  let won = false;

  const startTime = new Date();

  while (attempts > 0) {
    let guess = await askQuestion("Enter your guess: ");
    guess = parseInt(guess);
    attemptsUsed++;

    if (guess === randomNum) {
      const endTime = new Date();
      const timeTaken = Math.round((endTime - startTime) / 1000);
      console.log(
        `Congratulations! You guessed the correct number (${randomNum}) in ${attemptsUsed} attempts within ${timeTaken} seconds.`
      );
      won = true;
      break;
    } else if (guess < randomNum) {
      console.log("Incorrect! The number is greater than your guess.");
    } else {
      console.log("Incorrect! The number is less than your guess.");
    }

    attempts--;
    if (attempts > 0) {
      console.log(`You have ${attempts} attempts left.`);
    }
  }

  if (!won) {
    console.log(`Game Over! The correct number was ${randomNum}.`);
  }

  while (true) {
    const playAgain = await askQuestion(
      "Do you want to play again? (yes/no): "
    );
    if (playAgain.toLowerCase() === "yes") {
      await main();
      break;
    } else if (playAgain.toLowerCase() === "no") {
      console.log("Thanks for playing! Goodbye!");
      rl.close();
      break;
    } else {
      console.error("Invalid input. Please only enter 'yes' or 'no'.");
    }
  }
}

main();
