import { scoreType } from "../../@types/scoreModel";

// если здесь чет меняем то меняем и на сервере
export const SCORES_TYPES_TO_FIELDS = {
  FromTo: [
    {
      type: "number",
      placeholder: "From",
      options: null,
    },
    {
      type: "number",
      placeholder: "To",
      options: null,
    },
  ],
  FromToName: [
    {
      type: "number",
      placeholder: "From",
      options: null,
    },
    {
      type: "number",
      placeholder: "To",
      options: null,
    },
    {
      type: "string",
      placeholder: "Includes",
      options: null,
    },
  ],
  UserName: [
    {
      type: "UserName",
      placeholder: "Equal",
      options: null,
    },
  ],
  BidGt: [
    {
      type: "number",
      placeholder: "Bid",
      options: null,
    },
    {
      type: "number",
      placeholder: "Guarantee",
      options: null,
    },
  ],
  Ticket: [
    {
      type: "number",
      placeholder: "Bid",
      options: null,
    },
    {
      type: "number",
      placeholder: "Tickets",
      options: null,
    },
    {
      type: "string",
      placeholder: "Includes",
      options: null,
    },
  ],
  BidGtName: [
    {
      type: "number",
      placeholder: "Bid",
      options: null,
    },
    {
      type: "number",
      placeholder: "Guarantee",
      options: null,
    },
    {
      type: "string",
      placeholder: "includes",
      options: null,
    },
  ],
  FromToGt: [
    {
      type: "number",
      placeholder: "From",
      options: null,
    },
    {
      type: "number",
      placeholder: "To",
      options: null,
    },
    {
      type: "number",
      placeholder: "Guarantee",
      options: null,
    },
  ],
  BidName: [
    {
      type: "number",
      placeholder: "Bid",
      options: null,
    },
    {
      type: "string",
      placeholder: "Includes",
      options: null,
    },
  ],
  Name: [
    {
      type: "string",
      placeholder: "Includes",
      options: null,
    },
  ],
  Score: [
    {
      type: "number",
      placeholder: "Score",
      options: null,
    },
  ],
  NotName: [
    {
      type: "string",
      placeholder: "Includes",
      options: null,
    },
  ],
  StartRegEqual: [
    {
      type: "time",
      placeholder: "Equal",
      options: null,
    },
  ],
  StartRegFrom: [
    {
      type: "time",
      placeholder: "From",
      options: null,
    },
  ],
  StartRegTo: [
    {
      type: "time",
      placeholder: "To",
      options: null,
    },
  ],
  FLAGS: [
    {
      type: "string",
      options: [
        "rebuy",
        "!rebuy",
        "od",
        "!od",
        "sng",
        "!sng",
        "deepstack",
        "!deepstack",
        "sat",
        "!sat",
      ],
      placeholder: "Flags",
    },
  ],
  Entrants: [
    {
      type: "number",
      placeholder: "Count",
      options: null,
    },
  ],
  StartDay: [
    {
      type: "string",
      placeholder: "Weekday",
      options: [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
  ],
};

export const SCORES_TYPES = Object.keys(SCORES_TYPES_TO_FIELDS) as scoreType[];
