import React from "react";
import { PetFields } from "../../entities/pets";
import { FormSections, FormSectionProps } from "../../entities/form";

interface OnboardingProps extends FormSectionProps {
  onResetPet: () => void;
}

export const Onboarding = ({
  onChangePet,
  onNavigateForm,
  onResetPet,
  onSavePet,
  pet,
}: OnboardingProps) => {
  return (
    <section id="pet-profile-section-0" className="pet-profile-section">
      <div className="content">
        <h1>My Pet Profile</h1>
        <p>
          Your dog’s size, breed, age, and activity level determine their
          nutritional needs. Pickiness and food sensitivities come in all shapes
          and sizes. No worries. Simply complete this short profile so that we
          can recommend the perfect plan for your pup.
        </p>
      </div>
      <figure className="image">
        <img src={onboardingDog} alt="Start a new pet profile" />
      </figure>
      <div className="fields">
        <p className="pet-name-input">
          <label htmlFor="pet-name">My dog’s name is</label>
          <input
            name="pet-name"
            type="text"
            placeholder="Enter your dog's name"
            value={pet.name}
            onChange={(event) =>
              onChangePet({
                value: String(event.target.value),
                field: PetFields.name,
              })
            }
          />
          <span className="small-text">
            *You can add more pets later. We'll do this one at a time.
          </span>
        </p>

        <div className="pet-profile-form-nav">
          <button
            disabled={pet.name === ""}
            className={`button ${pet.name === "" && "disable"}`}
            onClick={(event) => {
              event.preventDefault();
              onSavePet && onSavePet();
              onNavigateForm(FormSections.profile);
            }}
          >
            Get Started
          </button>
          <button
            onClick={(event) => {
              event.preventDefault();
              onResetPet();
            }}
            className="button"
          >
            Clear Form and Start Over
          </button>
        </div>
      </div>
    </section>
  );
};

const onboardingDog =
  process.env.NODE_ENV === "development"
    ? require("../../public/onboarding-pup.jpg")
    : "{{ 'onboarding-pup.jpg' | asset_url }}";
