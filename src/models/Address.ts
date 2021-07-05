export default interface Address {
  address: {
    city: string;
    country: string;
    country_code: string;
    county: string;
    postcode: number;
    road: string;
    state: string;
    suburb: string;
  };
  lat: number;
  lon: number;
}
