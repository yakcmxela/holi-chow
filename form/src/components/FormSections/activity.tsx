import React from "react";
import {
  BodyValue,
  ActivityDescription,
  PetFields,
  BodyDescription,
  ActivityValue,
} from "../../entities/pets";
import { useGetPossessive } from "../../hooks";
import { FormSectionProps, FormSections } from "../../entities/form";

export const Activity = ({
  pet,
  onChangePet,
  onNavigateForm,
  onSavePet,
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
                      field: PetFields.body,
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
                      field: PetFields.activity,
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
      <div className="pet-profile-form-nav">
        <span
          className="button-text"
          onClick={() => {
            onSavePet && onSavePet();
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
            onSavePet && onSavePet();
            onNavigateForm(FormSections.habits);
          }}
        >
          Next
          <i className="fa fa-angle-right"></i>
        </button>
      </div>
    </section>
  );
};

const underweight =
  process.env.NODE_ENV === "development"
    ? require("../../public/underweight.png")
    : '{{ "underweight.png" | asset_url }}';
const underweightSlightly =
  process.env.NODE_ENV === "development"
    ? require("../../public/underweight-slightly.png")
    : '{{ "underweight-slightly.png" | asset_url }}';
const ideal =
  process.env.NODE_ENV === "development"
    ? require("../../public/ideal.png")
    : '{{ "ideal.png" | asset_url }}';
const overweight =
  process.env.NODE_ENV === "development"
    ? require("../../public/overweight.png")
    : '{{ "overweight.png" | asset_url }}';
const overweightSlightly =
  process.env.NODE_ENV === "development"
    ? require("../../public/overweight-slightly.png")
    : '{{ "overweight-slightly.png" | asset_url }}';
const potato =
  process.env.NODE_ENV === "development"
    ? require("../../public/potato.png")
    : '{{ "potato.png" | asset_url }}';
const walker =
  process.env.NODE_ENV === "development"
    ? require("../../public/walker.png")
    : '{{ "walker.png" | asset_url }}';
const jogger =
  process.env.NODE_ENV === "development"
    ? require("../../public/jogger.png")
    : '{{ "jogger.png" | asset_url }}';
const runner =
  process.env.NODE_ENV === "development"
    ? require("../../public/runner.png")
    : '{{ "runner.png" | asset_url }}';
const olympian =
  process.env.NODE_ENV === "development"
    ? require("../../public/olympian.png")
    : '{{ "olympian.png" | asset_url }}';

const bodyConditions = [
  {
    description: BodyDescription.under,
    image: underweight,
    value: BodyValue.under,
  },
  {
    description: BodyDescription.slightlyUnder,
    image: underweightSlightly,
    value: BodyValue.slightlyUnder,
  },
  {
    description: BodyDescription.ideal,
    image: ideal,
    value: BodyValue.ideal,
  },
  {
    description: BodyDescription.slightlyOver,
    image: overweightSlightly,
    value: BodyValue.slightlyOver,
  },
  {
    description: BodyDescription.overweight,
    image: overweight,
    value: BodyValue.overweight,
  },
];

const activityLevels = [
  {
    description: ActivityDescription.potato,
    image: potato,
    value: ActivityValue.potato,
  },
  {
    description: ActivityDescription.walker,
    image: walker,
    value: ActivityValue.walker,
  },
  {
    description: ActivityDescription.jogger,
    image: jogger,
    value: ActivityValue.jogger,
  },
  {
    description: ActivityDescription.runner,
    image: runner,
    value: ActivityValue.runner,
  },
  {
    description: ActivityDescription.olympian,
    image: olympian,
    value: ActivityValue.olympian,
  },
];
