// These are a collection of formulas, definitions, anad
// and notes from the Holi Chow recommendation CSV spreadsheet

// Life Stage
// Breed Size		  Puppy(0)	Adult(1)	Geriatric(2)
// XS(0)		      9			    84		    85
// S(1) 			    12			  84			  85
// M(2)		        12			  72			  73
// L(3)			      18			  60			  61
// XL(4)	        24			  60			  61

// Activity level
// Couch Potato	  1
// Walker		      1.3
// Jogger		      1.4
// Runner		      1.6
// Olympian		    1.8

// Body Condition
// Overweight	    1
// Slightly Over  1.2
// Ideal	        1.4
// Slightly Under	1.6
// Very Under	    1.8

// Neuter/Spay
// Yes	          1.6
// No	            1.8

// Calculated values
// breed size
// life stage
// RER =(70*((C4/2.2)^0.75))
// DER Factor =IF(C14=J4;T9;IF(OR(C7=P8;C7=P9);T8;IF(OR(C7=P11;C7=P12);T9;T10)))
// Daily Kibble weight (lbs) =((0.95*$C$25)/VLOOKUP($C$24;$E$14:$G$18;2;0))*2.2
// Daily Protein weight (oz) =(((C25*0.05)/F19))*35.274
// 45 day Kibble weight =C17*45
// 45 day Protein Weight =C18*45

// RER =(70*((C4/2.2)^0.75))

// DER Factor =IF(C14=J4;T9;IF(OR(C7=P8;C7=P9);T8;IF(OR(C7=P11;C7=P12);T9;T10)))

// Formulation Selection
// Blend =IF(AND(C14=J4,C7=K4),M4,IF(AND(C14=J4,C7=K5,C9="bad"),#REF!,IF(AND(C14=J4,C7=K5),M5,IF(AND(C14=J4,C7=K10,C6=L10,C9="bad"),#REF!,IF(AND(C14=J4,C7=K10,C6=L10),M10,IF(C14=J4,M11,IF(AND(C14=J18,C7=K18),M18,IF(AND(C14=J18,C7=K19),M19,IF(AND(C14=J18,C7=K24,C6=L24,C9="bad"),#REF!,IF(AND(C14=J18,C7=K24,C6=L24),M24,IF(AND(C14=J18,C7=K24,C6=L25,C9="bad"),#REF!,IF(AND(C14=J18,C7=K24,C6=L25),M25,IF(AND(C14=J18,C9="bad"),#REF!,IF(AND(C14=J18,C7=K24),M26,IF(AND(C14=J18,C9="bad"),#REF!,IF(C14=J18,M29,IF(AND(C14=J32,C7=K32),M32,IF(AND(C14=J32,C7=K33),M33,IF(AND(C14=J32,C7=K34,C9="bad"),#REF!,IF(AND(C14=J32,C7=K34),M34,M35))))))))))))))))))))
// Calories/day =C15*C16
// Daily Kibble volume (cups) =ROUND(0.95*$C$25/VLOOKUP($C$24;$E$14:$G$18;3;0);1)
// Daily Protein volume (tbsp) =ROUNDUP((0.05*C25)/G19;1)
// Kibble lbs per ship =IF(C19<E22;F22;IF(C19<E23;F23;IF(C19<E24;F24;IF(C19<E25;F25;IF(C19<E26;F26;IF(C19<E27;F27;IF(C19<E28;F28;F29)))))))
// Protein oz per ship =(C28/4)*F31
// predict re-order (days) =((C28-C19)/C17)+45

// Life Stage
// Puppy 		0
// Adult 		1
// Geriatric 	2
// var J4 = 'Puppy'; //0
// var J18 = 'Adult'; //1
// var J32 = 'Geriatric'; //2

// var C7 = bodyCondition;
// Overweight: 		1,
// Slightly Over: 	1.2
// Ideal:			1.4
// Slightly Under	1.6
// Very Under		1.8
// var K4, K18, K32 = 'Overweight'; //1
// var K5, K19, K33 = 'Slightly Over'; //1.2
// var K10,K24, K34 = 'Ideal'; //1.4

// var C6 = activity;
// Activity level
// Couch	1
// Walk	1.3
// Jog		1.4
// Run		1.6
// Olympic	1.8
// var L10, L24 = 'Couch'; //1
// var L25 = 'Walk'; // 1.3

