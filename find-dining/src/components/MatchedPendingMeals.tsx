import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import "./MatchedPending.css";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import styled from "styled-components";
// import Form from "react-bootstrap/Form";
// import hungryPanda from "../images/hungryPanda.png";
// import speechBubble2 from "../images/speechBubble2.png";

const StyledButton = styled(Button)`
  background-color: #eb1b67;
  box-shadow: none;

  border: none;
  min-width: 10px;
  &:hover {
    background-color: #eb1b67;
    outline: none;
  }
  &:focus {
    box-shadow: none;
    border: none;
  }
`;

const Span = styled.span`
  color: #eb1b67;
  font: Lato;
  font-weight: bold;
`;

const Container = styled.div`
  padding: 50px;
  display: flex;
  flex-direction: column;
`;

// const Blurb = styled.div`
//   text-align: center;
//   margin: 10px;
//   padding: 25px;
// `;

interface matchedPendingProps {
  token: string;
  mealPk: string;
  setMealPk: React.Dispatch<React.SetStateAction<string>>;
  userPk: string;
}
interface restaurant {
  id: number;
  location: string;
  invitee_names: string;
  num_of_diners: string;
  archive: boolean;
  all_users_have_selected: string;
  created_date: string;
}

const MatchedPendingMeals = ({
  token,
  mealPk,
  setMealPk,
  userPk,
}: matchedPendingProps) => {
  const [db, setDB] = useState<restaurant[]>([]);
  const [pendingDb, setPendingDB] = useState<restaurant[]>([]);
  const navigate = useNavigate();
  const seeMatch = () => {
    navigate("/match");
  };
  useEffect(() => {
    let theDB: restaurant[] = [];
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
        response.data.map((restaurant: restaurant, index: number) => {
          return theDB.push({
            id: restaurant.id,
            location: restaurant.location,
            invitee_names: restaurant.invitee_names,
            num_of_diners: restaurant.num_of_diners,
            archive: restaurant.archive,
            all_users_have_selected: restaurant.all_users_have_selected,
            created_date: restaurant.created_date,
          });
        }, setDB(theDB));
        console.log(theDB);
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [token]);
  useEffect(() => {
    let thePendingDB: restaurant[] = [];
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
        response.data.map((restaurant: restaurant, index: number) => {
          return thePendingDB.push({
            id: restaurant.id,
            location: restaurant.location,
            invitee_names: restaurant.invitee_names,
            num_of_diners: restaurant.num_of_diners,
            archive: restaurant.archive,
            all_users_have_selected: restaurant.all_users_have_selected,
            created_date: restaurant.created_date,
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

  const selectRestaurants = (restaurant: SetStateAction<string>) => {
    setMealPk(restaurant);
    navigate("/select");
  };
  console.log(userPk);
  let pendingFalseCount = 0;
  pendingDb.map((restaurant: restaurant, index: number) =>
    restaurant.archive === false ? (pendingFalseCount += 1) : pendingFalseCount
  );
  let matchFalseCount = 0;
  db.map((restaurant: restaurant, index: number) =>
    restaurant.archive === false ? (matchFalseCount += 1) : matchFalseCount
  );
  const removePendingItem = (data: restaurant[], index: number) => {
    setPendingDB(data.filter((o, i) => index !== i));
  };
  const removeMatchItem = (data: restaurant[], index: number) => {
    setDB(data.filter((o, i) => index !== i));
  };
  console.log(pendingFalseCount);
  console.log(matchFalseCount);
  const refreshPendingDb = () => {
    let thePendingDB: restaurant[] = [];
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
        response.data.map((restaurant: restaurant, index: number) => {
          return thePendingDB.push({
            id: restaurant.id,
            location: restaurant.location,
            invitee_names: restaurant.invitee_names,
            num_of_diners: restaurant.num_of_diners,
            archive: restaurant.archive,
            all_users_have_selected: restaurant.all_users_have_selected,
            created_date: restaurant.created_date,
          });
        }, setPendingDB(thePendingDB));
        console.log(thePendingDB);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  const refreshMatchDb = () => {
    let theDB: restaurant[] = [];
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
        response.data.map((restaurant: restaurant, index: number) => {
          return theDB.push({
            id: restaurant.id,
            location: restaurant.location,
            invitee_names: restaurant.invitee_names,
            num_of_diners: restaurant.num_of_diners,
            archive: restaurant.archive,
            all_users_have_selected: restaurant.all_users_have_selected,
            created_date: restaurant.created_date,
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
    <Container>
      <Span>
        <div className="matchedPendingDiv">
          <h3 className="pendingMealsH2">Upcoming Meals</h3>
          <div className="pendingMealsBig">
            {pendingFalseCount === 0 ? (
              <div>Sorry No Pending Meals</div>
            ) : (
              pendingDb.map((restaurant: restaurant, index: number) =>
                restaurant.archive === false ? (
                  <div key={restaurant.id} className="pendingMeals">
                    <p
                      style={{
                        color: "black",
                        marginBottom: 3,
                      }}
                      className="restaurantLocation"
                      onClick={() => console.log(restaurant)}
                    >
                      City: {restaurant.location}
                      <br></br>
                      Attendee(s): {restaurant.invitee_names}
                      <br></br>
                      Date Added: {restaurant.created_date}
                    </p>
                    <p>{restaurant.archive}</p>
                    {restaurant.all_users_have_selected.includes(userPk) ? (
                      <div
                        style={{
                          color: "black",
                        }}
                      >
                        Friends Still selecting
                      </div>
                    ) : (
                      <StyledButton
                        className="pendingButton"
                        onClick={() =>
                          selectRestaurants(restaurant.id.toString())
                        }
                      >
                        Select Restaurants
                      </StyledButton>
                    )}

                    <p
                      style={{
                        backgroundColor: "black",
                        width: "20px",
                        textAlign: "center",
                      }}
                      className="xButton"
                      onClick={() => {
                        decline(restaurant.id);
                        removePendingItem(pendingDb, index);
                      }}
                    >
                      X
                    </p>
                  </div>
                ) : (
                  <></>
                )
              )
            )}
          </div>

          <h3
            style={{
              paddingTop: 30,
            }}
            className="pendingMealsH2"
          >
            Matched Meals
          </h3>
          <div className="pendingMealsMed">
            <div className="matchedMeals">
              {matchFalseCount === 0 ? (
                <div>Sorry No Matches</div>
              ) : (
                db.map((restaurant: restaurant, index: number) =>
                  restaurant.archive === false ? (
                    <div key={restaurant.id} className="pendingMeals">
                      <p
                        style={{
                          color: "black",
                          marginBottom: 3,
                        }}
                        className="restaurantLocation"
                      >
                        City: {restaurant.location}
                        <br></br>
                        Attendee(s): {restaurant.invitee_names}
                        <br></br>
                        Date Added: {restaurant.created_date}
                      </p>
                      <StyledButton
                        className="pendingButton"
                        onClick={() => {
                          seeMatch();
                          setMealPk(restaurant.id.toString());
                        }}
                      >
                        See Match
                      </StyledButton>
                      <p
                        style={{
                          backgroundColor: "black",
                          width: "20px",
                          textAlign: "center",
                        }}
                        className="xButton"
                        onClick={() => {
                          decline(restaurant.id);
                          removeMatchItem(db, index);
                        }}
                      >
                        X
                      </p>
                    </div>
                  ) : (
                    <></>
                  )
                )
              )}
            </div>
          </div>
        </div>
      </Span>
      <StyledButton
        className="text-center"
        style={{
          marginTop: 50,
          width: 150,
          backgroundColor: "black",
        }}
        onClick={() => mealStart()}
      >
        Create Meal
      </StyledButton>
    </Container>
  );
};

export default MatchedPendingMeals;
