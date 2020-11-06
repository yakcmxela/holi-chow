import React, { useState, useEffect, Fragment } from "react";
import {
  PetFields,
  Pet,
  Pets,
  ActivityValue,
  BodyValue,
  Stool,
  Sex,
} from "../entities/pets";
import { ChangePetArguments } from "../entities/form";
import {
  Activity,
  Habits,
  Onboarding,
  Loader,
  Profile,
  ProgressBar,
  Toppers,
} from "../components";
import {
  fetchTopperProducts,
  runRecommendationTool,
  saveCurrentPet,
  addProductsToCart,
  resetResults,
  loadCustomerPets,
  resetPendingPets,
  startNewPet,
} from "../store/actions";
import { IProductWithMetafields } from "../entities/products";
import { Recommendation } from "../components/Recommendation";
import { RecommendationResponse } from "../entities/api";
import { RootState } from "../entities/thunks";

import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import parse from "url-parse";
import { StoreActions } from "../entities/actions";
import { v4 as uuidv4 } from "uuid";

const initialPet = () => {
  return {
    [PetFields.activity]: ActivityValue.jogger,
    [PetFields.allergies]: [],
    [PetFields.birthdate]: new Date().setDate(1),
    [PetFields.body]: BodyValue.ideal,
    [PetFields.breeds]: [],
    [PetFields.neutered]: true,
    [PetFields.id]: uuidv4(),
    [PetFields.issues]: [],
    [PetFields.name]: "",
    [PetFields.picky]: 2,
    [PetFields.scraps]: 1,
    [PetFields.sex]: Sex.male,
    [PetFields.stool]: Stool.good,
    [PetFields.topper]: "",
    [PetFields.treats]: 1,
    [PetFields.weight]: 25,
  };
};

