const userMessages = {
    invalidWord: "invalid word",
    invalidDef: "invalid definition",
    invalidJSON: "invalid JSON",
    pageNotFound: "404 page not found",
    wordExists: "Word Already Exists. Definition changed.",
    entryAdded: (requestNum, date, dictionarySize, word, definition) => 
        `Request # ${requestNum} updated on ${date}
        <br><br>Words in dictionary ${dictionarySize}
        <br><br>New entry recorded:
        <br><br>"${word} : ${definition}"`,
    wordNotFound: (requestNum, word) =>
        `Request # ${requestNum}, word '${word}' not found!`
        
}

module.exports = userMessages;