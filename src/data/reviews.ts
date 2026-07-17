export interface Review {
  id: number;
  name: string;
  stars: number;
  date: string;
  text: string;
  tag?: string;
  isLong?: boolean;
}

export const reviews: Review[] = [
  {
    id: 1,
    name: "Shubham Sharma",
    stars: 5,
    date: "3 years ago",
    text: "Very genuine people. I bought my first car from here. Strongly recommended.",
    isLong: false
  },
  {
    id: 2,
    name: "Krish Dave",
    stars: 5,
    date: "3 years ago",
    text: "Great dealers. You'll get the best cars for price👍 I highly recommend it!!",
    isLong: false
  },
  {
    id: 3,
    name: "Dhir Chauhan",
    stars: 5,
    date: "3 years ago",
    text: "Very good car dealer with affordable prices",
    isLong: false
  },
  {
    id: 4,
    name: "Viral Patel",
    stars: 5,
    date: "3 years ago",
    text: "Nice experience. When I buy used car from panchal cars.. Genuine used cars and also clean and neat",
    isLong: false
  },
  {
    id: 5,
    name: "Abhuday Singh rao",
    stars: 5,
    date: "a year ago",
    tag: "BOUGHT A FORD FREESTYLE",
    text: "Jay prices are good conditions. Also, they gave good. I bought my first car from here. They're not very rigid to the price like others then negotiate up to your budget only, so it is good for us and also they keep the condition of the car like that, only which they bought from the other party, like no extra fake Shine they put so that you can see the real Car which you want to get into your home. that's the best part. I like also, their collection is quite wide every day. They are having new cars and all, so it's good to visit here once. Bought a Ford freestyle from them of 2019 model petrol. It was quite smooth. Working condition was also good price was also good. They even put it on OLX quite clean. It was looking as in terms of buying a second hand car, happy with your service.",
    isLong: true
  }
];
