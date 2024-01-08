import b_ from "b_";
import { useStore } from "effector-react";
import { useState } from "react";
import {
  $stopWords,
  deleteStopWords,
  postStopWords,
} from "../../store/StopWords";
import { ErrNot } from "../NotificationService";
import "./index.scss";

export const b = b_.with("stop-words-section");

const StopWordsSection = () => {
  const [newWord, setNewWord] = useState("");
  const stopWords = useStore($stopWords);

  const postPending = useStore(postStopWords.pending);
  const deletePending = useStore(deleteStopWords.pending);
  const pending = postPending || deletePending;

  const inputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewWord(e.currentTarget.value);
  };

  const addHandler = () => {
    if (!newWord.length) ErrNot("Input is empty");
    else if (stopWords.includes(newWord)) ErrNot("Word is already added");
    else {
      setNewWord("");
      postStopWords(newWord);
    }
  };

  const deleteHandler = (wordIndex: number) => {
    if (pending) {
      return ErrNot(
        "Deletion is not possible, there is already a request in processing"
      );
    }

    deleteStopWords(stopWords[wordIndex]);
  };

  return (
    <section className={b()}>
      <h2 className={b("title")}>Stop Words:</h2>
      <div className={b("input-wrapper")}>
        <input
          value={newWord}
          onChange={inputChange}
          placeholder="enter a new word here"
          className="BaseInputString"
        ></input>
        <button onClick={addHandler} className="base-button" disabled={pending}>
          {pending ? "Loading ..." : "Add word"}
        </button>
      </div>
      {stopWords.length ? (
        <div className={b("words")}>
          {stopWords.map((word, i) => {
            return (
              <span
                key={word}
                onClick={() => deleteHandler(i)}
                className={b("words__word")}
              >
                {word}
              </span>
            );
          })}
        </div>
      ) : (
        <></>
      )}
    </section>
  );
};

export default StopWordsSection;
