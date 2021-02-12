import React from 'react';
import { Pet, PetFields } from '../../entities/pets';
import { FormSections, FormSectionProps } from '../../entities/form';

interface OnboardingProps extends FormSectionProps {
  onChangeActivePet: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  onResetPet: () => void;
  pets: Array<Pet>;
}

export const Onboarding = ({
  onChangeActivePet,
  onChangePet,
  onNavigateForm,
  onResetPet,
  onSavePendingPet,
  pet,
  pets,
}: OnboardingProps) => {
  return (
    <section id="pet-profile-section-0" className="pet-profile-section">
      <div className="content">
        <h1>My Pet Profile</h1>
        {pets.length > 0 && (
          <div
            className="fields"
            style={{
              paddingTop: '12px',
              paddingBottom: '12px',
              float: 'none',
              width: 'auto',
            }}
          >
            <label style={{ fontSize: 16 }}>
              Select a different pet
              <select
                onChange={onChangeActivePet}
                value={pet.id}
                style={{ display: 'block' }}
              >
                <option value={'new'}>New pet</option>
                {pets.map((p) => {
                  return (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  );
                })}
              </select>
            </label>
          </div>
        )}
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
                field: PetFields.NAME,
              })
            }
          />
          <span className="small-text">
            *You can add more pets later. We'll do this one at a time.
          </span>
        </p>

        <div className="pet-profile-form-nav">
          <button
            disabled={pet.name === ''}
            className={`button ${pet.name === '' && 'disable'}`}
            onClick={(event) => {
              event.preventDefault();
              onSavePendingPet && onSavePendingPet();
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
            Start Over
          </button>
        </div>
      </div>
    </section>
  );
};

const onboardingDog =
  process.env.NODE_ENV === 'development'
    ? require('../../public/onboarding-pup.jpg')
    : "{{ 'onboarding-pup.jpg' | asset_url }}";
