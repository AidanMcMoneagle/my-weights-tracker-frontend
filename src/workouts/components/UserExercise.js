import React, { useState, useEffect } from "react";
import { AiOutlineCheck } from "react-icons/ai";
import { BsYoutube } from "react-icons/bs";

import { ImInfo } from "react-icons/im";
import ExerciseInstructionModal from "./ExerciseInstructionModal";
import ExerciseVideoModal from "./ExerciseVideoModal";

import "./UserExercise.css";

const UserExercise = (props) => {
  const { name, sets, reps, _id, instructions } = props.exercise;
  const {
    passNumberOfSetInputs,
    numberOfSetHeaders,
    inTrackingMode,
    onInput,
    maxSetNumber,
  } = props;

  const [instructionModalOpen, setInstructionModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);

  const [numberofEmptySetInputs, setNumberOfEmptySetInputs] = useState([]);

  //state for number of sets for each exercise. We map over array and for each element (set) we return a form input.
  const [numberOfSetInputs, setNumberOfSetInputs] = useState([]);

  //contains state of the form inputs. Contains the user input values.
  const [inputState, setInputState] = useState([]);

  //Used to conditionally apply styling and enable button to send data to parent.
  const [isSetInputPopulated, setIsSetInputPopulated] = useState(false);

  const [isInputsReadOnly, setisInputsReadOnly] = useState(false);

  useEffect(() => {
    const numberEmptySetColumns = maxSetNumber - sets;
    if (numberEmptySetColumns > 0) {
      let emptySetInputArray = [];
      for (let i = 0; i < numberEmptySetColumns; i++) {
        emptySetInputArray.push("emptyinput");
      }
      setNumberOfEmptySetInputs(emptySetInputArray);
    }
  }, [maxSetNumber, sets]);

  useEffect(() => {
    if (!numberOfSetHeaders.length > 0) {
      let inputArray = [];
      const setInputs = (sets) => {
        for (let i = 0; i < parseInt(sets); i++) {
          inputArray.push("Input");
        }
        return setNumberOfSetInputs(inputArray);
      };
      setInputs(sets);
    } else {
      return;
    }
  }, [numberOfSetInputs, sets, numberOfSetHeaders.length]);

  useEffect(() => {
    if (numberOfSetInputs.length > 0) {
      passNumberOfSetInputs(numberOfSetInputs);
    } else {
      return;
    }
  }, [numberOfSetInputs, passNumberOfSetInputs]);

  //need to set the length of the inputState array initially to be equal to the number of sets.
  useEffect(() => {
    const createInputArray = (sets) => {
      let inputArray = [];
      for (let i = 0; i < parseInt(sets); i++) {
        inputArray.push("");
      }
      return setInputState(inputArray);
    };
    createInputArray(sets);
  }, [sets]); // changed dep array to sets

  // when the inputState changes we check if all inputs have been populated.
  useEffect(() => {
    const areAllSetInputsPopulated = () => {
      let tracker = true;
      inputState.map((input) => {
        if (!input) {
          return (tracker = false);
        } else {
          return tracker;
        }
      });
      return setIsSetInputPopulated(tracker);
    };
    areAllSetInputsPopulated();
  }, [inputState]);

  const changeHandler = (index, e) => {
    const inputValue = e.target.value;
    setInputState((prevState) => {
      const newArray = prevState.map((el, currIndex) => {
        if (currIndex !== index) {
          return el;
        } else {
          return inputValue;
        }
      });
      return newArray;
    });
  };

  // passes the state of the set inputs to parent. Once we have passed data to parent we set the inputs to be read only so these cannot be edited.
  const passDataToParent = (e) => {
    e.preventDefault();
    onInput(_id, inputState, name);
    setisInputsReadOnly(true);
    //set input is populated however we must change back to false so we cannot re-submit data
    setIsSetInputPopulated(false);
  };

  const openInstructionModal = (e) => {
    e.preventDefault();
    setInstructionModalOpen(true);
  };

  const closeInstructionModal = () => {
    setInstructionModalOpen(false);
  };

  const openVideoModal = (e) => {
    e.preventDefault();
    setVideoModalOpen(true);
  };

  const closeVideoModal = () => {
    setVideoModalOpen(false);
  };

  return (
    <React.Fragment>
      {instructionModalOpen && (
        <ExerciseInstructionModal
          instructions={instructions}
          closeInstructionModal={closeInstructionModal}
          exerciseName={name}
        />
      )}
      {videoModalOpen && (
        <ExerciseVideoModal
          closeVideoModal={closeVideoModal}
          exerciseName={name}
        />
      )}
      <td className="exercise-name-column">
        {name}{" "}
        {instructions && !inTrackingMode && (
          <span>
            <button
              className="exercise-info-btn"
              onClick={openInstructionModal}
            >
              <ImInfo />
            </button>
          </span>
        )}
        {/* {!inTrackingMode && (
          <span>
            <button className="exercise-video-btn" onClick={openVideoModal}>
              <BsYoutube />
            </button>
          </span>
        )} */}
      </td>
      <td>{reps}</td>
      {!inTrackingMode && <td>{sets}</td>}
      {inTrackingMode &&
        numberOfSetInputs.length > 0 &&
        numberOfSetInputs.map((input, index) => {
          return (
            <td className="track-input" key={index}>
              <input
                type="number"
                value={inputState[index]}
                onChange={(e) => changeHandler(index, e)}
                readOnly={isInputsReadOnly ? true : false}
                className={isInputsReadOnly ? "fill-input" : "input"}
              ></input>
            </td>
          );
        })}

      {inTrackingMode &&
        numberOfSetInputs.length > 0 &&
        numberofEmptySetInputs.length > 0 &&
        numberofEmptySetInputs.map((el, index) => {
          return <td key={index}></td>;
        })}

      {inTrackingMode && numberOfSetInputs.length > 0 && (
        <td>
          <button
            className={"track-exercise-btn"}
            disabled={!isSetInputPopulated}
            onClick={(e) => passDataToParent(e)}
          >
            <AiOutlineCheck />
          </button>
        </td>
      )}
      {!inTrackingMode && (
        <td>
          <button className="exercise-video-btn" onClick={openVideoModal}>
            <BsYoutube />
          </button>
        </td>
      )}
    </React.Fragment>
  );
};

export default UserExercise;
