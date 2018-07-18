// database

// Single source of truth is the statement string

const currentStatement =
  "Today’s press conference in Helsinki was one of the most disgraceful performances by an American president in memory. The damage inflicted by President Trump’s naiveté, egotism, false equivalence, and sympathy for autocrats is difficult to calculate. But it is clear that the summit in Helsinki was a tragic mistake. President Trump proved not only unable, but unwilling to stand up to Putin. He and Putin seemed to be speaking from the same script as the president made a conscious choice to defend a tyrant against the fair questions of a free press, and to grant Putin an uncontested platform to spew propaganda and lies to the world. It is tempting to describe the press conference as a pathetic rout — as an illustration of the perils of under-preparation and inexperience. But these were not the errant tweets of a novice politician. These were the deliberate choices of a president who seems determined to realize his delusions of a warm relationship with Putin’s regime without any regard for the true nature of his rule, his violent disregard for the sovereignty of his neighbors, his complicity in the slaughter of the Syrian people, his violation of international treaties, and his assault on democratic institutions throughout the world. Coming close on the heels of President Trump’s bombastic and erratic conduct towards our closest friends and allies in Brussels and Britain, today’s press conference marks a recent low point in the history of the American Presidency. That the president was attended in Helsinki by a team of competent and patriotic advisors makes his blunders and capitulations all the more painful and inexplicable. No prior president has ever abased himself more abjectly before a tyrant. Not only did President Trump fail to speak the truth about an adversary; but speaking for America to the world, our president failed to defend all that makes us who we are — a republic of free people dedicated to the cause of liberty at home and abroad. American presidents must be the champions of that cause if it is to succeed. Americans are waiting and hoping for President Trump to embrace that sacred responsibility. One can only hope they are not waiting totally in vain. - John McCain";

// using document.getSelection() offsets, the position of each highlight within the statement string is recorded as an annotation record
// these are loaded into state:

let annotationId = 1004;

const currentAnnotations = [
  { id: "1001", start: 41, end: 116 }, // one of the most disgraceful performances by an American president in memory
  { id: "1003", start: 393, end: 448 }, // He and Putin seemed to be speaking from the same script
  { id: "1002", start: 251, end: 315 }, // But it is clear that the summit in Helsinki was a tragic mistake
  { id: "1004", start: 419, end: 489 } // speaking from the same script as the president made a conscious choice
];

// selectors

const statementBody = () => {
  return document.querySelector(".statement");
};

const applyHighlightsButton = () => {
  return document.querySelector(".highlighter");
};

// listeners

const highlightListener = () => {
  applyHighlightsButton().addEventListener("click", e => highlightBody());
};

const statementMouseupListener = () => {
  statementBody().addEventListener("mouseup", getSelectionInfo);
};

// insert statement

const insertStatement = () => {
  statementBody().innerText = currentStatement;
};

// grab selection

const getSelectionInfo = () => {
  const selection = document.getSelection();
  if (
    selection.extentOffset - selection.baseOffset > 0 &&
    selection.baseNode.previousElementSibling
  ) {
    const base = selection.baseOffset;
    const extent = selection.extentOffset;
    const prevAnnotationId =
      selection.baseNode.previousElementSibling.attributes.name.value;
    const prevAnnotation = currentAnnotations.find(
      annotation => annotation.id == prevAnnotationId
    );
    const newAnnotation = {
      id: ++annotationId,
      start: prevAnnotation.end + base,
      end: prevAnnotation.end + extent
    };
    currentAnnotations.push(newAnnotation);
  } else if (
    selection.extentOffset - selection.baseOffset > 0 &&
    !selection.baseNode.previousElementSibling
  ) {
    console.log(selection);
    const newAnnotation = {
      id: ++annotationId,
      start: selection.baseOffset,
      end: selection.extentOffset
    };
    currentAnnotations.push(newAnnotation);
  } else {
    console.log("invalid or no selection");
  }
};

// Process annotations into highlight spans

let currentHighlights = [];

const processAnnotations = () => {
  currentHighlights = [];
  let lastEnd = 0;
  currentAnnotations.sort((a, b) => a.start > b.start);
  statementBody().innerHTML = currentStatement;
  currentAnnotations.forEach(annotation => {
    if (annotation.start > lastEnd) {
      let newHighlight = {
        name: annotation.id,
        start: annotation.start,
        end: annotation.end
      };
      currentHighlights.push(newHighlight);
      lastEnd = annotation.end;
    } else {
      console.log("overlap detected!");
      let lastHighlight = currentHighlights.pop();
      lastHighlightPrevEnd = lastHighlight.end;
      lastHighlight.end = annotation.start;
      currentHighlights.push(lastHighlight);
      let overlapHighlight = {
        name: `${lastHighlight.name} ${annotation.id}`,
        start: annotation.start,
        end: lastHighlightPrevEnd
      };
      currentHighlights.push(overlapHighlight);
      let newHighlight = {
        name: annotation.id,
        start: lastHighlightPrevEnd,
        end: annotation.end
      };
      currentHighlights.push(newHighlight);
      lastEnd = annotation.end;
    }
  });
};

// highlighting

const highlightBody = () => {
  processAnnotations();
  let spanCounter = 0;
  currentHighlights.forEach(highlight => {
    let span = spanMaker(highlight, spanCounter);
    statementBody().innerHTML = span.html;
    spanCounter += span.length;
  });
};

const spanMaker = (highlight, spanCounter) => {
  const start = highlight.start + spanCounter;
  const end = highlight.end + spanCounter;
  const body = statementBody().innerHTML;
  const pre = body.slice(0, start);
  const spanOpen = `<span class='highlight' name='${highlight.name}'>`;
  const spanString = body.slice(start, end);
  const spanEnd = "</span>";
  const post = body.slice(end);
  return {
    html: pre.concat(spanOpen, spanString, spanEnd, post),
    length: (spanOpen + spanEnd).length
  };
};

// DOMContentLoaded

document.addEventListener("DOMContentLoaded", () => {
  insertStatement();
  highlightListener();
  statementMouseupListener();
});
