import moment from "moment"

export default function stringifyDate(date: any) {
    return `${moment(new Date(date)).format("DD/MM/YYYY")} at ${moment(
        new Date(date)
    ).format("HH:mm")}`
}
