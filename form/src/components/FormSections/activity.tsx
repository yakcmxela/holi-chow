import React from 'react';
import {
  BodyValue,
  ActivityDescription,
  PetFields,
  BodyDescription,
  ActivityValue,
} from '../../entities/pets';
import { useGetPossessive } from '../../hooks';
import { FormSectionProps, FormSections } from '../../entities/form';

export const Activity = ({
  onChangePet,
  onNavigateForm,
  onSavePendingPet,
  onSavePet,
  pet,
  plural,
}: FormSectionProps) => {
  const dogName = useGetPossessive(pet.name);
  return (
    <section id="pet-profile-section-2" className="pet-profile-section">
      <div className="content">
        <div className="part-title">Part 2</div>
        <h2 className="h1">{dogName} Activities</h2>
      </div>
      <div className="fields">
        <p>{dogName} body type is</p>
        <ul>
          {bodyConditions.map((condition, i) => (
            <li key={`body${i}`}>
              <label>
                <img src={condition.image} alt={condition.description} />
                <span className="text">{condition.description}</span>
                <input
                  onChange={(event) =>
                    onChangePet({
                      value: Number(event.target.value),
                      field: PetFields.BODY,
                    })
                  }
                  type="radio"
                  checked={pet.body === condition.value}
                  value={condition.value}
                />
                <span className="input-proxy radio"></span>
              </label>
            </li>
          ))}
        </ul>
        <p>{dogName} activity level is</p>
        <ul>
          {activityLevels.map((level, i) => (
            <li key={`activity${i}`}>
              <label>
                <img src={level.image} alt={level.description} />
                <span className="text">{level.description}</span>
                <input
                  onChange={(event) =>
                    onChangePet({
                      value: Number(event.target.value),
                      field: PetFields.ACTIVITY,
                    })
                  }
                  type="radio"
                  checked={pet.activity === level.value}
                  value={level.value}
                />
                <span className="input-proxy radio"></span>
              </label>
            </li>
          ))}
        </ul>
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
              onNavigateForm(FormSections.profile);
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
              onNavigateForm(FormSections.habits);
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

const underweight =
  process.env.NODE_ENV === 'development'
    ? require('../../public/underweight.png')
    : '{{ "underweight.png" | asset_url }}';
const underweightSlightly =
  process.env.NODE_ENV === 'development'
    ? require('../../public/underweight-slightly.png')
    : '{{ "underweight-slightly.png" | asset_url }}';
const ideal =
  process.env.NODE_ENV === 'development'
    ? require('../../public/ideal.png')
    : '{{ "ideal.png" | asset_url }}';
const overweight =
  process.env.NODE_ENV === 'development'
    ? require('../../public/overweight.png')
    : '{{ "overweight.png" | asset_url }}';
const overweightSlightly =
  process.env.NODE_ENV === 'development'
    ? require('../../public/overweight-slightly.png')
    : '{{ "overweight-slightly.png" | asset_url }}';
const potato =
  process.env.NODE_ENV === 'development'
    ? require('../../public/potato.png')
    : '{{ "potato.png" | asset_url }}';
const walker =
  process.env.NODE_ENV === 'development'
    ? require('../../public/walker.png')
    : '{{ "walker.png" | asset_url }}';
const jogger =
  process.env.NODE_ENV === 'development'
    ? require('../../public/jogger.png')
    : '{{ "jogger.png" | asset_url }}';
const runner =
  process.env.NODE_ENV === 'development'
    ? require('../../public/runner.png')
    : '{{ "runner.png" | asset_url }}';
const olympian =
  process.env.NODE_ENV === 'development'
    ? require('../../public/olympian.png')
    : '{{ "olympian.png" | asset_url }}';

const bodyConditions = [
  {
    description: BodyDescription.UNDER,
    image: underweight,
    value: BodyValue.UNDER,
  },
  {
    description: BodyDescription.SLIGHTLY_UNDER,
    image: underweightSlightly,
    value: BodyValue.SLIGHTLY_UNDER,
  },
  {
    description: BodyDescription.IDEAL,
    image: ideal,
    value: BodyValue.IDEAL,
  },
  {
    description: BodyDescription.SLIGHTLY_OVER,
    image: overweightSlightly,
    value: BodyValue.SLIGHTLY_OVER,
  },
  {
    description: BodyDescription.OVERWEIGHT,
    image: overweight,
    value: BodyValue.OVERWEIGHT,
  },
];

const activityLevels = [
  {
    description: ActivityDescription.POTATO,
    image: potato,
    value: ActivityValue.POTATO,
  },
  {
    description: ActivityDescription.WALKER,
    image: walker,
    value: ActivityValue.WALKER,
  },
  {
    description: ActivityDescription.JOGGER,
    image: jogger,
    value: ActivityValue.JOGGER,
  },
  {
    description: ActivityDescription.RUNNER,
    image: runner,
    value: ActivityValue.RUNNER,
  },
  {
    description: ActivityDescription.OLYMPIAN,
    image: olympian,
    value: ActivityValue.OLYMPIAN,
  },
];
