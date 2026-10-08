import ICONS from "../assets/icons";
import IMAGES from "../assets/images";
import { CoachFilterKeyProps } from "../schemas/types";

export const ACTIVITY_LEVEL_DATA = [
  {
    title: "Sedentary",
    tagLine: "Little to no exercise, desk job",
    value: "sedentary",
  },
  {
    title: "Lightly Active",
    tagLine: "Light exercise 1–3 days per week",
    value: "lightly_active",
  },
  {
    title: "Moderately Active",
    tagLine: "Moderate exercise 3–5 days per week",
    value: "moderately_active",
  },
  {
    title: "Very Active",
    tagLine: "Hard exercise 6–7 days per week",
    value: "very_active",
  },
  {
    title: "Extremely Active",
    tagLine: "Very heavy exercise, hard labour job, or training twice per day",
    value: "extremely_active",
  },
];

export const WEEKLY_GOAL_DATA = [
  {
    title: "0.5kg per week",
    kcal: "550 kcal/day",
    value: "500g",
  },
  {
    title: "1kg per week",
    kcal: "1100 kcal/day",
    value: "1kg",
  },
];

export const GOALS_DATA = [
  {
    id: 1,
    title: "Lose Fat",
    value: "lose_fat",
    image: ICONS.fatLoose,
    testID: "lose_fat_id",
  },
  {
    id: 2,
    title: "Gain Muscle",
    value: "gain_muscle",
    image: ICONS.gainMuscle,
    testID: "gain_muscle_id",
  },
];

export const AGE_RANGE_DATA = [
  "8-12",
  "13-17",
  "18-25",
  "26-35",
  "36-45",
  "46-55",
  "56-65",
  "65+",
];

export const FILTER_DATA = [
  { id: "all", name: "All" },
  { id: "today", name: "Today" },
  { id: "week", name: "This Week" },
  { id: "month", name: "This Month" },
  { id: "year", name: "This Year" },
];

export const TDEE_FILTER_DATA = [
  { id: "today", name: "Today" },
  { id: "yesterday", name: "Yesterday" },
  { id: "last_7_days", name: "Last 7 Days" },
  { id: "last_30_days", name: "Last 30 Days" },
  // { id: "last_month", name: "Last 30 Days" },
];

export const HEIGHT_UNIT_DATA = [
  { id: "cm", name: "Centimeters" },
  { id: "ft", name: "Feet & Inches" },
];

export const WEIGHT_UNIT_DATA = [
  { id: "kg", name: "Kilograms" },
  { id: "lb", name: "Pounds" },
];

export const CoachFilterKey = {
  coachDashboardFilter: "coachDashboardFilter",
  coachClientFilter: "coachClientFilter",
  coachClientDetailsFilter: "coachClientDetailsFilter",
} as const satisfies Record<CoachFilterKeyProps, CoachFilterKeyProps>;

export const INFO_STEPS = [
  {
    id: 1,
    label: "Snap a Menu",
    description:
      "Out with your mates, staring at a menu? NutriSync will tell you what I’d pick for your goal, plus a solid backup.",
    imgPath: IMAGES.one,
    imgRight: true,
  },
  {
    id: 2,
    label: "Snap a Meal",
    description:
      "Got a burger, smoothie, or pizza in front of you? Snap it, and NutriSync will show you how I’d tweak it or just back it as is.",
    imgPath: IMAGES.two,
    imgRight: false,
  },
  {
    id: 3,
    label: "Snap Your Pantry",
    description:
      "Standing at home with random ingredients and no clue? Show NutriSync what’s in there and it will throw you meal ideas.",
    imgPath: IMAGES.three,
    imgRight: true,
  },
  {
    id: 4,
    label: "No Menu",
    description:
      "Just ask: “What should I grab at Macca’s if I’m cutting?” or “Best bulking option at Subway?”",
    imgPath: IMAGES.four,
    imgRight: false,
  },
  {
    id: 5,
    label: "Grocery Aisle Scan",
    description:
      "Stuck in front of the protein bar section at Coles? Snap it, and NutriSync will point you to the one I’d choose.",
    imgPath: IMAGES.five,
    imgRight: true,
  },
  {
    id: 6,
    label: "Quick Questions",
    description:
      "No food in sight? Ask me anything — cravings, water intake, training tips — I’ll keep it simple and goal-focused.",
    imgPath: IMAGES.six,
    imgRight: false,
  },
  {
    id: 7,
    label: "Snap your fridge",
    description:
      "Take a quick pic of your fridge — NutriSync will turn it into easy meal ideas.",
    imgPath: IMAGES.seven,
    imgRight: true,
  },
  {
    id: 8,
    label: "Meal plans",
    description:
      "Share your goals and preferences, and NutriSync will design your perfect plan.",
    imgPath: IMAGES.eight,
    imgRight: false,
  },
  {
    id: 9,
    label: "Training programs",
    description:
      "Need a training plan to follow? Tell NutriSync a little about your goals and simply ask.",
    imgPath: IMAGES.nine,
    imgRight: true,
  },
  {
    id: 10,
    label: "Healthy recipes",
    description:
      "Snap your ingredients and NutriSync will turn them into a healthy, goal-aligned meal.",
    imgPath: IMAGES.ten,
    imgRight: false,
  },
];

