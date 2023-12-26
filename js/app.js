import questionList from './questions.js';
import montList from './mont.js';
import qidsList from './qids.js';

import { readData, writeData } from './database.js';

let hamiltonScore = 0;
let montScore = 0;
let qidsScore = 0;
const welcome = document.getElementById('welcome');
const welcomeBtn = document.getElementById('welcomeBtn');
const profile = document.getElementById('profile');
const profileForm = document.getElementById('profileForm');
const name = document.getElementById('name');
const age = document.getElementById('age');
const sex = document.getElementById('sex');
const country = document.getElementById('country');
const hamiltonInfo = document.getElementById('hamiltonInfo');
let questionCount = -1;
const profileInfo = {};
const questionDynamic = document.getElementById('questionDynamic');
const questionForm = document.getElementById('questionForm');
const prevArrow = document.getElementById('arrow');
const nextArrow = document.getElementById('leftarrow');
const questions = document.getElementById('questions');
let tempHamiltonScore = -1;
const scorePage = document.getElementById('scorepage');
const message = document.getElementById('message');
const nextLevel = document.getElementById('nextlevel');
const currentQuestionSet = {
  hamilton: true,
  mont: false,
  qids: false,
};
let tempMoveTrack = 0;
const chart = document.getElementById('chart');

let checkIfBtn = false;

function questionDisplay(dynamicQuestions, trackMove) {
  console.log('fuck');
  questionDynamic.textContent = dynamicQuestions[questionCount][0];
  let i = 0;
  questionForm.innerHTML = '';
  for (let option in dynamicQuestions[questionCount][1]) {
    const optionDiv = document.createElement('div');
    const optionInput = document.createElement('input');
    optionInput.setAttribute('type', 'radio');
    optionInput.setAttribute('id', `option${i}`);
    optionInput.value = dynamicQuestions[questionCount][1][option];
    optionInput.setAttribute('name', 'option');
    const optionLabel = document.createElement('label');
    optionLabel.setAttribute('class', 'questionLable');
    optionLabel.setAttribute('for', `option${i}`);

    optionLabel.textContent = option;

    optionDiv.appendChild(optionInput);
    optionDiv.appendChild(optionLabel);
    questionForm.appendChild(optionDiv);
    const selectedOption = document.getElementById(`option${i}`);
    selectedOption.addEventListener('click', (e) => {
      tempHamiltonScore = dynamicQuestions[questionCount][1][option];
    });
    i++;
  }

  if (currentQuestionSet.hamilton) {
    if (trackMove === 'next') {
      tempMoveTrack = tempHamiltonScore;
      if (tempHamiltonScore >= 0) {
        hamiltonScore += tempHamiltonScore;
      }
    } else {
      if (tempHamiltonScore >= 0) {
        hamiltonScore -= tempMoveTrack;
        tempMoveTrack = 0;
      }
    }
  } else if (currentQuestionSet.mont) {
    if (trackMove === 'next') {
      tempMoveTrack = tempHamiltonScore;
      if (tempHamiltonScore >= 0) {
        if (tempHamiltonScore % 2 === 0) {
          tempHamiltonScore /= 2;
        }
        montScore += tempHamiltonScore;
      }
    } else {
      if (tempHamiltonScore >= 0) {
        montScore -= tempMoveTrack;
        tempMoveTrack = 0;
      }
    }
  } else {
    if (trackMove === 'next') {
      tempMoveTrack = tempHamiltonScore;
      if (tempHamiltonScore >= 0) {
        qidsScore += tempHamiltonScore;
      }
    } else {
      if (tempHamiltonScore >= 0) {
        qidsScore -= tempMoveTrack;
        tempMoveTrack = 0;
      }
    }
  }

  tempHamiltonScore = -1;
}