export const PetForm = ({}) => {
  const dispatch = useDispatch();
  const loading = useSelector<RootState, boolean>(
    (state) => state.ProductsReducer.loading
  );
  const pets = useSelector<RootState, Pets>((state) => state.PetsReducer.pets);
  const pendingPets = useSelector<RootState, Pets>(
    (state) => state.PetsReducer.pendingPets
  );
  const persistedActiveSection = useSelector<RootState, number>(
    (state) => state.PetsReducer.persistedActiveSection
  );
  const persistedPet = useSelector<RootState, Pet>(
    (state) => state.PetsReducer.persistedPet
  );
  const recommendations = useSelector<
    RootState,
    Array<RecommendationResponse> | undefined
  >((state) => state.ProductsReducer.recommendations);
  const toppers = useSelector<RootState, Array<IProductWithMetafields>>(
    (state) => state.ProductsReducer.toppers
  );

  const [activeSection, setActiveSection] = useState<number>(
    persistedActiveSection
  );
  const [didRequestResults, setDidRequestResults] = useState<boolean>(false);
  const [pet, setPet] = useState<Pet>(initialPet());

  const handleAddToCart = () => {
    dispatch(addProductsToCart());
  };

  const handleChangePet = ({ value, field, index }: ChangePetArguments) => {
    let updatedPet = { ...pet };
    if (field === PetFields.breeds) {
      if (typeof index !== "undefined") {
        const breedsArray =
          updatedPet.breeds.length > 0
            ? updatedPet.breeds.map((breed, i) => {
                if (index === i) {
                  return value;
                }
                return breed;
              })
            : [value];
        updatedPet = {
          ...updatedPet,
          [field]: breedsArray,
        };
      }
    } else if (field === PetFields.issues || field === PetFields.allergies) {
      if (value === "None") {
        updatedPet[field] = ["None"];
      } else if (!updatedPet[field].includes(value)) {
        updatedPet[field] = [...updatedPet[field], value];
      } else {
        updatedPet[field] = updatedPet[field].filter((item) => {
          return item !== value;
        });
      }
      if (value !== "None") {
        updatedPet[field] = updatedPet[field].filter((item) => item !== "None");
      }
    } else {
      updatedPet = {
        ...updatedPet,
        [field]: value,
      };
    }
    setPet(updatedPet);
  };

  const handleRequestResults = () => {
    if (window) {
      window.scrollTo(0, 0);
    }
    setDidRequestResults(true);
    dispatch(resetResults());
    dispatch(saveCurrentPet(pet, activeSection + 1));
    if (
      (window && window.hasOwnProperty("customerId")) ||
      (process.env.NODE_ENV === "development" &&
        process.env.REACT_APP_CUSTOMER_ID)
    ) {
      dispatch(
        runRecommendationTool(
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_CUSTOMER_ID
            : // @ts-ignore
              window.customerId
        )
      );
      setActiveSection(5);
    } else {
      const shouldRedirect = window.localStorage.getItem("redirectToForm");
      if (!shouldRedirect || shouldRedirect === "") {
        window.localStorage.setItem("redirectToForm", "/pages/my-pet-profile");
      }
      const login = document.querySelector("#modal-form");
      if (login) {
        login.classList.add("active");
      }
    }
  };

  const handleResetPet = () => {
    dispatch(resetPendingPets());
  };

  const handleSavePet = () => {
    if (window) {
      window.scrollTo(0, 0);
    }
    dispatch(saveCurrentPet(pet, activeSection + 1));
  };

  const handleStartNewPet = () => {
    dispatch(saveCurrentPet(pet, activeSection));
    dispatch(startNewPet());
    setPet(initialPet());
  };

  const renderForm = () => {
    switch (activeSection) {
      case 0:
        return (
          <Onboarding
            pet={pet}
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onResetPet={handleResetPet}
            onSavePet={handleSavePet}
          />
        );
      case 1:
        return (
          <Profile
            pet={pet}
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onSavePet={handleSavePet}
          />
        );
      case 2:
        return (
          <Activity
            pet={pet}
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onSavePet={handleSavePet}
          />
        );
      case 3:
        return (
          <Habits
            pet={pet}
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onSavePet={handleSavePet}
          />
        );
      case 4:
        return (
          <Toppers
            pet={pet}
            pendingPets={pendingPets}
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onRequestResults={handleRequestResults}
            onStartNewPet={handleStartNewPet}
            toppers={toppers}
          />
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (pets.length) {
      const { query } = parse(window.location.href, true);
      const petId = _.get(query, "petId", null);
      if (petId) {
        const nowEditting = pets.filter((pet) => petId === pet.id);
        if (nowEditting.length) {
          dispatch({
            type: StoreActions.StartFromSaved,
            payload: nowEditting[0],
          });
          setActiveSection(0);
          setPet(nowEditting[0]);
        }
      }
    }
  }, [pets]);

  useEffect(() => {
    dispatch(fetchTopperProducts());
    if (
      (window && window.hasOwnProperty("customerId")) ||
      (process.env.NODE_ENV === "development" &&
        process.env.REACT_APP_CUSTOMER_ID)
    ) {
      dispatch(
        loadCustomerPets(
          process.env.NODE_ENV === "development"
            ? process.env.REACT_APP_CUSTOMER_ID
            : // @ts-ignore
              window.customerId
        )
      );
    }
    if (persistedPet) {
      setPet({ ...persistedPet });
    }
    if (persistedActiveSection) {
      setActiveSection(persistedActiveSection);
      if (persistedActiveSection === 5) {
        if (window && window.hasOwnProperty("customerId")) {
          // @ts-ignore
          dispatch(runRecommendationTool(window.customerId));
          setDidRequestResults(true);
        } else {
          setActiveSection(4);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.log("PETS");
      console.log(pets);
      console.log("PENDING PETS");
      console.log(pendingPets);
      console.log("PERSISTED PETS");
      console.log(pendingPets);
      console.log("PET");
      console.log(pet);
      console.log("ACTIVE INDEX");
      console.log(activeSection);
    }
  });

  return (
    <div className="container">
      <ProgressBar
        progress={activeSection}
        onNavigateForm={setActiveSection}
        onSavePet={handleSavePet}
      />
      {loading ? (
        <Loader />
      ) : (
        <Fragment>
          {(!recommendations || !didRequestResults) && (
            <Fragment>
              <form>{renderForm()}</form>
            </Fragment>
          )}
          {didRequestResults && recommendations && (
            <div
              className="pet-profile-form-nav"
              style={{ textAlign: "right" }}
            >
              <a
                className="button-text"
                onClick={() => {
                  setActiveSection(4);
                  setDidRequestResults(false);
                }}
              >
                <i className="fa fa-angle-left"></i> Back
              </a>
            </div>
          )}
          {didRequestResults &&
            recommendations &&
            recommendations.map((recommendation, index) => {
              return (
                <Recommendation
                  key={index}
                  kibble={recommendation.kibble}
                  defaultOpen={recommendations.length === 1}
                  pet={recommendation.pet}
                  recommendation={recommendation.recommendation}
                  topper={recommendation.topper}
                />
              );
            })}
          {didRequestResults && recommendations && recommendations.length && (
            <div style={{ textAlign: "center" }}>
              <button className="button" onClick={handleAddToCart}>
                Add to Cart
              </button>
            </div>
          )}
        </Fragment>
      )}
    </div>
  );
};
