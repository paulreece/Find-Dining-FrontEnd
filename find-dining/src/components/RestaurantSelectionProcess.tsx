import React, {
  useState,
  useMemo,
  useRef,
  useEffect,
  RefObject,
  CSSProperties,
} from "react";
import RestaurantCard from "../Restaurant-selection-card";
import "./RestaurantSelectionProcess.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import Button from "react-bootstrap/Button";
import angryPanda from "../images/angryPanda.png";
import hungryPanda from "../images/hungryPanda.png";

const StyledButton = styled(Button)`
  background-color: #eb1b67;
  box-shadow: none;
  border: none;
  min-width: 10px;
  &:hover {
    background-color: none;
    outline: none;
  }
  &:focus {
    box-shadow: none;
    border: none;
  }
`;

interface restaurantDB {
  name: string;
  url: string;
  pk: string;
}

interface restaurantSelectProps {
  token: string;
  mealPk: string;
}
interface restaurant {
  name: string;
  url: string;
  pk: string;
  photo_reference: string;
  id: string;
}

function RestaurantSelectionProcess({ token, mealPk }: restaurantSelectProps) {
  const [restDB, setRestDB] = useState<restaurantDB[]>([]);
  const [currentIndex, setCurrentIndex] = useState(restDB.length - 1);
  const [lastDirection, setLastDirection] = useState("");
  const [count, setCount] = useState(1);
  const [restPk, setRestPk] = useState("");
  const [answer, setAnswer] = useState("");
  const currentIndexRef = useRef(currentIndex);
  const navigate = useNavigate();
  const childRefs: RefObject<any>[] = useMemo(
    () =>
      Array(restDB.length)
        .fill(0)
        .map((i) => React.createRef()),
    [restDB.length]
  );

  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };
  const canGoBack = currentIndex < restDB.length - 1;

  const canSwipe = currentIndex >= 0;

  useEffect(() => {
    let theDB: restaurantDB[] = [];
    const options = {
      method: "GET",
      url: `https://find-dining-panda.herokuapp.com/api/meals/${mealPk}/restaurants/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };

    axios
      .request(options)
      .then(function (response) {
        response.data.map((restaurant: restaurant, index: number) => {
          return theDB.push({
            name: restaurant.name,
            url: restaurant.photo_reference,
            pk: restaurant.id,
          });
        }, setRestDB(theDB));
      })
      .catch(function (error) {
        console.error(error);
      });
  }, [token, mealPk]);

  const swiped = (
    direction: string,
    nameToDelete: string,
    index: number,
    restaurantPK: string
  ) => {
    const yesOptions = {
      method: "POST",
      url: `https://find-dining-panda.herokuapp.com/api/restaurants/${restaurantPK}/yes/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
    const noOptions = {
      method: "POST",
      url: `https://find-dining-panda.herokuapp.com/api/restaurants/${restaurantPK}/no/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
    setLastDirection(direction);
    updateCurrentIndex(index - 1);
    if (direction === "right")
      return axios
        .request(yesOptions)
        .then(function (response) {
          setAnswer("Previous Answer: Yes!");
          setTimeout(() => {
            setAnswer("");
          }, 1500);
        })
        .catch(function (error) {
          console.error(error);
        });
    return axios
      .request(noOptions)
      .then(function (response) {
        setAnswer("Previous Answer: No!");
        setTimeout(() => {
          setAnswer("");
        }, 1500);
      })
      .catch(function (error) {
        console.error(error);
      });
  };
  let testCount = 1;
  const outOfFrame = (name: string, idx: number) => {
    testCount += 1;
    setCount(testCount);

    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();

    return testCount;
  };

  const swipe = async (dir: string) => {
    if (canSwipe && currentIndex < restDB.length) {
      await childRefs[currentIndex].current.swipe(dir);

      setCount(count + 1);
    }
  };

  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    await childRefs[newIndex].current.restoreCard();
    setCount(count - 1);
  };

  const goEat = () => {
    const options = {
      method: "GET",
      url: `https://find-dining-panda.herokuapp.com/api/selected-and-match/${mealPk}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
    if (count < 10)
      return alert(
        "Sorry you must select at least 10 Restaurants before submitting!"
      );
    else
      return axios
        .request(options)
        .then(function (response) {
          navigate("/meals");
        })
        .catch(function (error) {
          console.error(error);
        });
  };

  const undo = (restaurantPK: string) => {
    const undoNoOptions = {
      method: "DELETE",
      url: `https://find-dining-panda.herokuapp.com/api/undo_no/${restaurantPK}/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
    const undoYesOptions = {
      method: "DELETE",
      url: `https://find-dining-panda.herokuapp.com/api/undo_yes/${restaurantPK}/`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    };
    if (lastDirection === "right")
      return axios
        .request(undoYesOptions)
        .then(function (response) {})
        .catch(function (error) {
          console.error(error);
        });
    return axios
      .request(undoNoOptions)
      .then(function (response) {})
      .catch(function (error) {
        console.error(error);
      });
  };

  const google1 =
    "https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photo_reference=";
  const google2 = `&key=${process.env.REACT_APP_API_KEY}`;
  return (
    <div>
      <div
        style={{
          marginBottom: -60,
        }}
        className="cardDeck"
      >
        <h2 className="emptyState">Out of Restaurants, you hungry panda!</h2>

        {restDB.map((restaurant, index) => (
          <RestaurantCard
            ref={childRefs[index]}
            className="swipe"
            key={restaurant.name}
            onSwipe={(direction: string) => {
              swiped(direction, restaurant.name, index, restaurant.pk);
              setRestPk(restaurant.pk);
            }}
            onCardLeftScreen={() => {
              outOfFrame(restaurant.name, index);
              setRestPk(restaurant.pk);
            }}
          >
            {currentIndex === -1 ? (
              <h2>Please Swipe to Start!</h2>
            ) : (
              <h3 className="cardCount">
                Choice {count} of {restDB.length}
              </h3>
            )}
            <div
              style={{
                backgroundImage:
                  "url(" + google1 + restaurant.url + google2 + ")",
              }}
              className="card"
            >
              <h3>{restaurant.name}</h3>
              <h2 className="answer">{answer}</h2>
            </div>
          </RestaurantCard>
        ))}
      </div>

      <div
        style={{
          marginBottom: 70,
          paddingLeft: 60,
          paddingRight: 60,
        }}
        className="buttons"
      >
        <div
          style={{
            backgroundColor: (!canSwipe as CSSProperties) && "white",
            color: "black",
            display: "flex",
            flexDirection: "column",
            marginBottom: "20",
          }}
          onClick={() => swipe("left")}
        >
          <img
            style={{
              width: 75,
            }}
            src={angryPanda}
            alt="panda button"
          />
          Heck No!
        </div>
        <div
          style={{
            backgroundColor: (!canSwipe as CSSProperties) && "white",
            color: "black",
            display: "flex",
            flexDirection: "column",
          }}
          onClick={() => swipe("right")}
        >
          <img
            style={{
              width: 75,
            }}
            src={hungryPanda}
            alt="panda button"
          />
          <div
            style={{
              width: 75,
            }}
          >
            Heck Yes!
          </div>
        </div>
      </div>
      <div>
        <StyledButton
          className="undoButton"
          style={{
            backgroundColor: (!canGoBack as CSSProperties) && "#eb1b67",
          }}
          onClick={() => {
            goBack();
            undo(restPk);
          }}
        >
          Undo swipe!
        </StyledButton>
        <StyledButton
          style={{
            backgroundColor: "black",
          }}
          className="undoButton"
          onClick={() => goEat()}
        >
          Let's Eat!
        </StyledButton>
      </div>
    </div>
  );
}

export default RestaurantSelectionProcess;
