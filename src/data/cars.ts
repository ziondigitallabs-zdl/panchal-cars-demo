export interface Car {
  id: number;
  slug: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  yearLabel: string;
  regCode: string;
  regCity: string;
  owner: string;
  colour: string;
  transmission: 'Manual' | 'Automatic';
  fuel: 'Petrol' | 'Diesel' | 'CNG' | 'Electric';
  bodyType: 'Sedan' | 'Hatchback' | 'SUV' | 'MUV';
  airbags: number;
  insurance: string;
  km: number;
  keys: number;
  price: number;
}

export const cars: Car[] = [
  {
    id: 1,
    slug: "honda-city-2014",
    make: "Honda",
    model: "City 1.5",
    variant: "VX",
    year: 2014,
    yearLabel: "June 2014",
    regCode: "GJ06",
    regCity: "Vadodara",
    owner: "1st",
    colour: "White",
    transmission: "Manual",
    fuel: "Petrol",
    bodyType: "Sedan",
    airbags: 2,
    insurance: "Third-party till 25-03-2027",
    km: 96900,
    keys: 1,
    price: 385000
  },
  {
    id: 2,
    slug: "renault-kwid-2022",
    make: "Renault",
    model: "Kwid",
    variant: "RXT",
    year: 2022,
    yearLabel: "October 2022",
    regCode: "GJ17",
    regCity: "Godhra",
    owner: "1st",
    colour: "White",
    transmission: "Manual",
    fuel: "Petrol",
    bodyType: "Hatchback",
    airbags: 2,
    insurance: "Comprehensive till 10-10-2026",
    km: 69600,
    keys: 1,
    price: 325000
  },
  {
    id: 3,
    slug: "maruti-dzire-2018",
    make: "Maruti Suzuki",
    model: "Dzire",
    variant: "VXi",
    year: 2018,
    yearLabel: "November 2018",
    regCode: "GJ27",
    regCity: "Ahmedabad (Vastral)",
    owner: "1st",
    colour: "White",
    transmission: "Manual",
    fuel: "Petrol",
    bodyType: "Sedan",
    airbags: 2,
    insurance: "Comprehensive till 17-10-2026",
    km: 67000,
    keys: 2,
    price: 515000
  },
  {
    id: 4,
    slug: "tata-tigor-ev-2022",
    make: "Tata",
    model: "Tigor EV",
    variant: "XZ+",
    year: 2022,
    yearLabel: "April 2022",
    regCode: "GJ06",
    regCity: "Vadodara",
    owner: "1st",
    colour: "Daytona Grey",
    transmission: "Automatic",
    fuel: "Electric",
    bodyType: "Sedan",
    airbags: 2,
    insurance: "Comprehensive till 20-04-2027",
    km: 152000,
    keys: 2,
    price: 451000
  },
  {
    id: 5,
    slug: "renault-triber-2021",
    make: "Renault",
    model: "Triber",
    variant: "RXL",
    year: 2021,
    yearLabel: "2021",
    regCode: "GJ06",
    regCity: "Vadodara",
    owner: "1st",
    colour: "Silver",
    transmission: "Manual",
    fuel: "Petrol",
    bodyType: "MUV",
    airbags: 2,
    insurance: "Valid till 09-03-2027",
    km: 74000,
    keys: 1,
    price: 390000
  },
  {
    id: 6,
    slug: "maruti-baleno-2016",
    make: "Maruti Suzuki",
    model: "Baleno",
    variant: "Delta",
    year: 2016,
    yearLabel: "January 2016",
    regCode: "GJ06",
    regCity: "Vadodara",
    owner: "1st",
    colour: "Blue",
    transmission: "Manual",
    fuel: "Petrol",
    bodyType: "Hatchback",
    airbags: 2,
    insurance: "Comprehensive till 05-01-2027",
    km: 55120,
    keys: 1,
    price: 395000
  },
  {
    id: 7,
    slug: "ford-aspire-2017",
    make: "Ford",
    model: "Aspire",
    variant: "1.2 Titanium",
    year: 2017,
    yearLabel: "November 2017",
    regCode: "GJ01",
    regCity: "Ahmedabad",
    owner: "2nd",
    colour: "White",
    transmission: "Manual",
    fuel: "Petrol",
    bodyType: "Sedan",
    airbags: 2,
    insurance: "Comprehensive till 27-10-2026",
    km: 71735,
    keys: 1,
    price: 315000
  }
];