export const COUNTRIES = [
  { code: "af", name: "Afghanistan", phoneCode: "+93" },
  { code: "al", name: "Albania", phoneCode: "+355" },
  { code: "dz", name: "Algeria", phoneCode: "+213" },
  { code: "ao", name: "Angola", phoneCode: "+244" },
  { code: "ar", name: "Argentina", phoneCode: "+54" },
  { code: "au", name: "Australia", phoneCode: "+61" },
  { code: "at", name: "Austria", phoneCode: "+43" },
  { code: "bd", name: "Bangladesh", phoneCode: "+880" },
  { code: "be", name: "Belgium", phoneCode: "+32" },
  { code: "bj", name: "Benin", phoneCode: "+229" },
  { code: "bo", name: "Bolivia", phoneCode: "+591" },
  { code: "br", name: "Brazil", phoneCode: "+55" },
  { code: "bn", name: "Brunei", phoneCode: "+673" },
  { code: "bg", name: "Bulgaria", phoneCode: "+359" },
  { code: "ca", name: "Canada", phoneCode: "+1" },
  { code: "cl", name: "Chile", phoneCode: "+56" },
  { code: "cn", name: "China", phoneCode: "+86" },
  { code: "co", name: "Colombia", phoneCode: "+57" },
  { code: "cr", name: "Costa Rica", phoneCode: "+506" },
  { code: "hr", name: "Croatia", phoneCode: "+385" },
  { code: "cu", name: "Cuba", phoneCode: "+53" },
  { code: "cz", name: "Czech Republic", phoneCode: "+420" },
  { code: "dk", name: "Denmark", phoneCode: "+45" },
  { code: "cd", name: "Democratic Republic of Congo", phoneCode: "+243" },
  { code: "eg", name: "Egypt", phoneCode: "+20" },
  { code: "ee", name: "Estonia", phoneCode: "+372" },
  { code: "et", name: "Ethiopia", phoneCode: "+251" },
  { code: "fi", name: "Finland", phoneCode: "+358" },
  { code: "fr", name: "France", phoneCode: "+33" },
  { code: "de", name: "Germany", phoneCode: "+49" },
  { code: "gh", name: "Ghana", phoneCode: "+233" },
  { code: "gr", name: "Greece", phoneCode: "+30" },
  { code: "gt", name: "Guatemala", phoneCode: "+502" },
  { code: "ht", name: "Haiti", phoneCode: "+509" },
  { code: "hn", name: "Honduras", phoneCode: "+504" },
  { code: "hk", name: "Hong Kong", phoneCode: "+852" },
  { code: "hu", name: "Hungary", phoneCode: "+36" },
  { code: "is", name: "Iceland", phoneCode: "+354" },
  { code: "in", name: "India", phoneCode: "+91" },
  { code: "id", name: "Indonesia", phoneCode: "+62" },
  { code: "ir", name: "Iran", phoneCode: "+98" },
  { code: "iq", name: "Iraq", phoneCode: "+964" },
  { code: "ie", name: "Ireland", phoneCode: "+353" },
  { code: "il", name: "Israel", phoneCode: "+972" },
  { code: "it", name: "Italy", phoneCode: "+39" },
  { code: "jp", name: "Japan", phoneCode: "+81" },
  { code: "jo", name: "Jordan", phoneCode: "+962" },
  { code: "ke", name: "Kenya", phoneCode: "+254" },
  { code: "kr", name: "South Korea", phoneCode: "+82" },
  { code: "kw", name: "Kuwait", phoneCode: "+965" },
  { code: "la", name: "Laos", phoneCode: "+856" },
  { code: "lv", name: "Latvia", phoneCode: "+371" },
  { code: "lb", name: "Lebanon", phoneCode: "+961" },
  { code: "lt", name: "Lithuania", phoneCode: "+370" },
  { code: "lu", name: "Luxembourg", phoneCode: "+352" },
  { code: "my", name: "Malaysia", phoneCode: "+60" },
  { code: "ml", name: "Mali", phoneCode: "+223" },
  { code: "mt", name: "Malta", phoneCode: "+356" },
  { code: "mx", name: "Mexico", phoneCode: "+52" },
  { code: "md", name: "Moldova", phoneCode: "+373" },
  { code: "mn", name: "Mongolia", phoneCode: "+976" },
  { code: "me", name: "Montenegro", phoneCode: "+382" },
  { code: "ma", name: "Morocco", phoneCode: "+212" },
  { code: "mz", name: "Mozambique", phoneCode: "+258" },
  { code: "mm", name: "Myanmar", phoneCode: "+95" },
  { code: "np", name: "Nepal", phoneCode: "+977" },
  { code: "nl", name: "Netherlands", phoneCode: "+31" },
  { code: "nz", name: "New Zealand", phoneCode: "+64" },
  { code: "ng", name: "Nigeria", phoneCode: "+234" },
  { code: "no", name: "Norway", phoneCode: "+47" },
  { code: "om", name: "Oman", phoneCode: "+968" },
  { code: "pk", name: "Pakistan", phoneCode: "+92" },
  { code: "pa", name: "Panama", phoneCode: "+507" },
  { code: "py", name: "Paraguay", phoneCode: "+595" },
  { code: "pe", name: "Peru", phoneCode: "+51" },
  { code: "ph", name: "Philippines", phoneCode: "+63" },
  { code: "pl", name: "Poland", phoneCode: "+48" },
  { code: "pt", name: "Portugal", phoneCode: "+351" },
  { code: "qa", name: "Qatar", phoneCode: "+974" },
  { code: "ro", name: "Romania", phoneCode: "+40" },
  { code: "ru", name: "Russia", phoneCode: "+7" },
  { code: "rw", name: "Rwanda", phoneCode: "+250" },
  { code: "sa", name: "Saudi Arabia", phoneCode: "+966" },
  { code: "sn", name: "Senegal", phoneCode: "+221" },
  { code: "rs", name: "Serbia", phoneCode: "+381" },
  { code: "sg", name: "Singapore", phoneCode: "+65" },
  { code: "sk", name: "Slovakia", phoneCode: "+421" },
  { code: "si", name: "Slovenia", phoneCode: "+386" },
  { code: "za", name: "South Africa", phoneCode: "+27" },
  { code: "es", name: "Spain", phoneCode: "+34" },
  { code: "lk", name: "Sri Lanka", phoneCode: "+94" },
  { code: "se", name: "Sweden", phoneCode: "+46" },
  { code: "ch", name: "Switzerland", phoneCode: "+41" },
  { code: "sy", name: "Syria", phoneCode: "+963" },
  { code: "tw", name: "Taiwan", phoneCode: "+886" },
  { code: "tz", name: "Tanzania", phoneCode: "+255" },
  { code: "th", name: "Thailand", phoneCode: "+66" },
  { code: "tn", name: "Tunisia", phoneCode: "+216" },
  { code: "tr", name: "Turkey", phoneCode: "+90" },
  { code: "ug", name: "Uganda", phoneCode: "+256" },
  { code: "ua", name: "Ukraine", phoneCode: "+380" },
  { code: "ae", name: "United Arab Emirates", phoneCode: "+971" },
  { code: "gb", name: "United Kingdom", phoneCode: "+44" },
  { code: "us", name: "United States", phoneCode: "+1" },
  { code: "uy", name: "Uruguay", phoneCode: "+598" },
  { code: "uz", name: "Uzbekistan", phoneCode: "+998" },
  { code: "ve", name: "Venezuela", phoneCode: "+58" },
  { code: "vn", name: "Vietnam", phoneCode: "+84" },
  { code: "ye", name: "Yemen", phoneCode: "+967" },
  { code: "zm", name: "Zambia", phoneCode: "+260" },
  { code: "zw", name: "Zimbabwe", phoneCode: "+263" },
];

export const OVERVIEW_DATA = [
  {
    id: 1,
    descriptions: "Crushed your proteins today, champ!",
  },
  {
    id: 2,
    descriptions: "Smashed those macros like a beast!",
  },
  {
    id: 3,
    descriptions: "Bro, you’re feeding those muscles EXACTLY what they want.",
  },
  {
    id: 4,
    descriptions: "Solid protein intake today — keep that streak alive!",
  },
  {
    id: 5,
    descriptions: "Clean, consistent, and on the grind. Love it.",
  },
];
