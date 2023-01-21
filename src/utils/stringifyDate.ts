import moment from "moment"

function stringifyDate(date: any) {
    return `${moment(new Date(date)).format("DD/MM/YYYY")} à ${moment(
        new Date(date)
    ).format("HH:mm")}`
}

export default stringifyDate
