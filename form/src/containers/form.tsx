import React, { useState, useEffect, Fragment, ChangeEvent } from 'react';
import {
  PetFields,
  Pet,
  Pets,
  ActivityValue,
  BodyValue,
  Stool,
  Sex,
} from '../entities/pets';
import { ChangePetArguments } from '../entities/form';
import {
  Activity,
  Habits,
  Onboarding,
  Loader,
  Profile,
  ProgressBar,
  Toppers,
} from '../components';
import {
  fetchTopperProducts,
  runRecommendationTool,
  addProductsToCart,
  loadCustomerPets,
  savePetsToCustomer,
} from '../store/actions';
import { IProductWithMetafields } from '../entities/products';
import { Recommendation } from '../components/Recommendation';
import { RecommendationResponse } from '../entities/api';
import { RootState } from '../entities/thunks';

import _ from 'lodash';
import { useSelector, useDispatch } from 'react-redux';
import parse from 'url-parse';
import { StoreActions } from '../entities/actions';
import { v4 as uuidv4 } from 'uuid';

const initialPet = () => {
  return {
    [PetFields.ACTIVITY]: ActivityValue.JOGGER,
    [PetFields.ALLERGIES]: [],
    [PetFields.BIRTHDATE]: new Date().setDate(1),
    [PetFields.BODY]: BodyValue.IDEAL,
    [PetFields.BREEDS]: [],
    [PetFields.NEUTERED]: true,
    [PetFields.ID]: uuidv4(),
    [PetFields.ISSUES]: [],
    [PetFields.NAME]: '',
    [PetFields.PICKY]: 2,
    [PetFields.SCRAPS]: 1,
    [PetFields.SEX]: Sex.MALE,
    [PetFields.STOOL]: Stool.GOOD,
    [PetFields.TOPPER]: '',
    [PetFields.TREATS]: 1,
    [PetFields.WEIGHT]: 25,
  };
};

