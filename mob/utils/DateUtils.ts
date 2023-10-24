import moment from "moment";

export class DateUtils {
  static getDurationAsString(durationInMs: number = 0) {
    const dur = moment.duration(durationInMs ?? 0);
    const durStr = `${dur.hours()} hours and ${dur.minutes()} minutes`;
    return durStr;
  }

  static getFormattedDate(date: string) {
    return moment(date).format("MMMM Do YYYY");
  }
}
