import React, { useState } from "react";
import { useGetPossessive } from "../../hooks";
import { RecommendationResponse } from "../../entities/api";
import { useGetTotalPrice } from "../../hooks/useGetTotalPrice";
import { Blend, BodyValue } from "../../entities/pets";
import { useGetGender } from "../../hooks/useGetGender";
import { useGetWeights } from "../../hooks/useGetWeights";

interface RecommendationProps extends RecommendationResponse {
  defaultOpen: boolean;
}

export const Recommendation = ({
  defaultOpen = true,
  kibble,
  pet,
  recommendation,
  topper,
}: RecommendationProps) => {
  const dogName = useGetPossessive(pet.name);
  const { himHer, heShe, hisHers } = useGetGender(pet.sex);
  const { totalCombinedPrice } = useGetTotalPrice({
    kibble: kibble.variants,
    topper: topper.variants,
  });
  const { kibbleWeight, topperWeight } = useGetWeights({
    kibble: kibble.variants,
    topper: topper.variants,
  });

  const tabOne =
    process.env.NODE_ENV === "development"
      ? require("../../public/kibble-bowl-sweet-potato.png")
      : '{{ "kibble-bowl-sweet-potato.png" | asset_url }}';
  const tabTwo =
    process.env.NODE_ENV === "development"
      ? require("../../public/measuring-cups.png")
      : '{{ "measuring-cups.png" | asset_url }}';
  const tabThree =
    process.env.NODE_ENV === "development"
      ? require("../../public/sweet-potato-fruit.png")
      : '{{ "sweet-potato-fruit.png" | asset_url }}';

  const quarter =
    process.env.NODE_ENV === "development"
      ? require("../../public/quarter.png")
      : '{{ "quarter.png" | asset_url }}';
  const half =
    process.env.NODE_ENV === "development"
      ? require("../../public/half.png")
      : '{{ "half.png" | asset_url }}';
  const threeQuarter =
    process.env.NODE_ENV === "development"
      ? require("../../public/three-quarter.png")
      : '{{ "three-quarter.png.png" | asset_url }}';
  const whole =
    process.env.NODE_ENV === "development"
      ? require("../../public/whole.png")
      : '{{ "whole.png" | asset_url }}';

  const [activeTab, setActiveTab] = useState<number>(0);
  const [open, setOpen] = useState<boolean>(defaultOpen);
  let ingredientsKibble = null;
  let nutritionKibble = null;
  let ingredientsTopper = null;
  let nutritionTopper = null;
  kibble.metafields.forEach((field) => {
    if (field.key === "ingredients") {
      ingredientsKibble = field.value;
    }
    if (field.key === "nutrition_facts") {
      nutritionKibble = field.value;
    }
  });
  topper.metafields.forEach((field) => {
    if (field.key === "ingredients") {
      ingredientsTopper = field.value;
    }
    if (field.key === "nutrition_facts") {
      nutritionTopper = field.value;
    }
  });

  return (
    <div className={`pet-result-section ${open && "open"}`}>
      <div className="section-header">
        <div className="section-header-flex">
          <ul className="products-preview">
            {kibble.product.image.src && (
              <li>
                <span
                  className="product-img"
                  style={{
                    backgroundImage: `url(${kibble.product.image.src})`,
                  }}
                />
                <span className="product-title">{kibble.product.title}</span>
              </li>
            )}
            {topper.product.image.src && (
              <li>
                <span
                  className="product-img"
                  style={{
                    backgroundImage: `url(${topper.product.image.src})`,
                  }}
                />
                <span className="product-title">{topper.product.title}</span>
              </li>
            )}
          </ul>
          <div className="pet-name">{pet.name}</div>
          <div className="header-subscription-info">
            <div className="price">
              Only ${(totalCombinedPrice / 45).toFixed(2)} per day!
            </div>
            <div className="schedule">Subscription renews every 45 Days</div>
          </div>
        </div>
        <div className="button reverse" onClick={() => setOpen(!open)}>
          See Feeding Schedule, Nutrition Info, and More{" "}
          <i className="far fa-angle-down"></i>
        </div>
      </div>
      <div className="section-main">
        <div className="section-overview">
          <h2 className="section-title">{dogName} Feeding Plan</h2>
        </div>
        <div className="feeding-plan-tabs">
          <div className="tabs-nav">
            <div className={`feeding-tab-link ${activeTab === 0 && "active"}`}>
              <a onClick={() => setActiveTab(0)}>Insights</a>
            </div>
            <div className={`feeding-tab-link ${activeTab === 1 && "active"}`}>
              <a onClick={() => setActiveTab(1)}>Feeding Schedule</a>
            </div>
            <div className={`feeding-tab-link ${activeTab === 2 && "active"}`}>
              <a onClick={() => setActiveTab(2)}>Ingredients / Nutrition</a>
            </div>
          </div>
          <div className="tabs-container">
            <div className={`feeding-tab ${activeTab === 0 && "active"}`}>
              <h3 className="title">{dogName} Insights</h3>
              <figure>
                <img src={tabOne} alt="Healthy bowl of kibble" />
              </figure>
              <div className="content insights-content">
                {recommendation.lifestage === 0 && (
                  <p>
                    Congrats on your fur baby! Puppies are hard work, but so
                    much fun!
                  </p>
                )}
                {recommendation.blend === Blend.puppy &&
                  (recommendation.lifestage === 0 ? (
                    <p>
                      Based on what you told us about {pet.name}, we’ve selected
                      our Puppy recipe for {himHer}. High protein and moderate
                      fat will keep {pet.name} growing and active. Our puppy
                      recipe has ideal calcium to phosphorous ratio to support
                      bone growth, Vitamin E for joint development, EPA and DHA
                      for cognitive development, and optimal fiber for
                      digestibility.
                    </p>
                  ) : (
                    <>
                      <p>
                        Based on what you told us about {pet.name}, we’ve
                        selected our Puppy recipe for {himHer}. Even though{" "}
                        {pet.name} is an adult, the increased protein and
                        moderate fat levels in our puppy recipe will help{" "}
                        {himHer} put on the weight {heShe} needs to get to ideal
                        body condition.
                      </p>
                      <p>
                        Our puppy recipe’s calcium to phosphorous ratio supports
                        bone growth and has Vitamin E for joint development, EPA
                        and DHA for cognitive development, and optimal fiber for
                        digestibility.
                      </p>
                    </>
                  ))}
                {recommendation.blend === Blend.adult && (
                  <p>
                    Based on what you told us about {pet.name} we’ve selected
                    our Adult recipe for {himHer}. With optimally balanced
                    nutrition and just the right amount of protein, fat, and
                    fiber, this recipe will support {dogName} healthy lifestyle
                    and activity level. HOLI’s Adult formula is fortified with
                    Calcium and Vitamin E for healthy bones and joints,
                    increased fiber to support gastrointestinal health, and
                    Omega 3s for anti-inflammatory benefits.
                  </p>
                )}
                {recommendation.blend === Blend.weightManagement && (
                  <p>
                    Based on what you told us about {pet.name} we’ve selected
                    our Weight Management recipe for {himHer}. This recipe is
                    higher in protein and lower in fat to promote lean muscle
                    mass manage weight. It delivers a balanced diet with added
                    fiber to promote healthy digestion get your pup feeling
                    satisfied with fewer calories.
                  </p>
                )}
                <p>
                  HOLI Superfood base recipes are plant based, non-allergenic,
                  and contain no animal proteins. Pairing it with our{" "}
                  {topper.product.title} will provide a delicious, complete and
                  balanced meal for {pet.name}!
                </p>
                {recommendation.lifestage === 2 && (
                  <p>
                    Older dogs like {pet.name} sometimes have joint trouble and
                    can’t quite keep up as well as we and they would like to. We
                    recommend adding Happy Again joint supplement to {hisHers}{" "}
                    feeding plan to get that spring back in their step.
                  </p>
                )}
                {pet.weight > 60 && (
                  <p>
                    Since {pet.name} is a large dog, we recommend adding Happy
                    Again joint supplement to {hisHers} feeding plan.
                  </p>
                )}
                {pet.body <= BodyValue.overweight && (
                  <p>
                    <strong>Featured Superfoods:</strong> Sweet Potato (dietary
                    fiber, Vitamins A, B6, C, Calcium, and Iron), Blueberries
                    (antioxidants, Vitamin C &amp; K), Menhaden fish oil
                    (Omega-3s), Carrots (Vitamin A &amp; Potassium), and Flax
                    Seed (Omega 3 &amp; 6 fatty acids, fiber for digestive
                    health)
                  </p>
                )}
                {pet.body >= BodyValue.ideal && (
                  <p>
                    <strong>Featured Superfoods:</strong> Chickpeas (protein,
                    minerals, Vitamins A,B,C and fiber), Blueberries
                    (antioxidants, Vitamin C &amp; K), Chicory Root (prebiotic
                    Inulin for digestive health), Carrots (Vitamin A &amp;
                    Potassium), and Flax Seed (Omega 3 &amp; 6 fatty acids,
                    fiber).
                  </p>
                )}
                <p>
                  You’ll want to make sure to divide {dogName} meals into at
                  least 2 feedings per day since puppies need that fuel to keep
                  up their energy levels.
                </p>
                {pet.issues.map((issue) => {
                  switch (issue) {
                    case "Skin and Coat":
                      return (
                        <p>
                          For {dogName} skin and coat issues we highly recommend
                          adding Dig Labs Skin and Coat supplement to {himHer}{" "}
                          feeding plan.
                        </p>
                      );
                    case "Joints":
                      return (
                        <p>
                          For {dogName} joint issues, we highly recommend adding
                          Happy Again joint supplement to {himHer} feeding plan.
                        </p>
                      );
                    default:
                      return null;
                  }
                })}
              </div>
              <div className="clear"></div>
            </div>
            <div className={`feeding-tab ${activeTab === 1 && "active"}`}>
              <h3 className="title">{dogName} Feeding Schedule</h3>
              <figure>
                <img src={tabTwo} alt="Measuring cups" />
              </figure>
              <div className="content">
                <p>
                  <strong>Superfood Base Recipe: </strong>
                  {kibble.product.title}
                  <br />
                  <strong>Calories/Day: </strong>
                  {Math.floor(recommendation.dailyCalories)}
                  <br />
                  <strong>Daily Superfood Base Serving: </strong>
                  {(
                    Math.round(recommendation.dailyVolumeCups / 0.25) * 0.25
                  )}{" "}
                  cups
                  <br />
                  <strong>Daily Protein Pack Serving: </strong>
                  {(
                    Math.round(recommendation.dailyVolumeTbsp / 0.5) * 0.5
                  )}{" "}
                  tbsp
                </p>
                <div className="schedule-transition">
                  <h3>Transition Schedule</h3>
                  <ul>
                    <li>
                      <img src={quarter} alt="Quarter full pie chart" />
                      <div className="transition-title">Days 1 &amp; 2</div>
                      <div className="transition-description">
                        25% Holi base and protein pack + 75% current food
                      </div>
                    </li>
                    <li>
                      <img src={half} alt="Half full pie chart" />
                      <div className="transition-title">Days 3 &amp; 4</div>
                      <div className="transition-description">
                        50% Holi base and protein pack + 50% current food
                      </div>
                    </li>
                    <li>
                      <img
                        src={threeQuarter}
                        alt="Three quarter full pie chart"
                      />
                      <div className="transition-title">Days 5 &amp; 6</div>
                      <div className="transition-description">
                        75% Holi base and protein pack + 25% current food
                      </div>
                    </li>
                    <li>
                      <img src={whole} alt="Full pie chart" />
                      <div className="transition-title">Days 7 &amp; 8</div>
                      <div className="transition-description">
                        100% Holi! - See complete directions
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="clear"></div>
            </div>
            <div className={`feeding-tab ${activeTab === 2 && "active"}`}>
              <h3 className="title">Ingredients / Nutrition</h3>
              <figure>
                <img
                  src={tabThree}
                  alt="Healthy bowl of kibble and sweet potatoes"
                />
              </figure>
              <div className="content">
                {ingredientsKibble && (
                  <div className="product-content">
                    <h3>Superfood Ingredients</h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: ingredientsKibble }}
                    />
                  </div>
                )}
                {nutritionKibble && (
                  <div className="product-content">
                    <h3>Guaranteed Analysis</h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: nutritionKibble }}
                    />
                  </div>
                )}
                {ingredientsTopper && (
                  <div className="product-content">
                    <h3>Protein Pack Ingredients</h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: ingredientsTopper }}
                    />
                  </div>
                )}
                {nutritionTopper && (
                  <div className="product-content">
                    <h3>Protein Pack Nutrition Facts</h3>
                    <div
                      dangerouslySetInnerHTML={{ __html: nutritionTopper }}
                    />
                  </div>
                )}
              </div>
              <div className="clear"></div>
            </div>
          </div>
        </div>
        <div className="subscription-info">
          {dogName} subscription will deliver {kibbleWeight} lbs of Superfood
          base and {topperWeight} oz of Protein Pack topper every 45 days.
        </div>
        <div className="feeding-plan-products">
          <h3 className="title">{dogName} Grub</h3>
          <ul className="plan-products-list">
            <li className="food plan-kibble">
              <div className="product">
                <span
                  className="img plan-kibble-img"
                  style={{
                    backgroundImage: `url(${kibble.product.image.src})`,
                  }}
                />
                <span className="name plan-kibble-name">
                  {kibble.product.title}
                </span>
              </div>
            </li>
            <li className="topper plan-topper">
              <div className="product">
                <span
                  className="img plan-topper-img"
                  style={{
                    backgroundImage: `url(${topper.product.image.src})`,
                  }}
                ></span>
                <span className="name plan-topper-name">
                  {topper.product.title}
                </span>
              </div>
            </li>
          </ul>
        </div>
        <div className="pricing-info">
          <p>
            Good news! {dogName} feeding plan only costs $
            {(totalCombinedPrice / 45).toFixed(2)} per day!
          </p>
        </div>
      </div>
    </div>
  );
};