export const PetForm = ({}) => {
  const dispatch = useDispatch();
  const canSavePersisted = useSelector<RootState, boolean>(
    (state) => state.PetsReducer.canSavePersisted
  );
  const loading = useSelector<RootState, boolean>(
    (state) => state.ProductsReducer.loading || state.PetsReducer.loading
  );
  const pets = useSelector<RootState, Pets>((state) => state.PetsReducer.pets);
  const pendingPets = useSelector<RootState, Pets>(
    (state) => state.PetsReducer.pendingPets
  );
  const recommendations = useSelector<RootState, Array<RecommendationResponse>>(
    (state) => state.ProductsReducer.recommendations
  );
  const toppers = useSelector<RootState, Array<IProductWithMetafields>>(
    (state) => state.ProductsReducer.toppers
  );

  const [activeSection, setActiveSection] = useState<number>(0);
  const [didRequestResults, setDidRequestResults] = useState<boolean>(false);
  const [pet, setPet] = useState<Pet>(initialPet());
  const [shouldSavePersisted, setShouldSavePersisted] = useState<boolean>(
    false
  );

  const authInit = (): void => {
    const shouldRedirect = window.localStorage.getItem('redirectToForm');
    if (!shouldRedirect || shouldRedirect === '') {
      window.localStorage.setItem('redirectToForm', '/pages/my-pet-profile');
    }
    const toPersist = [...pendingPets];
    let pendingHasCurrent = false;
    pendingPets.forEach((p, i) => {
      if (pet.id === p.id) {
        toPersist[i] = pet;
        pendingHasCurrent = true;
      }
    });
    if (!pendingHasCurrent) {
      toPersist.push(pet);
    }
    window.localStorage.setItem(
      'persistedPets',
      JSON.stringify({ pets: toPersist, activeSection })
    );
    const login = document.querySelector('#modal-form');
    if (login) {
      login.classList.add('active');
    }
  };

  const authIsValid = (): boolean => {
    if (window && window.hasOwnProperty('customerId')) {
      return true;
    } else if (
      process.env.NODE_ENV === 'development' &&
      process.env.REACT_APP_CUSTOMER_ID !== null
    ) {
      return true;
    }
    return false;
  };

  const handleChangeActivePet = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const petId = event.target.value;
    if (petId === 'new') {
      setPet(initialPet());
    } else {
      const newPet = pets.filter((p) => {
        return p.id === event.target.value;
      });
      if (newPet.length > 0) {
        setPet(newPet[0]);
      }
    }
  };

  const handleAddToCart = () => {
    dispatch(addProductsToCart());
  };

  const handleChangePet = ({ value, field, index }: ChangePetArguments) => {
    let updatedPet = { ...pet };
    if (field === PetFields.BREEDS) {
      if (typeof index !== 'undefined') {
        const breedsArray =
          updatedPet.breeds.length > 0
            ? updatedPet.breeds[index]
              ? updatedPet.breeds.map((breed, i) => {
                  if (index === i) {
                    return value;
                  }
                  return breed;
                })
              : [...updatedPet.breeds, value]
            : [value];
        updatedPet = {
          ...updatedPet,
          [field]: breedsArray,
        };
      }
    } else if (field === PetFields.ISSUES || field === PetFields.ALLERGIES) {
      if (value === 'None') {
        updatedPet[field] = ['None'];
      } else if (!updatedPet[field].includes(value)) {
        updatedPet[field] = [...updatedPet[field], value];
      } else {
        updatedPet[field] = updatedPet[field].filter((item) => {
          return item !== value;
        });
      }
      if (value !== 'None') {
        updatedPet[field] = updatedPet[field].filter((item) => item !== 'None');
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
    dispatch({
      type: StoreActions.FETCHED_RECS,
      payload: undefined,
    });
    dispatch({
      type: StoreActions.SAVE_PET,
      payload: pet,
    });
    if (authIsValid()) {
      dispatch(
        runRecommendationTool(
          process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_CUSTOMER_ID
            : // @ts-ignore
              window.customerId
        )
      );
      setActiveSection(5);
    } else {
      authInit();
    }
  };

  const handleResetPet = () => {
    dispatch({
      type: StoreActions.RESET_PENDING_PETS,
    });
    setPet(initialPet());
  };

  const handleSavePet = () => {
    if (window) {
      window.scrollTo(0, 0);
    }
    if (authIsValid()) {
      handleSavePendingPet();
      dispatch(
        savePetsToCustomer(
          process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_CUSTOMER_ID
            : // @ts-ignore
              window.customerId,
          null
        )
      );
    } else {
      authInit();
    }
  };

  const handleSavePendingPet = () => {
    dispatch({
      type: StoreActions.SAVE_PET,
      payload: pet,
    });
  };

  const handleStartNewPet = () => {
    handleSavePendingPet();
    setPet(initialPet());
  };

  useEffect(() => {
    if (canSavePersisted && shouldSavePersisted) {
      handleSavePet();
      setShouldSavePersisted(false);
    }
  }, [canSavePersisted, shouldSavePersisted]);

  useEffect(() => {
    if (pets.length) {
      const { query } = parse(window.location.href, true);
      const petId = _.get(query, 'petId', null);
      if (petId) {
        const nowEditting = pets.filter((pet) => petId === pet.id);
        if (nowEditting.length) {
          dispatch({
            type: StoreActions.START_FROM_SAVED,
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
    const storedPersistedPets = window.localStorage.getItem('persistedPets');
    if (storedPersistedPets) {
      const persistedPets = JSON.parse(storedPersistedPets);
      dispatch({
        type: StoreActions.PERSIST_PETS,
        payload: persistedPets.pets,
      });
      setPet(persistedPets.pets[persistedPets.pets.length - 1]);
      setActiveSection(persistedPets.activeSection);
      setShouldSavePersisted(true);
      window.localStorage.removeItem('persistedPets');
    }
    if (authIsValid()) {
      dispatch(
        loadCustomerPets(
          process.env.NODE_ENV === 'development'
            ? process.env.REACT_APP_CUSTOMER_ID
            : // @ts-ignore
              window.customerId
        )
      );
    }
  }, []);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('PETS');
      console.log(pets);
      console.log('PENDING PETS');
      console.log(pendingPets);
      console.log('PET');
      console.log(pet);
      // console.log('ACTIVE INDEX');
      // console.log(activeSection);
    }
  });

  const renderForm = () => {
    switch (activeSection) {
      case 0:
        return (
          <Onboarding
            onChangeActivePet={handleChangeActivePet}
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onResetPet={handleResetPet}
            onSavePendingPet={handleSavePendingPet}
            onSavePet={handleSavePet}
            pet={pet}
            pets={pets}
          />
        );
      case 1:
        return (
          <Profile
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onSavePendingPet={handleSavePendingPet}
            onSavePet={handleSavePet}
            pet={pet}
            plural={pendingPets && pendingPets.length > 1}
          />
        );
      case 2:
        return (
          <Activity
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onSavePendingPet={handleSavePendingPet}
            onSavePet={handleSavePet}
            pet={pet}
            plural={pendingPets && pendingPets.length > 1}
          />
        );
      case 3:
        return (
          <Habits
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onSavePendingPet={handleSavePendingPet}
            onSavePet={handleSavePet}
            pet={pet}
            plural={pendingPets && pendingPets.length > 1}
          />
        );
      case 4:
        return (
          <Toppers
            onChangePet={handleChangePet}
            onNavigateForm={setActiveSection}
            onRequestResults={handleRequestResults}
            onStartNewPet={handleStartNewPet}
            pendingPets={pendingPets}
            pet={pet}
            toppers={toppers}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container">
      <ProgressBar
        onNavigateForm={setActiveSection}
        onSavePendingPet={handleSavePendingPet}
        progress={activeSection}
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
              style={{ textAlign: 'right' }}
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
            <div style={{ textAlign: 'center' }}>
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
