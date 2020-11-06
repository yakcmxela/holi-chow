import React, { useState, useEffect } from "react";
import {
  Breed,
  BreedCount,
  BreedSize,
  Sex,
  PetFields,
} from "../../entities/pets";
import { useGetPossessive } from "../../hooks";
import { FormSections, FormSectionProps } from "../../entities/form";

const maxYear = new Date().getFullYear();
const minYear = maxYear - 30;
const years = Array.from({ length: 30 }, (value, key) => key + minYear + 1);

export const Profile = ({
  onChangePet,
  onNavigateForm,
  onSavePet,
  pet,
}: FormSectionProps) => {
  const initialMonth = new Date(pet.birthdate).getMonth();
  const initialYear = new Date(pet.birthdate).getFullYear();

  const [breedCount, setBreedCount] = useState<BreedCount>(BreedCount.single);
  const [month, setMonth] = useState<number>(initialMonth);
  const [year, setYear] = useState<number>(initialYear);

  useEffect(() => {
    const birthdate = new Date(`${month + 1}/01/${year}`).getTime();
    onChangePet({ value: birthdate, field: PetFields.birthdate });
  }, [month, year]);

  const dogName = useGetPossessive(pet.name);
  return (
    <section id="pet-profile-section-1" className="pet-profile-section">
      <div className="content">
        <div className="part-title">Part 1</div>
        <h2 className="h1">{dogName} Profile</h2>
      </div>
      <div className="fields">
        <p>
          <label>
            {pet.name} is a
            <select
              name="breed-count"
              onChange={(event) =>
                setBreedCount(event.target.value as BreedCount)
              }
            >
              <option value={BreedCount.single}>{BreedCount.single}</option>
              <option value={BreedCount.mixed}>{BreedCount.mixed}</option>
              <option value={BreedCount.mutt}>{BreedCount.mutt}</option>
            </select>
          </label>
        </p>
        {(breedCount === BreedCount.single ||
          breedCount === BreedCount.mixed) && (
          <p>
            <label style={{ fontSize: 16 }}>
              Breed 1
              <select
                onChange={(event) => {
                  const breed = availableBreeds.filter(
                    (b) => b.type === event.target.value
                  );
                  if (breed.length > 0) {
                    onChangePet({
                      value: breed[0],
                      field: PetFields.breeds,
                      index: 0,
                    });
                  }
                }}
                value={pet.breeds[0] ? pet.breeds[0].type : undefined}
              >
                <option>Select a breed</option>
                {availableBreeds.map((breed, i) => {
                  return (
                    <option key={`first${i}`} value={breed.type}>
                      {breed.type}
                    </option>
                  );
                })}
              </select>
            </label>
          </p>
        )}
        {breedCount === BreedCount.mixed && (
          <p>
            <label style={{ fontSize: 16, marginTop: 8 }}>
              Breed 1
              <select
                onChange={(event) => {
                  const breed = availableBreeds.filter(
                    (b) => b.type === event.target.value
                  );
                  if (breed.length > 0) {
                    onChangePet({
                      value: breed[0],
                      field: PetFields.breeds,
                      index: 1,
                    });
                  }
                }}
                value={pet.breeds[1] ? pet.breeds[1].type : undefined}
              >
                <option>Select a breed</option>
                {availableBreeds.map((breed, i) => {
                  return (
                    <option key={`second${i}`} value={breed.type}>
                      {breed.type}
                    </option>
                  );
                })}
              </select>
            </label>
          </p>
        )}
        {breedCount === BreedCount.mutt && (
          <p>
            <label style={{ fontSize: 16 }}>
              Size
              <select
                onChange={(event) => {
                  onChangePet({
                    value: { type: "Mutt", size: event.target.value },
                    field: PetFields.breeds,
                    index: 1,
                  });
                }}
              >
                <option value={BreedSize.XS}>extra small (0-5 lbs)</option>
                <option value={BreedSize.SM}>small (6-10 lbs)</option>
                <option value={BreedSize.M}>medium (11-25 lbs)</option>
                <option value={BreedSize.L}>large (26-50 lbs)</option>
                <option value={BreedSize.XL}>extra large (50+ lbs)</option>
              </select>
            </label>
          </p>
        )}
        <p>
          <label>
            {dogName} date of birth is
            <select
              value={month}
              onChange={(event) => setMonth(parseInt(event.target.value))}
            >
              {months.map((m, i) => (
                <option key={m} value={i}>
                  {m}
                </option>
              ))}
            </select>
            ,
            <select
              value={year}
              onChange={(event) => setYear(parseInt(event.target.value))}
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </label>
          <span className="small-text">* An estimate is fine.</span>
        </p>
        <p>
          <label>
            {pet.name} weighs
            <span className="numberinput-wrapper input-pet-weight">
              <input
                type="number"
                value={pet.weight}
                onChange={(event) =>
                  onChangePet({
                    value: event.target.value,
                    field: PetFields.weight,
                  })
                }
              />
              <span
                onClick={() =>
                  onChangePet({
                    value: pet.weight + 1,
                    field: PetFields.weight,
                  })
                }
                className="numberinput-increment up"
              >
                <i className="far fa-angle-up"></i>
              </span>
              <span
                onClick={() =>
                  onChangePet({
                    value: pet.weight - 1,
                    field: PetFields.weight,
                  })
                }
                className="numberinput-increment down"
              >
                <i className="far fa-angle-down"></i>
              </span>
            </span>
            lbs
          </label>
        </p>
        <p>
          <label>
            {pet.name} is a
            <select
              value={pet.sex}
              onChange={(event) =>
                onChangePet({ value: event.target.value, field: PetFields.sex })
              }
            >
              <option value={Sex.male}>{Sex.male}</option>
              <option value={Sex.female}>{Sex.female}</option>
            </select>
            and is
            <select
              value={pet.neutered ? 1 : 0}
              onChange={(event) =>
                onChangePet({
                  value: Number(event.target.value) === 1,
                  field: PetFields.neutered,
                })
              }
            >
              <option value={1}>Spayed/Neutered</option>
              <option value={0}>NOT Spayed/Neutered</option>
            </select>
          </label>
        </p>
      </div>
      <div className="pet-profile-form-nav">
        <span
          className="button-text"
          onClick={() => {
            onSavePet && onSavePet();
            onNavigateForm(FormSections.onboarding);
          }}
        >
          <i className="fa fa-angle-left"></i>
          Back
        </span>
        <button
          disabled={pet.breeds.length === 0 && breedCount !== BreedCount.mutt}
          className={`button ${
            pet.breeds.length === 0 &&
            breedCount !== BreedCount.mutt &&
            "disable"
          }`}
          onClick={(event) => {
            event.preventDefault();
            onSavePet && onSavePet();
            onNavigateForm(FormSections.activity);
          }}
        >
          Next
          <i className="fa fa-angle-right"></i>
        </button>
      </div>
    </section>
  );
};

