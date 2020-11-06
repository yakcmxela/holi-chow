import React from "react";
import { FormSectionProps, FormSections } from "../../entities/form";
import { PetFields, Pet } from "../../entities/pets";
import { useGetPossessive } from "../../hooks";
import { IProductWithMetafields } from "../../entities/products";

interface TopperSection extends FormSectionProps {
  onRequestResults: () => void;
  onStartNewPet: () => void;
  toppers: Array<IProductWithMetafields>;
  pendingPets: Array<Pet>;
}

export const Toppers = ({
  onChangePet,
  onNavigateForm,
  onRequestResults,
  onStartNewPet,
  onSavePet,
  pendingPets,
  pet,
  toppers,
}: TopperSection) => {
  const dogName = useGetPossessive(pet.name);
  return (
    <section id="pet-profile-section-4" className="pet-profile-section">
      <div className="content">
        <div className="part-title">Part 4</div>
        <h2 className="h1">Select a Protein Pack Topper for {dogName}</h2>
        <p>Choose a single protein or try a variety pack</p>
      </div>
      <div className="fields">
        <ul>
          {toppers.map((topper, i) => {
            let allergies = "";
            let issues = "";
            let picky = null;
            let ingredients = null;
            topper.metafields.forEach((field: any) => {
              switch (field.key) {
                case "warning_contents":
                  allergies = field.value;
                  break;
                case "recommended_for":
                  issues = field.value;
                  break;
                case "for_picky":
                  picky = field.value;
                  break;
                case "ingredients":
                  ingredients = field.value;
                  break;
              }
            });
            interface Warnings {
              [key: string]: {
                display: boolean;
                items: Array<string>;
              };
            }
            const warnings: Warnings = {
              allergies: {
                display: false,
                items: [],
              },
              issues: {
                display: false,
                items: [],
              },
              picky: {
                display: false,
                items: [],
              },
            };
            if (allergies) {
              pet.allergies.forEach((allergy) => {
                if (allergies.includes(allergy.toLowerCase())) {
                  warnings.allergies.display = true;
                  warnings.allergies.items.push(allergy);
                }
              });
            }
            if (issues) {
              pet.issues.forEach((issue) => {
                if (issues.includes(issue.toLowerCase())) {
                  warnings.issues.display = true;
                  warnings.issues.items.push(issue);
                }
              });
            }
            if (picky && pet.picky < 3) {
              warnings.picky.display = true;
            }
            return (
              <li key={i} className="topper-item-select">
                <label>
                  <input
                    name="topper"
                    type="radio"
                    checked={pet.topper === topper.handle}
                    value={topper.handle}
                    onChange={(event) =>
                      onChangePet({
                        value: event.target.value,
                        field: PetFields.topper,
                      })
                    }
                  />
                  <span
                    className="img"
                    style={{ backgroundImage: `url(${topper.image.src})` }}
                  >
                    <span className="alerts">
                      {warnings.allergies.display && (
                        <span className="allergies-warning vis">
                          Contains {warnings.allergies.items.join(", ")}
                        </span>
                      )}
                      {warnings.issues.display && (
                        <span className="issues-recommend vis">
                          Recommended for {warnings.issues.items.join(", ")}
                        </span>
                      )}
                      {warnings.picky.display && (
                        <span className="for-picky vis">
                          Recommended for picky eaters
                        </span>
                      )}
                    </span>
                    <span className="hover-content">
                      <div className="inner">
                        {ingredients && (
                          <div
                            dangerouslySetInnerHTML={{ __html: ingredients }}
                          />
                        )}
                      </div>
                    </span>
                  </span>
                  <span className="text">{topper.title}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="pet-profile-form-nav">
        <button
          disabled={pet.topper === ""}
          className={`button ${pet.topper === "" && "disable"}`}
          onClick={(e) => {
            e.preventDefault();
            onStartNewPet();
            onNavigateForm(FormSections.onboarding);
          }}
        >
          Add Another Pet
        </button>
        <button
          disabled={pet.topper === ""}
          className={`button ${pet.topper === "" && "disable"}`}
          onClick={(e) => {
            e.preventDefault();
            onSavePet && onSavePet();
            onRequestResults();
          }}
        >
          {pendingPets.length > 1 ? `View All Plans` : `View ${dogName} Plan`}
        </button>
      </div>
    </section>
  );
};
