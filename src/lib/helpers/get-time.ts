import {DateTime} from "luxon";


export function nowInLuanda(): DateTime {
    // "Africa/Luanda" is the IANA timezone name for Luanda, Angola (UTC+1)
    return DateTime.now().setZone('Africa/Luanda');
}