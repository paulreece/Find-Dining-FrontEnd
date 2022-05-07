import { useEffect, useState} from "react";
import axios from "axios";
import "./MatchedPending.css";
import { useNavigate } from "react-router-dom";

interface token {
  token: string;
  mealPk: number;
  setMealPk: React.Dispatch<React.SetStateAction<number | undefined>>;
  userPk: string;
}

const MatchedPendingMeals = ({ token, mealPk, setMealPk, userPk }: token) => {
  const [db, setDB] = useState<any>([]);
  const [pendingDb, setPendingDB] = useState<any>([]);
  const navigate = useNavigate();
  const seeMatch = () => {
    navigate("/match");
  };
  useEffect(() => {
    let theDB: any = [];
    const options = {
      method: "GET",
      url: "https://find-dining-panda.herokuapp.com/api/match/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        response.data.map((restaurant: any, index: any) => {
          return theDB.push({
            id: restaurant.id,
            location: restaurant.location,
            invitees: restaurant.invitee,
            num_of_diners: restaurant.num_of_diners,
            archive: restaurant.archive,
            all_users_have_selected: restaurant.all_users_have_selected,
          });
        }, setDB(theDB));
        console.log(theDB);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [token]);
  useEffect(() => {
    let thePendingDB: any = [];
    const options = {
      method: "GET",
      url: "https://find-dining-panda.herokuapp.com/api/pending/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
        response.data.map((restaurant: any, index: any) => {
          return thePendingDB.push({
            id: restaurant.id,
            location: restaurant.location,
            invitees: restaurant.invitee,
            num_of_diners: restaurant.num_of_diners,
            archive: restaurant.archive,
            all_users_have_selected: restaurant.all_users_have_selected,
          });
        }, setPendingDB(thePendingDB));
        console.log(thePendingDB);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [token, setPendingDB]);
  const mealStart = () => {
    navigate("/");
  };

  const decline = (restaurantPk: number) => {
    const options = {
      method: "DELETE",
      url: `https://find-dining-panda.herokuapp.com/api/decline/${restaurantPk}/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        console.log(response.data);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  const selectRestaurants = (restaurant: any) => {
    setMealPk(restaurant);
    navigate("/select");
  };
  console.log(userPk);
  let pendingFalseCount = 0;
  pendingDb.map((restaurant: any, index: any) =>
    restaurant.archive === false ? (pendingFalseCount += 1) : pendingFalseCount
  );
  let matchFalseCount = 0;
  db.map((restaurant: any, index: any) =>
    restaurant.archive === false ? (matchFalseCount += 1) : matchFalseCount
  );
  const removePendingItem = (data: any, index: any) => {
    setPendingDB(data.filter((o: any, i: any) => index !== i));
  };
  const removeMatchItem = (data: any, index: any) => {
    setDB(data.filter((o: any, i: any) => index !== i));
  };
  console.log(pendingFalseCount);
  console.log(matchFalseCount);
  const refreshPendingDb = () => {
    // window.location.reload();
    let thePendingDB: any = [];
    const pendingOptions = {
      method: "GET",
      url: "https://find-dining-panda.herokuapp.com/api/pending/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    axios
      .request(pendingOptions)
      .then(function (response) {
        console.log(response.data);
        response.data.map((restaurant: any, index: any) => {
          return thePendingDB.push({
            id: restaurant.id,
            location: restaurant.location,
            invitees: restaurant.invitee,
            num_of_diners: restaurant.num_of_diners,
            archive: restaurant.archive,
            all_users_have_selected: restaurant.all_users_have_selected,
          });
        }, setPendingDB(thePendingDB));
        console.log(thePendingDB);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const refreshMatchDb = () => {
    // window.location.reload();
    let theDB: any = [];
    const matchOptions = {
      method: "GET",
      url: "https://find-dining-panda.herokuapp.com/api/match/",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    axios
      .request(matchOptions)
      .then(function (response) {
        console.log(response.data);
        response.data.map((restaurant: any, index: any) => {
          return theDB.push({
            id: restaurant.id,
            location: restaurant.location,
            invitees: restaurant.invitee,
            num_of_diners: restaurant.num_of_diners,
            archive: restaurant.archive,
            all_users_have_selected: restaurant.all_users_have_selected,
          });
        }, setDB(theDB));
        console.log(theDB);
      })
      .catch(function (error) {
        console.error(error);
      });
  };

  setTimeout(() => {
    refreshPendingDb();
    refreshMatchDb();
  }, 30000);
  return (
    <div className="matchedPendingDiv">
      <h2 className="pendingMealsH2">Upcoming Meals</h2>
      <div className="pendingMealsBig">
        {pendingFalseCount === 0 ? (
          <div>Sorry No Pending Meals</div>
        ) : (
          pendingDb.map((restaurant: any, index: any) =>
            restaurant.archive === false ? (
              <div key={restaurant.id} className="pendingMeals">
                <p
                  className="restaurantLocation"
                  onClick={() => console.log(restaurant)}
                >
                  {restaurant.location}
                </p>
                <p>{restaurant.archive}</p>
                {restaurant.all_users_have_selected.includes(userPk) ? (
                  <div>Friends Still selecting</div>
                ) : (
                  <button
                    className="pendingButton"
                    onClick={() => selectRestaurants(restaurant.id)}
                  >
                    Select Restaurants
                  </button>
                )}

                <button
                  className="xButton"
                  onClick={() => {
                    decline(restaurant.id);
                    removePendingItem(pendingDb, index);
                  }}
                >
                  X
                </button>
              </div>
            ) : (
              <></>
            )
          )
        )}
      </div>

      <h2 className="pendingMealsH2">Matched Meals</h2>
      <div className="pendingMealsMed">
        <div className="matchedMeals">
          {matchFalseCount === 0 ? (
            <div>Sorry No Matches</div>
          ) : (
            db.map((restaurant: any, index: any) =>
              restaurant.archive === false ? (
                <div key={restaurant.id} className="pendingMeals">
                  <p className="restaurantLocation">{restaurant.location}</p>
                  <button
                    className="pendingButton"
                    onClick={() => {
                      seeMatch();
                      setMealPk(restaurant.id);
                    }}
                  >
                    See Match
                  </button>
                  <button
                    className="xButton"
                    onClick={() => {
                      decline(restaurant.id);
                      removeMatchItem(db, index);
                    }}
                  >
                    X
                  </button>
                </div>
              ) : (
                <></>
              )
            )
          )}
        </div>
      </div>
      <button className="createButton" onClick={() => mealStart()}>
        Create Meal
      </button>
    </div>
  );
};

export default MatchedPendingMeals;
