import React from "react";
import { Link } from "react-router-dom";
import ExerciseProgressGraph from "./ExerciseProgressGraph";

import "./ExerciseProgressList.css";

const ExerciseProgressList = (props) => {
  const { workoutData } = props;
  const exerciseWeightsArray = workoutData[0].exerciseWeights;

  return (
    <React.Fragment>
      <h3 className="page-title">Exercise Progress</h3>
      <div className="exercise-graph-list">
        {exerciseWeightsArray.map((exercise, index) => {
          return (
            <ExerciseProgressGraph
              workoutData={workoutData}
              exerciseId={exercise.exerciseId}
              key={exercise.exerciseId}
              name={exercise.exerciseName}
            />
          );
        })}
      </div>
      <div className="btn-container back-btn">
        <Link exact to={"/myworkouts"}>
          <button>BACK TO MY WORKOUTS</button>
        </Link>
      </div>
    </React.Fragment>
  );
};

export default ExerciseProgressList;
