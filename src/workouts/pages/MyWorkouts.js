import React, { useEffect, useContext, useState } from "react";
import { Link } from "react-router-dom";

import useHttpClientCustomHook from "../../shared/hooks/useHttpClientCustomHook";
import AuthContext from "../../shared/context/auth-context";
import UserWorkoutList from "../components/UserWorkoutList";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import Card from "../../shared/components/UIElements/Card";

import "./MyWorkout.css";

const MyWorkouts = () => {
  const { error, isLoading, sendRequest, clearError } =
    useHttpClientCustomHook();

  const [userWorkouts, setUserWorkouts] = useState(undefined);

  const [isViewingArchivedWorkouts, setIsViewingArchivedWorkouts] =
    useState(false);

  const auth = useContext(AuthContext);

  const deleteWorkoutHandler = async (workoutId) => {
    console.log(workoutId);
    try {
      await sendRequest(
        `http://localhost:5000/api/workouts/${workoutId}`,
        "DELETE",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const newUserWorkoutArray = userWorkouts.filter((workout) => {
        return workoutId !== workout._id;
      });
      setUserWorkouts(newUserWorkoutArray);
    } catch (err) {}
  };

  const archiveWorkout = async (workoutId) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/workouts/archive/${workoutId}`,
        "PUT",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const newUserWorkoutArray = userWorkouts.filter((workout) => {
        return workoutId !== workout._id;
      });
      setUserWorkouts(newUserWorkoutArray);
    } catch (e) {}
  };

  const unArchiveWorkout = async (workoutId) => {
    try {
      const responseData = await sendRequest(
        `http://localhost:5000/api/workouts/unarchive/${workoutId}`,
        "PUT",
        null,
        {
          Authorization: "Bearer " + auth.token,
        }
      );
      const newUserWorkoutArray = userWorkouts.filter((workout) => {
        return workoutId !== workout._id;
      });
      setUserWorkouts(newUserWorkoutArray);
    } catch (e) {}
  };

  const viewActiveWorkouts = () => {
    setIsViewingArchivedWorkouts(false);
  };

  const viewArchivedWorkouts = () => {
    setIsViewingArchivedWorkouts(true);
  };

  useEffect(() => {
    const fetchMyWorkouts = async () => {
      try {
        const responseData = await sendRequest(
          "http://localhost:5000/api/workouts/",
          "GET",
          null,
          {
            Authorization: "Bearer " + auth.token,
          }
        );
        console.log(responseData.foundWorkouts);
        setUserWorkouts([...responseData.foundWorkouts]);
      } catch (e) {
        console.log(e);
      }
    };

    fetchMyWorkouts();
  }, [auth.token, sendRequest, isViewingArchivedWorkouts]);

  return (
    <React.Fragment>
      {isLoading && <LoadingSpinner />}
      {error && <ErrorModal error={error} clearError={clearError} />}
      {userWorkouts && (
        <div className="navigation-btn-container">
          <h3>{"Navigate to:"}</h3>
          <div className="navigation-btns">
            <button
              className={
                isViewingArchivedWorkouts ? "not-active-page" : "active-page"
              }
              onClick={viewActiveWorkouts}
            >
              ACTIVE WORKOUTS
            </button>
            <button
              className={
                isViewingArchivedWorkouts ? "active-page" : "not-active-page"
              }
              onClick={viewArchivedWorkouts}
            >
              ARCHIVED WORKOUTS
            </button>
          </div>
        </div>
      )}
      {userWorkouts &&
        userWorkouts.length === 0 &&
        !isViewingArchivedWorkouts && (
          <Card className="no-workout-message btn-container">
            <p>
              You currently have no active workouts. To view active workouts
              please create one.
            </p>
            <button className="add-workout-btn">
              <Link exact to="/workouts/new">
                ADD WORKOUT
              </Link>
            </button>
          </Card>
        )}
      {userWorkouts && (
        <UserWorkoutList
          userWorkouts={userWorkouts}
          deleteHandler={deleteWorkoutHandler}
          archiveWorkout={archiveWorkout}
          unArchiveWorkout={unArchiveWorkout}
          isViewingArchivedWorkouts={isViewingArchivedWorkouts}
        />
      )}
    </React.Fragment>
  );
};

export default MyWorkouts;
