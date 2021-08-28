import SmartAIOpponent from '../src/SmartAIOpponent';
import Board from '../src/Board';
import { SquareID, PlayerID } from '../src/types';

test('Completing a winning pattern / blocking an opponent win', () => {
  /**
   * Testing function which tests whether AI can complete a winning pattern. AI moves second.
   * @param moves An array of player moves, where odd indices are playerX and even are playerO. Must have an odd length.
   * @param playerMovesToComplete PlayerID where AI should complete the pattern
   * @param expectedAINextMove Expected next move of the AI to block player's win
   */
  const checkCompletingPattern = (
    moves: SquareID[],
    playerMovesToComplete: PlayerID,
    expectedAINextMove: SquareID | undefined
  ) => {
    // Check requirements
    if (moves.length % 2 === 0) {
      throw new Error("Last turn must be player's. Not AI's");
    }

    const testBoard = new Board();
    const AI = new SmartAIOpponent(PlayerID.playerO, testBoard);
    moves.forEach((move) => {
      testBoard.playerMove(move, testBoard.currentTurn);
    });

    let completeBoard = testBoard.xSquares;
    if (playerMovesToComplete === PlayerID.playerO) {
      completeBoard = testBoard.oSquares;
    }

    expect(AI.findCompletingPatterns(completeBoard)[0]).toBe(expectedAINextMove);
  };

  // Tests no pattern to complete
  checkCompletingPattern([4], PlayerID.playerX, undefined);
  checkCompletingPattern([5, 1, 0], PlayerID.playerX, undefined);

  // Tests standard working
  checkCompletingPattern([0, 5, 2], PlayerID.playerX, 1);
  checkCompletingPattern([0, 4, 5, 7, 2], PlayerID.playerX, 1);
  checkCompletingPattern([0, 4, 5, 7, 8], PlayerID.playerX, 2);

  // Tests error checking
  expect(() => {
    checkCompletingPattern([0, 5, 2, 6, 1], PlayerID.playerX, 1);
  }).toThrow();
  expect(() => {
    checkCompletingPattern([0, 1, 2, 3, 4, 5, 6, 7, 8], PlayerID.playerX, 1);
  }).toThrow();
});

test('Finding forks', () => {
  /**
   * Testing function which tests whether AI can find a fork. AI moves second.
   * @param moves An array of player moves, where odd indices are playerX and even are playerO. Must have an odd length.
   * @param playerMovesToComplete PlayerID where AI should complete the pattern
   * @param expectedFork Expected ID of the fork
   */
  const checkFindFork = (
    moves: SquareID[],
    playerMovesToComplete: PlayerID,
    expectedFork: SquareID | undefined
  ) => {
    // Check requirements
    if (moves.length % 2 === 0) {
      throw new Error("Last turn must be player's. Not AI's");
    }

    const testBoard = new Board();
    const AI = new SmartAIOpponent(PlayerID.playerO, testBoard);
    moves.forEach((move) => {
      testBoard.playerMove(move, testBoard.currentTurn);
    });

    let forkBoard = testBoard.xSquares;
    if (playerMovesToComplete === PlayerID.playerO) {
      forkBoard = testBoard.oSquares;
    }

    expect(AI.findFork(forkBoard)).toBe(expectedFork);
  };

  // Tests no forks
  checkFindFork([4], PlayerID.playerX, undefined);
  checkFindFork([0, 1, 2, 5, 3, 6, 4, 8, 7], PlayerID.playerX, undefined);

  // Tests standard working
  checkFindFork([5, 1, 0], PlayerID.playerX, 3);
  checkFindFork([2, 4, 6], PlayerID.playerX, 0);
  checkFindFork([0, 1, 2], PlayerID.playerX, 4);
  checkFindFork([2, 4, 6, 0, 1], PlayerID.playerX, 8);

  // Tests error checking
  expect(() => {
    checkFindFork([0, 5, 2, 6, 1], PlayerID.playerX, 1);
  }).toThrow();
  expect(() => {
    checkFindFork([0, 1, 2, 3, 4, 5, 6, 7, 8], PlayerID.playerX, 1);
  }).toThrow();
});

test('AI never loses', () => {
  // Based on the Fisher-Yates shuffling algorithm as described in https://bost.ocks.org/mike/shuffle/
  const shuffle = function (array: any[]) {
    for (let i = 0; i < array.length; i += 1) {
      const randomIndex = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[randomIndex];
      array[randomIndex] = temp;
    }

    return array;
  };

  const testSmartAI = function (AIPlayerID: PlayerID, numberOfTrials: Number) {
    for (let i = 0; i < numberOfTrials; i += 1) {
      const randomizedMoves: SquareID[] = [0, 1, 2, 3, 4, 5, 6, 7, 8];
      shuffle(randomizedMoves);
      const testBoard = new Board();
      const smartAI = new SmartAIOpponent(AIPlayerID, testBoard);
      const playerID = AIPlayerID === PlayerID.playerX ? PlayerID.playerO : PlayerID.playerX;

      for (let j = 0; j < randomizedMoves.length; j += 1) {
        if (testBoard.isGameOver) {
          break;
        }

        const randomizedFreeSquares = randomizedMoves.filter((move) =>
          testBoard.freeSquares.includes(move)
        );

        // since AI will already move in its instatiation if it moves first
        testBoard.playerMove(randomizedFreeSquares[0], playerID);
        smartAI.AIMove();
      }

      const playerMovesArray =
        AIPlayerID === PlayerID.playerX ? testBoard.oSquares : testBoard.xSquares;

      expect(testBoard.isGameOver).toBe(true);
      expect(testBoard.findWins(playerMovesArray).length).toBe(0);
    }
  };
  testSmartAI(PlayerID.playerX, 500000);
  testSmartAI(PlayerID.playerO, 500000);
});
