import React, { useState } from 'react';
import { useGetPossessive } from '../../hooks';
import { Stool, PetFields } from '../../entities/pets';
import { FormSectionProps, FormSections } from '../../entities/form';

export const Habits = ({
  onChangePet,
  onNavigateForm,
  onSavePendingPet,
  onSavePet,
  pet,
  plural,
}: FormSectionProps) => {
  const dogName = useGetPossessive(pet.name);
  const [stool, setStool] = useState<string>('Never');
  return (
    <section id="pet-profile-section-3" className="pet-profile-section">
      <div className="content">
        <div className="part-title">Part 3</div>
        <h2 className="h1">{dogName} Eating Habits</h2>
      </div>
      <div className="fields">
        <p>{dogName} eating habits are</p>
        <ul className={`input-line inputs-${pickyOptions.length}`}>
          {pickyOptions.map((option, i) => {
            return (
              <li key={`picky${i}`}>
                <label>
                  <input
                    type="radio"
                    value={option.value}
                    checked={pet.picky === option.value}
                    onChange={(event) =>
                      onChangePet({
                        value: Number(event.target.value),
                        field: PetFields.PICKY,
                      })
                    }
                  />
                  <span className="input-proxy radio"></span>
                  {option.description && (
                    <span className="text">{option.description}</span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
        <p>{pet.name} gets treats</p>
        <ul className={`input-line inputs-${treatsOptions.length}`}>
          {treatsOptions.map((option, i) => {
            return (
              <li key={`treats${i}`}>
                <label>
                  <input
                    type="radio"
                    value={option.value}
                    checked={pet.treats === option.value}
                    onChange={(event) =>
                      onChangePet({
                        value: Number(event.target.value),
                        field: PetFields.TREATS,
                      })
                    }
                  />
                  <span className="input-proxy radio"></span>
                  {option.description && (
                    <span className="text">{option.description}</span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
        <p>{pet.name} gets table scraps</p>
        <ul className={`input-line inputs-${scrapsOptions.length}`}>
          {scrapsOptions.map((option, i) => {
            return (
              <li key={`scraps${i}`}>
                <label>
                  <input
                    type="radio"
                    value={option.value}
                    checked={pet.scraps === option.value}
                    onChange={(event) =>
                      onChangePet({
                        value: Number(event.target.value),
                        field: PetFields.SCRAPS,
                      })
                    }
                  />
                  <span className="input-proxy radio"></span>
                  {option.description && (
                    <span className="text">{option.description}</span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
        <p>
          <span className="pet-name-text">{pet.name} has allergies:</span>
          <span className="small-text">Check all that apply</span>
        </p>
        <ul className="plain-input-list">
          {allergiesOptions.map((option, i) => {
            return (
              <li key={`allergies${i}`}>
                <label>
                  <input
                    checked={pet.allergies.includes(option.description)}
                    onChange={(event) =>
                      onChangePet({
                        value: event.target.value,
                        field: PetFields.ALLERGIES,
                      })
                    }
                    type="checkbox"
                    value={option.description}
                  />
                  {option.description && (
                    <span className="text">{option.description}</span>
                  )}
                  <span className="input-proxy checkbox"></span>
                </label>
              </li>
            );
          })}
        </ul>
        <p>
          <span className="pet-name-text">{pet.name} has issues with:</span>
          <span className="small-text">Check all that apply</span>
        </p>

        <ul className="plain-input-list">
          {issuesOptions.map((option, i) => {
            return (
              <li key={`issues${i}`}>
                <label>
                  <input
                    checked={pet.issues.includes(option.description)}
                    onChange={(event) =>
                      onChangePet({
                        value: event.target.value,
                        field: PetFields.ISSUES,
                      })
                    }
                    type="checkbox"
                    value={option.description}
                  />
                  {option.description && (
                    <span className="text">{option.description}</span>
                  )}
                  <span className="input-proxy checkbox"></span>
                </label>
              </li>
            );
          })}
        </ul>
        <p className="pet-stool">
          <label>
            {pet.name}
            <select
              onChange={(event) => {
                setStool(event.target.value);
                onChangePet({
                  value:
                    event.target.value === 'Sometimes' ||
                    event.target.value === 'Never'
                      ? Stool.GOOD
                      : Stool.BAD,
                  field: PetFields.STOOL,
                });
              }}
              value={stool}
            >
              {stoolOptions.map((option, i) => {
                return (
                  <option key={`stool${i}`} value={option.value}>
                    {option.description}
                  </option>
                );
              })}
            </select>
            has diarrhea
          </label>
        </p>
      </div>
      <div
        className="pet-profile-form-nav"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <a
          className="button-text"
          onClick={(event) => {
            event.preventDefault();
            onSavePet && onSavePet();
          }}
        >
          Save Pet{plural && 's'}
        </a>
        <div>
          <span
            className="button-text"
            onClick={() => {
              onSavePendingPet && onSavePendingPet();
              onNavigateForm(FormSections.activity);
            }}
          >
            <i className="fa fa-angle-left"></i>
            Back
          </span>
          <button
            className="button"
            onClick={(event) => {
              event.preventDefault();
              onSavePendingPet && onSavePendingPet();
              onNavigateForm(FormSections.toppers);
            }}
          >
            Next
            <i className="fa fa-angle-right"></i>
          </button>
        </div>
      </div>
    </section>
  );
};

const pickyOptions = [
  {
    description: 'Super Picky',
    value: 0,
  },
  {
    value: 1,
  },
  {
    value: 2,
  },
  {
    value: 3,
  },
  {
    description: 'Eats Everything',
    value: 4,
  },
];

const treatsOptions = [
  {
    description: 'Never',
    value: 0,
  },
  {
    description: 'Occasionaly',
    value: 1,
  },
  {
    description: 'Daily',
    value: 2,
  },
];

const scrapsOptions = [
  {
    description: 'Never',
    value: 0,
  },
  {
    description: 'Rarely',
    value: 1,
  },
  {
    description: 'Sometimes',
    value: 2,
  },
  {
    description: 'Frequently',
    value: 3,
  },
];

const allergiesOptions = [
  {
    description: 'None',
  },
  {
    description: 'Beef',
  },
  {
    description: 'Dairy',
  },
  {
    description: 'Wheat',
  },
  {
    description: 'Eggs',
  },
  {
    description: 'Chicken',
  },
  {
    description: 'Lamb',
  },
  {
    description: 'Soy',
  },
  {
    description: 'Pork',
  },
  {
    description: 'Rabbit',
  },
  {
    description: 'Fish',
  },
  {
    description: 'Turkey',
  },
  {
    description: 'Other',
  },
];

const issuesOptions = [
  {
    description: 'None',
  },
  {
    description: 'Anxiety',
  },
  {
    description: 'Bad Breath',
  },
  {
    description: 'Blindness',
  },
  {
    description: 'Chews Paws',
  },
  {
    description: 'Ear Infections',
  },
  {
    description: 'Hyperactive',
  },
  {
    description: 'Itchiness',
  },
  {
    description: 'Joints',
  },
  {
    description: 'Constipation',
  },
  {
    description: 'Lethargy',
  },
  {
    description: 'Passes Gas',
  },
  {
    description: 'Skin and Coat',
  },
  {
    description: 'Tear Stains',
  },
  {
    description: 'Urinary Tract',
  },
  {
    description: 'Vomiting',
  },
  {
    description: 'Other',
  },
];

const stoolOptions = [
  {
    description: 'Never',
    value: 'Never',
  },
  {
    description: 'Sometimes',
    value: 'Sometimes',
  },
  {
    description: 'Frequently',
    value: 'Frequently',
  },
];