// Blends =IF(AND(C14=J4,C7=K4),M4,IF(AND(C14=J4,C7=K5,C9="bad"),#REF!,IF(AND(C14=J4,C7=K5),M5,IF(AND(C14=J4,C7=K10,C6=L10,C9="bad"),#REF!,IF(AND(C14=J4,C7=K10,C6=L10),M10,IF(C14=J4,M11,IF(AND(C14=J18,C7=K18),M18,IF(AND(C14=J18,C7=K19),M19,IF(AND(C14=J18,C7=K24,C6=L24,C9="bad"),#REF!,IF(AND(C14=J18,C7=K24,C6=L24),M24,IF(AND(C14=J18,C7=K24,C6=L25,C9="bad"),#REF!,IF(AND(C14=J18,C7=K24,C6=L25),M25,IF(AND(C14=J18,C9="bad"),#REF!,IF(AND(C14=J18,C7=K24),M26,IF(AND(C14=J18,C9="bad"),#REF!,IF(C14=J18,M29,IF(AND(C14=J32,C7=K32),M32,IF(AND(C14=J32,C7=K33),M33,IF(AND(C14=J32,C7=K34,C9="bad"),#REF!,IF(AND(C14=J32,C7=K34),M34,M35))))))))))))))))))))
//=IF(C14=J4;M4;IF(AND(C14=J18;C7=K18);M18;IF(AND(C14=J18;C7=K19);M19;IF(AND(C14=J18;C7=K24;C9="bad");N24;IF(AND(C14=J18;C7=K24);M24;IF(AND(C14=J18;C9="bad");N18;IF(AND(C14=J18;C9="bad");N18;IF(C14=J18;M29;IF(AND(C14=J32;C7=K32);M32;IF(AND(C14=J32;C7=K33);M33;IF(AND(C14=J32;C7=K34;C9="bad");N34;IF(AND(C14=J32;C7=K34);M34;M35))))))))))))

// Puppy Only 		0 // aka Puppy
// Puppy + weight 	1 //
// Adult Only 		2 // aka Adult
// Adult + Weight 	3 // aka Weight Control
// Weight Only 		4 //
// Topper 			5 //
// var M4, M5, M10, M11, M29 = 'Puppy Only'; // 0
// var M18, M19, M32, M33 = 'Adult + Weight'; // 3
// var M24, M25, M26, M34, M35 = 'Adult Only'; // 2

// C14 = lifeStage
// C7 = bodyCondition
// C9 = stool = good/bad

// // lifestage
// J4 = Puppy = 0
// J18 = Adult = 1
// J32 = Geriatric = 2

// // BODY
// K18 = Overweight = 1
// K19 = Slightly Over = 1.2
// K24 = Ideal = 1.4
// K32 = Overweight = 1
// K33 = Slightly Over = 1.2
// K34 = Ideal = 1.4

// // BLENDS
// M4-M16 = Puppy = 0
// M18-M23 = Weight Management = 3
// M24-M28 = Adult = 2
// M29-M30 = Puppy = 0
// M32-M33 = Weight Management = 3
// M34-M36 = Adult = 2
// N4-N16 = Puppy = 0
// N18-N34 = Weight Management = 3
// N15-N36 = Adult = 2

// Calories/day =C15*C16
// Daily Kibble volume (cups) =ROUND(0.95*$C$25/VLOOKUP($C$24;$E$14:$G$18;3;0);1)
// Daily Protein volume (tbsp) =ROUNDUP((0.05*C25)/G19;1)
// Daily Kibble weight (lbs) =((0.95*$C$25)/VLOOKUP($C$24;$E$14:$G$18;2;0))*2.2
// Daily Protein weight (oz) =(((C25*0.05)/F19))*35.274
// 45 day Kibble weight =C17*45
// 45 day Protein Weight =C18*45
// Formulation Selection (continued)
// Kibble lbs per ship =IF(C19<E22;F22;IF(C19<E23;F23;IF(C19<E24;F24;IF(C19<E25;F25;IF(C19<E26;F26;IF(C19<E27;F27;IF(C19<E28;F28;F29)))))))
// Break sizes
// E22: 5
// E23: 10
// E24: 14
// E25: 18
// E26: 22
// E27: 26
// E28: 30

// Kibble sizes
// F22:  4
// F23:  8
// F24: 12
// F25: 16
// F26: 20
// F27: 24
// F28: 28
// F29: 32

// Protein oz per ship =(C28/4)*F31
// Protein OZ per 4lb: F31: 4
// Predict re-order (days) =((C28-C19)/C17)+45