const months: Array<string> = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "Septempter",
  "October",
  "November",
  "December",
];

const availableBreeds: Array<Breed> = [
  { type: "Affenpinscher", size: BreedSize.XS },
  { type: "Afghan Hound", size: BreedSize.L },
  { type: "Afghan Shepherd", size: BreedSize.L },
  { type: "Aidi", size: BreedSize.M },
  { type: "Airedale Terrier", size: BreedSize.M },
  { type: "Akbash", size: BreedSize.L },
  { type: "Akita", size: BreedSize.XL },
  { type: "Alano Español", size: BreedSize.L },
  { type: "Alaskan husky", size: BreedSize.M },
  { type: "Alaskan Klee Kai", size: BreedSize.SM },
  { type: "Alaskan Malamute", size: BreedSize.L },
  { type: "Alpine Dachsbracke", size: BreedSize.M },
  { type: "Alpine Mastiff", size: BreedSize.XL },
  { type: "American Akita", size: BreedSize.L },
  { type: "American Bulldog", size: BreedSize.L },
  { type: "American Cocker Spaniel", size: BreedSize.SM },
  { type: "American English Coonhound", size: BreedSize.M },
  { type: "American Eskimo Dog", size: BreedSize.SM },
  { type: "American Foxhound", size: BreedSize.M },
  { type: "American Hairless Terrier", size: BreedSize.SM },
  { type: "American Leopard Hound", size: BreedSize.M },
  { type: "American Pit Bull Terrier", size: BreedSize.M },
  { type: "American Staffordshire Terrier", size: BreedSize.M },
  { type: "American Water Spaniel", size: BreedSize.M },
  { type: "Anatolian Shepherd Dog", size: BreedSize.XL },
  { type: "Andalusian Hound", size: BreedSize.M },
  { type: "Anglo-Français de Petite Vénerie", size: BreedSize.M },
  { type: "Appenzeller Sennenhund", size: BreedSize.M },
  { type: "Ariegeois", size: BreedSize.M },
  { type: "Armant", size: BreedSize.M },
  { type: "Artois Hound", size: BreedSize.M },
  { type: "Australian Cattle Dog", size: BreedSize.M },
  { type: "Australian Kelpie", size: BreedSize.M },
  { type: "Australian Shepherd", size: BreedSize.M },
  { type: "Australian Silky Terrier", size: BreedSize.XS },
  { type: "Australian Stumpy Tail Cattle Dog[10]", size: BreedSize.M },
  { type: "Australian Terrier", size: BreedSize.SM },
  { type: "Austrian Black and Tan Hound", size: BreedSize.M },
  { type: "Austrian Pinscher", size: BreedSize.M },
  { type: "Azawakh", size: BreedSize.L },
  { type: "Barbet", size: BreedSize.M },
  { type: "Basenji", size: BreedSize.SM },
  { type: "Basque Shepherd Dog", size: BreedSize.M },
  { type: "Basset Artésien Normand", size: BreedSize.M },
  { type: "Basset Bleu de Gascogne", size: BreedSize.M },
  { type: "Basset Fauve de Bretagne", size: BreedSize.M },
  { type: "Basset Hound", size: BreedSize.M },
  { type: "Bavarian Mountain Hound", size: BreedSize.M },
  { type: "Beagle", size: BreedSize.SM },
  { type: "Beagle-Harrier", size: BreedSize.M },
  { type: "Bearded Collie", size: BreedSize.M },
  { type: "Beauceron", size: BreedSize.L },
  { type: "Bedlington Terrier", size: BreedSize.SM },
  { type: "Belgian Shepherd Dog (Groenendael)", size: BreedSize.L },
  { type: "Belgian Shepherd Dog (Laekenois)", size: BreedSize.L },
  { type: "Belgian Shepherd Dog (Malinois)", size: BreedSize.L },
  { type: "Belgian Shepherd Dog (Tervuren)", size: BreedSize.L },
  { type: "Bergamasco Shepherd", size: BreedSize.M },
  { type: "Berger Blanc Suisse", size: BreedSize.M },
  { type: "Berger Picard", size: BreedSize.L },
  { type: "Bernese Mountain Dog", size: BreedSize.XL },
  { type: "Bichon Frisé", size: BreedSize.SM },
  { type: "Biewer Terrier", size: BreedSize.XS },
  { type: "Billy", size: BreedSize.L },
  { type: "Black and Tan Coonhound", size: BreedSize.L },
  { type: "Black and Tan Virginia Foxhound", size: BreedSize.M },
  { type: "Black Mouth Cur", size: BreedSize.M },
  { type: "Black Norwegian Elkhound", size: BreedSize.M },
  { type: "Black Russian Terrier", size: BreedSize.L },
  { type: "Bloodhound", size: BreedSize.L },
  { type: "Blue Heeler", size: BreedSize.M },
  { type: "Blue Lacy", size: BreedSize.M },
  { type: "Blue Picardy Spaniel", size: BreedSize.M },
  { type: "Bluetick Coonhound", size: BreedSize.M },
  { type: "Boerboel", size: BreedSize.XL },
  { type: "Bohemian Shepherd", size: BreedSize.M },
  { type: "Bolognese", size: BreedSize.XS },
  { type: "Border Collie", size: BreedSize.M },
  { type: "Border Terrier", size: BreedSize.SM },
  { type: "Borzoi", size: BreedSize.XL },
  { type: "Bosnian Coarse-haired Hound", size: BreedSize.M },
  { type: "Boston Terrier", size: BreedSize.SM },
  { type: "Bouvier des Ardennes", size: BreedSize.M },
  { type: "Bouvier des Flandres", size: BreedSize.L },
  { type: "Boxer", size: BreedSize.L },
  { type: "Boykin Spaniel", size: BreedSize.M },
  { type: "Bracco Italiano", size: BreedSize.L },
  { type: "Braque d'Auvergne", size: BreedSize.M },
  { type: "Braque de l'Ariege", size: BreedSize.L },
  { type: "Braque du Bourbonnais", size: BreedSize.M },
  { type: "Braque Francais", size: BreedSize.M },
  { type: "Braque Saint-Germain", size: BreedSize.M },
  { type: "Brazilian Terrier", size: BreedSize.SM },
  { type: "Briard", size: BreedSize.L },
  { type: "Briquet Griffon Vendéen", size: BreedSize.M },
  { type: "Brittany", size: BreedSize.M },
  { type: "Broholmer", size: BreedSize.XL },
  { type: "Brussels Griffon", size: BreedSize.XS },
  { type: "Bucovina Shepherd Dog", size: BreedSize.XL },
  { type: "Bull Terrier", size: BreedSize.M },
  { type: "Bulldog", size: BreedSize.M },
  { type: "Bullmastiff", size: BreedSize.XL },
  { type: "Bully Kutta", size: BreedSize.XL },
  { type: "Burgos Pointer", size: BreedSize.M },
  { type: "Cairn Terrier", size: BreedSize.SM },
  { type: "Canaan Dog", size: BreedSize.M },
  { type: "Canadian Eskimo Dog", size: BreedSize.L },
  { type: "Cane Corso", size: BreedSize.L },
  { type: "Cantabrian Water Dog", size: BreedSize.M },
  { type: "Carolina Dog", size: BreedSize.M },
  { type: "Carpathian Shepherd Dog", size: BreedSize.L },
  { type: "Catahoula Leopard Dog", size: BreedSize.L },
  { type: "Catalan Sheepdog", size: BreedSize.M },
  { type: "Caucasian Shepherd Dog", size: BreedSize.XL },
  { type: "Cavalier King Charles Spaniel", size: BreedSize.SM },
  { type: "Central Asian Shepherd Dog", size: BreedSize.L },
  { type: "Cesky Fousek", size: BreedSize.M },
  { type: "Cesky Terrier", size: BreedSize.SM },
  { type: "Chesapeake Bay Retriever", size: BreedSize.L },
  { type: "Chien Français Blanc et Noir", size: BreedSize.M },
  { type: "Chien Français Blanc et Orange", size: BreedSize.M },
  { type: "Chien Français Tricolore", size: BreedSize.M },
  { type: "Chihuahua", size: BreedSize.XS },
  { type: "Chinese Chongqing Dog", size: BreedSize.M },
  { type: "Chinese Crested Dog", size: BreedSize.XS },
  { type: "Chinese Imperial Dog", size: BreedSize.XS },
  { type: "Chinook", size: BreedSize.L },
  { type: "Chippiparai", size: BreedSize.M },
  { type: "Chow Chow", size: BreedSize.M },
  { type: "Cimarrón Uruguayo", size: BreedSize.L },
  { type: "Cirneco dell'Etna", size: BreedSize.M },
  { type: "Clumber Spaniel", size: BreedSize.M },
  { type: "Collie, Rough", size: BreedSize.M },
  { type: "Collie, Smooth", size: BreedSize.M },
  { type: "Combai", size: BreedSize.M },
  { type: "Coton de Tulear", size: BreedSize.SM },
  { type: "Cretan Hound", size: BreedSize.M },
  { type: "Croatian Sheepdog", size: BreedSize.M },
  { type: "Curly-Coated Retriever", size: BreedSize.L },
  { type: "Cursinu", size: BreedSize.M },
  { type: "Czechoslovakian Wolfdog", size: BreedSize.M },
  { type: "Cão da Serra de Aires", size: BreedSize.M },
  { type: "Cão de Gado Transmontano", size: BreedSize.XL },
  { type: "Cão Fila de São Miguel", size: BreedSize.L },
  { type: "Dachshund", size: BreedSize.SM },
  { type: "Dalmatian", size: BreedSize.M },
  { type: "Dandie Dinmont Terrier", size: BreedSize.SM },
  { type: "Danish-Swedish Farmdog", size: BreedSize.SM },
  { type: "Deutsche Bracke", size: BreedSize.M },
  { type: "Doberman Pinscher", size: BreedSize.L },
  { type: "Dogo Argentino", size: BreedSize.L },
  { type: "Dogue de Bordeaux", size: BreedSize.XL },
  { type: "Drentse Patrijshond", size: BreedSize.M },
  { type: "Drever", size: BreedSize.M },
  { type: "Dunker", size: BreedSize.M },
  { type: "Dutch Shepherd", size: BreedSize.M },
  { type: "Dutch Smoushond", size: BreedSize.SM },
  { type: "East European Shepherd", size: BreedSize.L },
  { type: "East Siberian Laika", size: BreedSize.M },
  { type: "Elo", size: BreedSize.M },
  { type: "English Cocker Spaniel", size: BreedSize.M },
  { type: "English Foxhound", size: BreedSize.M },
  { type: "English Mastiff", size: BreedSize.XL },
  { type: "English Setter", size: BreedSize.M },
  { type: "English Shepherd", size: BreedSize.M },
  { type: "English Springer Spaniel", size: BreedSize.M },
  { type: "English Toy Spaniel", size: BreedSize.SM },
  { type: "English Toy Terrier (Black & Tan)", size: BreedSize.XS },
  { type: "Entlebucher Mountain Dog", size: BreedSize.M },
  { type: "Estonian Hound", size: BreedSize.M },
  { type: "Estrela Mountain Dog", size: BreedSize.L },
  { type: "Eurasier", size: BreedSize.M },
  { type: "Eurohound", size: BreedSize.M },
  { type: "Field Spaniel", size: BreedSize.M },
  { type: "Brazilian Mastiff", size: BreedSize.XL },
  { type: "Finnish Hound", size: BreedSize.M },
  { type: "Finnish Lapphund", size: BreedSize.M },
  { type: "Finnish Spitz", size: BreedSize.M },
  { type: "Flat-Coated Retriever", size: BreedSize.M },
  { type: "Fox Terrier, Smooth", size: BreedSize.SM },
  { type: "Fox Terrier, Wire", size: BreedSize.SM },
  { type: "French Brittany", size: BreedSize.M },
  { type: "French Bulldog", size: BreedSize.SM },
  { type: "French Spaniel", size: BreedSize.M },
  { type: "Spanish Greyhound", size: BreedSize.M },
  { type: "Galician Cattle Dog", size: BreedSize.L },
  { type: "Garafian Shepherd", size: BreedSize.M },
  { type: "Gascon Saintongeois", size: BreedSize.M },
  { type: "German Longhaired Pointer", size: BreedSize.L },
  { type: "German Pinscher", size: BreedSize.M },
  { type: "German Roughhaired Pointer", size: BreedSize.M },
  { type: "German Shepherd Dog", size: BreedSize.L },
  { type: "German Shorthaired Pointer", size: BreedSize.M },
  { type: "German Spaniel", size: BreedSize.M },
  { type: "German Spitz", size: BreedSize.SM },
  { type: "German Wirehaired Pointer", size: BreedSize.M },
  { type: "Giant Schnauzer", size: BreedSize.L },
  { type: "Glen of Imaal Terrier", size: BreedSize.SM },
  { type: "Golden Retriever", size: BreedSize.L },
  { type: "Gordon Setter", size: BreedSize.L },
  { type: "Gran Mastín de Borínquen", size: BreedSize.XL },
  { type: "Grand Anglo-Français Blanc et Noir", size: BreedSize.M },
  { type: "Grand Anglo-Français Blanc et Orange", size: BreedSize.M },
  { type: "Grand Anglo-Français Tricolore", size: BreedSize.M },
  { type: "Grand Basset Griffon Vendéen", size: BreedSize.M },
  { type: "Grand Bleu de Gascogne", size: BreedSize.L },
  { type: "Grand Griffon Vendéen", size: BreedSize.L },
  { type: "Great Dane", size: BreedSize.XL },
  { type: "Great Pyrenees", size: BreedSize.XL },
  { type: "Greater Swiss Mountain Dog", size: BreedSize.XL },
  { type: "Greek Harehound", size: BreedSize.M },
  { type: "Greenland Dog", size: BreedSize.L },
  { type: "Greyhound", size: BreedSize.L },
  { type: "Griffon Bleu de Gascogne", size: BreedSize.L },
  { type: "Griffon Fauve de Bretagne", size: BreedSize.M },
  { type: "Griffon Nivernais", size: BreedSize.M },
  { type: "Guatemalan Dogo", size: BreedSize.L },
  { type: "Gull Terrier", size: BreedSize.M },
  { type: "Hamiltonstövare", size: BreedSize.M },
  { type: "Hanover Hound", size: BreedSize.L },
  { type: "Harrier", size: BreedSize.M },
  { type: "Havanese", size: BreedSize.SM },
  { type: "Hokkaido", size: BreedSize.M },
  { type: "Hovawart", size: BreedSize.L },
  { type: "Huntaway", size: BreedSize.L },
  { type: "Hygenhund", size: BreedSize.M },
  { type: "Ibizan Hound", size: BreedSize.L },
  { type: "Icelandic Sheepdog", size: BreedSize.M },
  { type: "Indian Spitz", size: BreedSize.M },
  { type: "Irish Red and White Setter", size: BreedSize.L },
  { type: "Irish Setter", size: BreedSize.L },
  { type: "Irish Terrier", size: BreedSize.M },
  { type: "Irish Water Spaniel", size: BreedSize.L },
  { type: "Irish Wolfhound", size: BreedSize.XL },
  { type: "Istrian Coarse-haired Hound", size: BreedSize.M },
  { type: "Istrian Shorthaired Hound", size: BreedSize.M },
  { type: "Italian Greyhound", size: BreedSize.SM },
  { type: "Jack Russell Terrier", size: BreedSize.SM },
  { type: "Jagdterrier", size: BreedSize.SM },
  { type: "Japanese Chin", size: BreedSize.XS },
  { type: "Japanese Spitz", size: BreedSize.M },
  { type: "Japanese Terrier", size: BreedSize.SM },
  { type: "Jämthund", size: BreedSize.M },
  { type: "Kai Ken", size: BreedSize.M },
  { type: "Kangal Dog", size: BreedSize.XL },
  { type: "Kanni", size: BreedSize.M },
  { type: "Karakachan Dog", size: BreedSize.M },
  { type: "Karelian Bear Dog", size: BreedSize.M },
  { type: "Karst Shepherd", size: BreedSize.M },
  { type: "Keeshond", size: BreedSize.M },
  { type: "Kerry Beagle", size: BreedSize.M },
  { type: "Kerry Blue Terrier", size: BreedSize.M },
  { type: "King Charles Spaniel", size: BreedSize.XS },
  { type: "King Shepherd", size: BreedSize.XL },
  { type: "Kishu Ken", size: BreedSize.M },
  { type: "Komondor", size: BreedSize.L },
  { type: "Kooikerhondje", size: BreedSize.M },
  { type: "Korean Jindo", size: BreedSize.M },
  { type: "Kromfohrländer", size: BreedSize.M },
  { type: "Kumaon Mastiff", size: BreedSize.XL },
  { type: "Kunming Wolfdog", size: BreedSize.L },
  { type: "Kuvasz", size: BreedSize.L },
  { type: "Kyi-Leo", size: BreedSize.SM },
  { type: "Labrador Husky", size: BreedSize.L },
  { type: "Labrador Retriever", size: BreedSize.L },
  { type: "Lagotto Romagnolo", size: BreedSize.M },
  { type: "Lakeland Terrier", size: BreedSize.SM },
  { type: "Lancashire Heeler", size: BreedSize.SM },
  { type: "Landseer", size: BreedSize.XL },
  { type: "Lapponian Herder", size: BreedSize.M },
  { type: "Leonberger", size: BreedSize.XL },
  { type: "Lhasa Apso", size: BreedSize.SM },
  { type: "Löwchen", size: BreedSize.SM },
  { type: "Magyar Agár", size: BreedSize.L },
  { type: "Majorca Shepherd Dog", size: BreedSize.L },
  { type: "Maltese", size: BreedSize.XS },
  { type: "Manchester Terrier", size: BreedSize.SM },
  { type: "Maremma Sheepdog", size: BreedSize.L },
  { type: "McNab", size: BreedSize.M },
  { type: "Mexican Hairless Dog", size: BreedSize.M },
  { type: "Miniature American Shepherd", size: BreedSize.M },
  { type: "Miniature Australian Shepherd", size: BreedSize.SM },
  { type: "Miniature Bull Terrier", size: BreedSize.SM },
  { type: "Miniature Fox Terrier", size: BreedSize.XS },
  { type: "Miniature Pinscher", size: BreedSize.XS },
  { type: "Miniature Schnauzer", size: BreedSize.SM },
  { type: "Miniature Shar Pei", size: BreedSize.M },
  { type: "Molossus of Epirus", size: BreedSize.L },
  { type: "Montenegrin Mountain Hound", size: BreedSize.M },
  { type: "Moscow Watchdog", size: BreedSize.XL },
  { type: "Mountain Cur", size: BreedSize.M },
  { type: "Mudi", size: BreedSize.M },
  { type: "Münsterländer", size: BreedSize.L },
  { type: "Neapolitan Mastiff", size: BreedSize.XL },
  { type: "Newfoundland", size: BreedSize.XL },
  { type: "Norfolk Terrier", size: BreedSize.SM },
  { type: "Norrbottenspets", size: BreedSize.SM },
  { type: "Northern Inuit Dog", size: BreedSize.M },
  { type: "Norwegian Buhund", size: BreedSize.M },
  { type: "Norwegian Elkhound", size: BreedSize.M },
  { type: "Norwegian Lundehund", size: BreedSize.SM },
  { type: "Norwich Terrier", size: BreedSize.SM },
  { type: "Nova Scotia Duck Tolling Retriever", size: BreedSize.M },
  { type: "Old Danish Pointer", size: BreedSize.M },
  { type: "Old English Sheepdog", size: BreedSize.L },
  { type: "Old English Terrier", size: BreedSize.SM },
  { type: "Old Time Farm Shepherd", size: BreedSize.M },
  { type: "Olde English Bulldogge", size: BreedSize.L },
  { type: "Otterhound", size: BreedSize.L },
  { type: "Papillon", size: BreedSize.XS },
  { type: "Parson Russell Terrier", size: BreedSize.SM },
  { type: "Patterdale Terrier", size: BreedSize.SM },
  { type: "Pekingese", size: BreedSize.SM },
  { type: "Perro de Presa Canario", size: BreedSize.L },
  { type: "Perro de Presa Mallorquin", size: BreedSize.L },
  { type: "Peruvian Hairless Dog", size: BreedSize.SM },
  { type: "Petit Basset Griffon Vendéen", size: BreedSize.M },
  { type: "Petit Bleu de Gascogne", size: BreedSize.M },
  { type: "Phalène", size: BreedSize.XS },
  { type: "Pharaoh Hound", size: BreedSize.M },
  { type: "Phu Quoc Ridgeback", size: BreedSize.M },
  { type: "Picardy Spaniel", size: BreedSize.M },
  { type: "Plott Hound", size: BreedSize.M },
  { type: "Podenco Canario", size: BreedSize.M },
  { type: "Pointer", size: BreedSize.L },
  { type: "Poitevin", size: BreedSize.M },
  { type: "Polish Greyhound", size: BreedSize.L },
  { type: "Polish Hound", size: BreedSize.M },
  { type: "Polish Hunting Dog", size: BreedSize.M },
  { type: "Polish Lowland Sheepdog", size: BreedSize.M },
  { type: "Polish Tatra Sheepdog", size: BreedSize.M },
  { type: "Pomeranian", size: BreedSize.XS },
  { type: "Poodle", size: BreedSize.M },
  { type: "Poodle (toy)", size: BreedSize.XS },
  { type: "Porcelaine", size: BreedSize.M },
  { type: "Portuguese Podengo (pequeño)", size: BreedSize.SM },
  { type: "Portuguese Podengo", size: BreedSize.M },
  { type: "Portuguese Pointer", size: BreedSize.M },
  { type: "Portuguese Sheepdog", size: BreedSize.M },
  { type: "Portuguese Water Dog", size: BreedSize.M },
  { type: "Posavac Hound", size: BreedSize.M },
  { type: "Pudelpointer", size: BreedSize.M },
  { type: "Pug", size: BreedSize.SM },
  { type: "Puli", size: BreedSize.M },
  { type: "Pumi", size: BreedSize.SM },
  { type: "Pyrenean Mastiff", size: BreedSize.XL },
  { type: "Pyrenean Shepherd", size: BreedSize.M },
  { type: "Rafeiro do Alentejo", size: BreedSize.L },
  { type: "Rat Terrier", size: BreedSize.SM },
  { type: "Ratonero Bodeguero Andaluz", size: BreedSize.M },
  { type: "Ratonero Murciano de Huerta", size: BreedSize.SM },
  { type: "Ratonero Valenciano", size: BreedSize.SM },
  { type: "Redbone Coonhound", size: BreedSize.L },
  { type: "Rhodesian Ridgeback", size: BreedSize.L },
  { type: "Romanian Mioritic Shepherd Dog", size: BreedSize.XL },
  { type: "Rottweiler", size: BreedSize.L },
  { type: "Russell Terrier", size: BreedSize.SM },
  { type: "Russian Spaniel", size: BreedSize.SM },
  { type: "Russian Toy", size: BreedSize.XS },
  { type: "Russian Tsvetnaya bolonka", size: BreedSize.XS },
  { type: "Russo-European Laika", size: BreedSize.M },
  { type: "Saarloos Wolfdog", size: BreedSize.L },
  { type: "Sabueso Español", size: BreedSize.M },
  { type: "Saluki", size: BreedSize.L },
  { type: "Samoyed", size: BreedSize.M },
  { type: "Schapendoes", size: BreedSize.M },
  { type: "Schillerstövare", size: BreedSize.M },
  { type: "Schipperke", size: BreedSize.SM },
  { type: "Schweizer Laufhund", size: BreedSize.M },
  { type: "Schweizerischer Niederlaufhund", size: BreedSize.SM },
  { type: "Scottish Deerhound", size: BreedSize.XL },
  { type: "Scottish Terrier", size: BreedSize.SM },
  { type: "Sealyham Terrier", size: BreedSize.SM },
  { type: "Segugio Italiano", size: BreedSize.M },
  { type: "Serbian Hound", size: BreedSize.M },
  { type: "Serbian Tricolour Hound", size: BreedSize.M },
  { type: "Shar Pei", size: BreedSize.M },
  { type: "Shetland Sheepdog", size: BreedSize.SM },
  { type: "Shiba Inu", size: BreedSize.SM },
  { type: "Shih Tzu", size: BreedSize.SM },
  { type: "Shikoku", size: BreedSize.M },
  { type: "Shiloh Shepherd", size: BreedSize.XL },
  { type: "Siberian Husky", size: BreedSize.M },
  { type: "Silken Windhound", size: BreedSize.M },
  { type: "Silky Terrier", size: BreedSize.XS },
  { type: "Skye Terrier", size: BreedSize.M },
  { type: "Sloughi", size: BreedSize.L },
  { type: "Slovak Cuvac", size: BreedSize.L },
  { type: "Slovakian Wirehaired Pointer", size: BreedSize.M },
  { type: "Slovenský Kopov", size: BreedSize.M },
  { type: "Greek Domestic Dog", size: BreedSize.SM },
  { type: "Munsterlander", size: BreedSize.M },
  { type: "Smålandsstövare", size: BreedSize.M },
  { type: "Soft-Coated Wheaten Terrier", size: BreedSize.M },
  { type: "South Russian Ovcharka", size: BreedSize.M },
  { type: "Spanish Mastiff", size: BreedSize.XL },
  { type: "Spanish Water Dog", size: BreedSize.M },
  { type: "Spinone Italiano", size: BreedSize.L },
  { type: "Sporting Lucas Terrier", size: BreedSize.SM },
  { type: "St. Bernard", size: BreedSize.XL },
  { type: "Stabyhoun", size: BreedSize.M },
  { type: "Staffordshire Bull Terrier", size: BreedSize.M },
  { type: "Standard Schnauzer", size: BreedSize.M },
  { type: "Stephens Cur", size: BreedSize.M },
  { type: "Styrian Coarse-haired Hound", size: BreedSize.M },
  { type: "Sussex Spaniel", size: BreedSize.M },
  { type: "Swedish Lapphund", size: BreedSize.M },
  { type: "Swedish Vallhund", size: BreedSize.SM },
  { type: "Taiwan Dog", size: BreedSize.M },
  { type: "Tamaskan Dog", size: BreedSize.L },
  { type: "Teddy Roosevelt Terrier", size: BreedSize.SM },
  { type: "Telomian", size: BreedSize.SM },
  { type: "Tenterfield Terrier", size: BreedSize.SM },
  { type: "Terceira Mastiff", size: BreedSize.XL },
  { type: "Thai Bangkaew Dog", size: BreedSize.M },
  { type: "Thai Ridgeback", size: BreedSize.M },
  { type: "Tibetan Mastiff", size: BreedSize.XL },
  { type: "Tibetan Spaniel", size: BreedSize.SM },
  { type: "Tibetan Terrier", size: BreedSize.SM },
  { type: "Tornjak", size: BreedSize.L },
  { type: "Tosa", size: BreedSize.L },
  { type: "Toy Fox Terrier", size: BreedSize.XS },
  { type: "Toy Manchester Terrier", size: BreedSize.XS },
  { type: "Transylvanian Hound", size: BreedSize.M },
  { type: "Treeing Cur", size: BreedSize.M },
  { type: "Treeing Tennessee Brindle", size: BreedSize.M },
  { type: "Treeing Walker Coonhound", size: BreedSize.L },
  { type: "Tyrolean Hound", size: BreedSize.M },
  { type: "Valencian Ratter", size: BreedSize.SM },
  { type: "Vizsla", size: BreedSize.M },
  { type: "Volpino Italiano", size: BreedSize.SM },
  { type: "Weimaraner", size: BreedSize.L },
  { type: "Welsh Corgi, Cardigan", size: BreedSize.SM },
  { type: "Welsh Corgi, Pembroke", size: BreedSize.SM },
  { type: "Welsh Springer Spaniel", size: BreedSize.M },
  { type: "Welsh Terrier", size: BreedSize.SM },
  { type: "West Highland White Terrier", size: BreedSize.SM },
  { type: "West Siberian Laika", size: BreedSize.M },
  { type: "Westphalian Dachsbracke", size: BreedSize.SM },
  { type: "Wetterhoun", size: BreedSize.M },
  { type: "Whippet", size: BreedSize.M },
  { type: "White Shepherd", size: BreedSize.L },
  { type: "Wirehaired Pointing Griffon", size: BreedSize.M },
  { type: "Wirehaired Vizsla", size: BreedSize.M },
  { type: "Working Kelpie", size: BreedSize.M },
  { type: "Xoloitzcuintli", size: BreedSize.M },
  { type: "Yakutian Laika", size: BreedSize.M },
  { type: "Yorkshire Terrier", size: BreedSize.XS },
];