function updateScore() {
  questions.style.display = 'none';
  scorePage.style.display = 'block';
  const score = document.getElementById('score');
  if (currentQuestionSet.hamilton) {
    score.textContent = `SCORE: ${hamiltonScore}`;
  } else if (currentQuestionSet.mont) {
    score.textContent = `SCORE: ${montScore}`;
  } else {
    score.textContent = `SCORE: ${qidsScore}`;
  }
  let depressionMessage;
  const depressionLevel = {
    normal: 'YOU ARE NORMAL',
    mild: 'YOU HAVE MILD DEPRESSION',
    moderate: ' YOU HAVE MODERATE DEPRESSION',
    severe: 'SEVERE DEPRESSION',
    verySevere: 'VERY SEVERE DEPRESSION',
  };

  if (currentQuestionSet.hamilton) {
    if (0 <= hamiltonScore && hamiltonScore <= 7) {
      depressionMessage = depressionLevel.normal;
    } else if (8 <= hamiltonScore && hamiltonScore <= 13) {
      depressionMessage = depressionLevel.mild;
    } else if (14 <= hamiltonScore && hamiltonScore <= 18) {
      depressionMessage = depressionLevel.moderate;
    } else if (19 <= hamiltonScore && hamiltonScore <= 22) {
      depressionMessage = depressionLevel.severe;
    } else {
      depressionMessage = depressionLevel.verySevere;
    }
  } else if (currentQuestionSet.mont) {
    if (0 <= montScore && montScore <= 6) {
      depressionMessage = depressionLevel.normal;
    } else if (7 <= montScore && 13 <= 19) {
      depressionMessage = depressionLevel.mild;
    } else if (20 <= montScore && montScore <= 34) {
      depressionMessage = depressionLevel.moderate;
    } else {
      depressionMessage = depressionLevel.severe;
    }
  } else {
    if (0 <= qidsScore && qidsScore <= 5) {
      depressionMessage = depressionLevel.normal;
    } else if (6 <= qidsScore && qidsScore <= 10) {
      depressionMessage = depressionLevel.mild;
    } else if (11 <= qidsScore && qidsScore <= 15) {
      depressionMessage = depressionLevel.moderate;
    } else if (16 <= qidsScore && qidsScore <= 20) {
      depressionMessage = depressionLevel.severe;
    } else {
      depressionMessage = depressionLevel.verySevere;
    }
  }
  message.textContent = depressionMessage;
  nextLevel.addEventListener('click', (e) => {
    if (currentQuestionSet.hamilton) {
      questions.style.display = 'block';
      scorePage.style.display = 'none';
      questionCount++;
      questionDisplay(questionList, 'next');
    } else if (currentQuestionSet.mont) {
      questions.style.display = 'block';

      scorePage.style.display = 'none';
      questionCount++;
      questionDisplay(montList, 'next');
    } else if (currentQuestionSet.qids) {
      questions.style.display = 'block';

      scorePage.style.display = 'none';
      questionCount++;
      questionDisplay(qidsList, 'next');
    } else {
      writeData(
        profileInfo.name,
        profileInfo.age,
        profileInfo.sex,
        profileInfo.country,
        hamiltonScore,
        montScore,
        qidsScore
      );

      scorePage.style.display = 'none';
      chart.style.display = 'grid';

      readData().then((userData) => {
        const totalUser = userData.data.length;
        let normal = 0;
        let mild = 0;
        let modarate = 0;
        let severe = 0;
        let verySevere = 0;

        userData.data.forEach((data) => {
          if (0 <= data.hamiltonScore && data.hamiltonScore <= 7) {
            normal += 1;
          } else if (8 <= data.hamiltonScore && 13 <= data.hamiltonScore) {
            mild += 1;
          } else if (14 <= data.hamiltonScore && 18 <= data.hamiltonScore) {
            modarate += 1;
          } else if (19 <= data.hamiltonScore && 22 <= data.hamiltonScore) {
            severe += 1;
          } else {
            verySevere += 1;
          }
        });

        const colors = ['white', 'green', 'blue', 'yellow', 'red'];
        const finalData = [
          (normal / totalUser) * 100,
          (mild / totalUser) * 100,
          (modarate / totalUser) * 100,
          (severe / totalUser) * 100,
          (verySevere / totalUser) * 100,
        ];

        drawPieChart(finalData, colors);
        const totalParticipant = document.getElementById('totalUsr');
        totalParticipant.textContent = `Total Participants: ${totalUser}:`;
        const hdrs = document.getElementById('hdrs');
        hdrs.textContent = `HDRS: ${hamiltonScore}`;
        const madrs = document.getElementById('madrs');
        madrs.textContent = `MADRS: ${montScore}`;
        const qids = document.getElementById('qids');
        qids.textContent = `QIDS: ${qidsScore}`;

        const normalScore = document.getElementById('normal');
        normalScore.textContent = `NORMAL: ${Math.trunc(
          (normal / totalUser) * 100
        )}%`;

        const mildScore = document.getElementById('mild');
        mildScore.textContent = `MILD: ${Math.trunc(
          (mild / totalUser) * 100
        )}%`;

        const moderateScore = document.getElementById('moderate');
        moderateScore.textContent = `MODERATE: ${Math.trunc(
          (moderate / totalUser) * 100
        )}%`;

        const severeScore = document.getElementById('severe');
        severeScore.textContent = `SEVERE: ${Math.trunc(
          (severe / totalUser) * 100
        )}%`;

        const verySevereScore = document.getElementById('verySevere');

        verySevereScore.textContent = `VERY SEVERE: ${Math.trunc(
          (verySevere / totalUser) * 100
        )}%`;
      });
    }

    e.preventDefault();
  });
}

