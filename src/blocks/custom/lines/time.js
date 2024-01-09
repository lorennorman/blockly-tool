import { map, range } from 'lodash-es'

export const
  minuteLine = [ "...at minute:", {
    field: "AT_MINUTE",
    options: map(map(range(60), String), idx => ([ idx, idx ]))
  }],

  cronMinute = block => parseInt(block.getFieldValue('AT_MINUTE'), 10),

  cronTime = block => {
    const
      isPm = block.getFieldValue('AM_PM') === "pm",
      hour = parseInt(block.getFieldValue('AT_HOUR'), 10) + (isPm ? 12 : 0),
      minute = cronMinute(block)

    return `${minute} ${hour}`
  }

export default [
  [ "...at hour:", {
    field: "AT_HOUR",
    options: map(range(1, 13), hour => ([ hour.toString(), (hour%12).toString() ]))
  }],

  minuteLine,

  [ "", {
    field: "AM_PM",
    options: [
      ["AM", "am"],
      ["PM", "pm"],
    ]
  }]
]
