const acronymize = (string, specialCase, seperator) => {
  if (specialCase) {
    for (var obj in specialCase) {
      if (string === specialCase[obj].input) {
        return specialCase[obj].output;
      }
    }
  }

  let words, acronym, nextWord;

  if (!seperator) {
    seperator = ' ';
  }
  
  words = string.split(seperator);
  acronym = "";
  var index = 0;
  while (index < words.length) {
    nextWord = words[index];
    acronym = acronym + nextWord.charAt(0);
    index = index + 1;
  }
  return acronym;
};

export default acronymize;
