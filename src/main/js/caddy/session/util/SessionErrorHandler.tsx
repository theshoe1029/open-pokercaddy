import { SessionData } from "../interface/SessionData";

export function displaySessionErrors(data: SessionData, displayErrorCallback: Function) {
    const {date, location, smallBlind, bigBlind, moneyIn, moneyOut} = data;
    if (!date) displayErrorCallback("date cannot be empty");
    else if (location.length == 0) displayErrorCallback("location cannot be empty");
    else if (smallBlind <= 0) displayErrorCallback("small blind cannot be 0 or less");
    else if (bigBlind <= 0) displayErrorCallback("big blind cannot be 0 or less");
    else if (moneyIn <= 0) displayErrorCallback("buy in cannot be 0");
    else if (moneyOut < 0) displayErrorCallback("cash out cannot be less than 0");
}