welcomeBtn.addEventListener('click', (e) => {
  welcome.style.display = 'none';
  profile.style.display = 'grid';
  e.preventDefault();
});

profileForm.addEventListener('submit', (e) => {
  profileInfo.name = name.value;
  profileInfo.age = age.value;
  profileInfo.sex = sex.value;
  profileInfo.country = country.value;
  profile.style.display = 'none';
  const btn = document.getElementById('saveandcontinue');
  scorePage.style.display = 'none';

  questions.style.display = 'block';
  questionCount++;
  questionDisplay(questionList, 'next');
  e.preventDefault();

  e.preventDefault();
});

const moveNext = (el) => {
  if (tempHamiltonScore > -1) {
    let currentList = [];
    if (currentQuestionSet.hamilton) {
      currentList = questionList;
    } else if (currentQuestionSet.mont) {
      currentList = montList;
    } else {
      currentList = qidsList;
    }
    if (questionCount + 1 < currentList.length) {
      questionCount++;
      questionDisplay(currentList, 'next');
    } else {
      questionCount = -1;
      if (currentQuestionSet.hamilton) {
        updateScore();
        currentQuestionSet.hamilton = false;
        currentQuestionSet.mont = true;
      } else if (currentQuestionSet.mont) {
        updateScore();
        currentQuestionSet.mont = false;
        currentQuestionSet.qids = true;
      } else {
        updateScore();
        currentQuestionSet.qids = false;
      }
    }
  } else {
    window.alert('Please Select an option');
  }
};

const movePrev = () => {
  let currentList = [];
  if (currentQuestionSet.hamilton) {
    currentList = questionList;
  } else if (currentQuestionSet.mont) {
    currentList = montList;
  }
  if (questionCount >= 0) {
    questionCount--;
    questionDisplay(currentList, 'prev');
  } else {
    questionCount = -1;
    if (currentQuestionSet.hamilton) {
      updateScore();
      currentQuestionSet.hamilton = false;
      currentQuestionSet.mont = true;
    } else if (currentQuestionSet.mont) {
      updateScore();
      currentQuestionSet.mont = false;
    } else {
      updateScore();
      currentList.qids = true;
    }
  }
};

document.addEventListener('keydown', (e) => {
  if (e.key.toLowerCase() === 'arrowright') {
    moveNext();
  } else if (e.key.toLocaleLowerCase() === 'arrowleft') {
    movePrev();
  }
});
nextArrow.addEventListener('click', (e) => {
  moveNext();
  e.preventDefault();
});

prevArrow.addEventListener('click', (e) => {
  movePrev();
  e.preventDefault();
});

function drawPieChart(data, colors) {
  const canvas = document.getElementById('myChart');
  const ctx = canvas.getContext('2d');

  const total = data.reduce((a, b) => a + b, 0);
  var startAngle = 0;

  for (var i = 0; i < data.length; i++) {
    var sliceAngle = (2 * Math.PI * data[i]) / total;
    drawSlice(
      ctx,
      canvas.width / 2,
      canvas.height / 2,
      Math.min(canvas.width / 2, canvas.height / 2),
      startAngle,
      startAngle + sliceAngle,
      colors[i]
    );
    startAngle += sliceAngle;
  }
}

function drawSlice(ctx, centerX, centerY, radius, startAngle, endAngle, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(centerX, centerY);
  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.closePath();
  ctx.fill();
}
