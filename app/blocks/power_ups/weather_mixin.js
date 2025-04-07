// helper mixin for the weather block
// simplifies juggling the weather api keys by period type
export default {
  // helper to humanize camelCase strings
  keyToLabel: function(key) {
    const label = key
      // insert spaces before each capital letter
      .replaceAll(/[A-Z]/g, (match) => `\u00A0${match}`)
      // insert a space after a : and upcase the next letter
      .replaceAll(/:[a-z]/g, (match) => `:\u00A0${match.slice(1).toUpperCase()}`)
      // upcase the first letter
      .replace(/^[a-z]/, (match) => match.toUpperCase())

    return label
  },

  keyToHelpObject: function(key) {
    const keyWithoutDayPart = key.split(":").pop()

    return this.HELP_TEXT_BY_PROP[keyWithoutDayPart] || {}
  },

  keyToTooltip: function(key) {
    const { description="" } = this.keyToHelpObject(key)

    return `${this.keyToLabel(key)}:\n  ${description}`
  },

  keyToCurrent: function(key) {
    const { values="unknown" } = this.keyToHelpObject(key)

    return values
  },

  propertyOptionsForTime: function(timeKey) {
    let optionKeys
    if(timeKey === 'current') {
      optionKeys = this.CURRENT_PROPS

    } else if(timeKey.match(/minutes/)) {
      optionKeys = this.MINUTE_PROPS

    } else if(timeKey.match(/hours/)) {
      optionKeys = this.HOUR_PROPS

    } else if(timeKey.match(/days/)) {
      optionKeys = this.DAY_PROPS.concat(
        this.DAYTIME_OVERNIGHT_PROPS.flatMap(prop =>
          [`daytime:${prop}`, `overnight:${prop}` ]
        )
      )

    } else {
      throw new Error(`[mixins.weather] timeKey not recognized: ${timeKey}`)
    }

    // TODO: is there a way to add tooltips for each option as well?
    const propertyOptions = optionKeys.reduce((acc, key) => {
      const
        name = this.keyToLabel(key),
        current = this.keyToCurrent(key),
        label = `${name} (Now: ${current})`

      acc.push([ label, key ])

      return acc
    }, [])

    return propertyOptions
  },

  updateHelpTextForWeatherProperty: function(propertyKey) {
    const
      propertyField = this.getField("WEATHER_PROPERTY"),
      helpField = this.getField("WEATHER_PROPERTY_HELP")

    if(!propertyKey) {
      propertyKey = propertyField.getValue()
    }

    const
      helpText = this.keyToTooltip(propertyKey),
      current = this.keyToCurrent(propertyKey)

    // set a metric tooltip on dropdown and help text
    propertyField.setTooltip(helpText)
    helpField.setTooltip(helpText)

    // update the help text with examples for this metric
    helpField.setValue(`Now: ${current}`)
  },

  CURRENT_PROPS: [
    // 'asOf',
    'cloudCover',
    'cloudCoverLowAltPct',
    'cloudCoverMidAltPct',
    'cloudCoverHighAltPct',
    'conditionCode',
    'daylight',
    'humidity',
    'precipitationIntensity',
    'pressure',
    'pressureTrend',
    'temperature',
    'temperatureApparent',
    'temperatureDewPoint',
    'uvIndex',
    'visibility',
    'windDirection',
    'windGust',
    'windSpeed'
  ],

  MINUTE_PROPS: [
    // 'startTime',
    'precipitationChance',
    'precipitationIntensity'
  ],

  HOUR_PROPS: [
    // 'forecastStart',
    'cloudCover',
    'conditionCode',
    'daylight',
    'humidity',
    'precipitationAmount',
    'precipitationIntensity',
    'precipitationChance',
    'precipitationType',
    'pressure',
    'pressureTrend',
    'snowfallIntensity',
    'snowfallAmount',
    'temperature',
    'temperatureApparent',
    'temperatureDewPoint',
    'uvIndex',
    'visibility',
    'windDirection',
    'windGust',
    'windSpeed'
  ],

  DAY_PROPS: [
    // 'forecastStart',
    // 'forecastEnd',
    'conditionCode',
    'maxUvIndex',
    'moonPhase',
    'moonrise',
    'moonset',
    'precipitationAmount',
    'precipitationChance',
    'precipitationType',
    'snowfallAmount',
    'solarMidnight',
    'solarNoon',
    'sunrise',
    'sunriseCivil',
    'sunriseNautical',
    'sunriseAstronomical',
    'sunset',
    'sunsetCivil',
    'sunsetNautical',
    'sunsetAstronomical',
    'temperatureMax',
    'temperatureMin',
    'windGustSpeedMax',
    'windSpeedAvg',
    'windSpeedMax',
  ],

  DAYTIME_OVERNIGHT_PROPS: [
    // 'forecastStart',
    // 'forecastEnd',
    'cloudCover',
    'conditionCode',
    'humidity',
    'precipitationAmount',
    'precipitationChance',
    'precipitationType',
    'snowfallAmount',
    'temperatureMax',
    'temperatureMin',
    'windDirection',
    'windGustSpeedMax',
    'windSpeed',
    'windSpeedMax'
  ],

  HELP_TEXT_BY_PROP: {
    cloudCover: {
      values: "0.0",
      description: "The percentage of the sky covered with clouds during the period."
    },
    cloudCoverLowAltPct: {
      values: "0.0",
      description: "The percentage of the sky covered with low-altitude clouds (1800m and below) during the period."
    },
    cloudCoverMidAltPct: {
      values: "0.0",
      description: "The percentage of the sky covered with mid-altitude clouds (1800m to 6300m) during the period."
    },
    cloudCoverHighAltPct: {
      values: "0.0",
      description: "The percentage of the sky covered with high-altitude clouds (6300m and above) during the period."
    },
    conditionCode: {
      values: '"Clear"',
      description: "Weather conditions at the given time, one of: BlowingDust, Clear, MostlyClear, PartlyCloudy, MostlyCloudy, Cloudy, Foggy, Haze, Smoky, Breezy, Windy, Drizzle, Rain, HeavyRain, IsolatedThunderstorms, ScatteredThunderstorms, Thunderstorms, StrongStorms, SunShowers, Frigid, Hail, Hot, Flurries, Sleet, Snow, SunFlurries, WintryMix, Blizzard, BlowingSnow, FreezingDrizzle, FreezingRain, HeavySnow, Hurricane, TroicalStorm"
    },
    daylight: {
      values: "true",
      description: "Is there daylight at this time?"
    },
    humidity: {
      values: "0.0",
      description: "Relative humidity as a percentage of the total water vapor the air can hold at this temperature."
    },
    precipitationIntensity: {
      values: "13.2",
      description: "Precipitation intensity measured in millimeters per hour"
    },
    pressure: {
      values: "1,013.25",
      description: "The sea level air pressure, in millibars."
    },
    pressureTrend: {
      values: '"rising"',
      description: "A string indicating the sea level air pressure trend during this period."
    },
    temperature: {
      values: "22.7",
      description: "Temperature in degrees Celsius during this period."
    },
    temperatureApparent: {
      values: "38.5...",
      description: "The feels-like temperature when factoring wind and humidity, in degrees Celsius during this period."
    },
    temperatureDewPoint: {
      values: "26.3",
      description: "The temperature at which relative humidity is 100%, in degrees Celsius during this period."
    },
    uvIndex: {
      values: "5",
      description: "The level of ultraviolet radiation during this period."
    },
    visibility: {
      values: "28520.77",
      description: "The distance at which terrain is visible, in meters. Under 1,000 is considered \"low visibilty\""
    },
    windDirection: {
      values: "0",
      description: "The direction of the wind, in degrees. 0: north, 90: east, 180: south, 270: west"
    },
    windGust: {
      values: "0.0",
      description: "The maximum wind gust speed, in kilometers per hour."
    },
    windSpeed: {
      values: "0.0",
      description: "The wind speed, in kilometers per hour."
    },
    precipitationChance: {
      values: "0.0",
      description: "The probability of precipitation during this minute."
    },
    precipitationAmount: {
      values: "0.0",
      description: "The amount of precipitation forecasted to occur during period, in millimeters."
    },
    precipitationType: {
      values: '"rain"',
      description: "The type of precipitation forecasted to occur during the period, one of: clear, precipitation, rain, snow, sleet, hail, mixed"
    },
    snowfallIntensity: {
      values: "0.0",
      description: "The rate at which snow crystals are falling, in millimeters per hour."
    },
    snowfallAmount: {
      values: "0.0",
      description: "The depth of snow as ice crystals forecasted to occur during the period, in millimeters."
    },
    maxUvIndex: {
      values: "0",
      description: "The maximum ultraviolet index value during the day."
    },
    moonPhase: {
      values: '"firstQuarter"',
      description: "The phase of the moon on the specified day, one of: new, waxingCrescent, firstQuarter, waxingGibbous, full, waningGibbous, thirdQuarter, or waningCrescent."
    },
    moonrise: {
      values: "2000-01-01T00:00:00Z",
      description: "The time of moonrise on the specified day."
    },
    moonset: {
      values: "2000-01-01T00:00:00Z",
      description: "The time of moonset on the specified day."
    },
    solarMidnight: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the sun is lowest in the sky."
    },
    solarNoon: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the sun is highest in the sky."
    },
    sunrise: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the top edge of the sun reaches the horizon in the morning."
    },
    sunriseCivil: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the sun is 6 degrees below the horizon in the morning."
    },
    sunriseNautical: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the sun is 12 degrees below the horizon in the morning."
    },
    sunriseAstronomical: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the sun is 18 degrees below the horizon in the morning."
    },
    sunset: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the top edge of the sun reaches the horizon in the evening."
    },
    sunsetCivil: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the sun is 6 degrees below the horizon in the evening."
    },
    sunsetNautical: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the sun is 12 degrees below the horizon in the evening."
    },
    sunsetAstronomical: {
      values: "2000-01-01T00:00:00Z",
      description: "The time when the sun is 18 degrees below the horizon in the evening."
    },
    temperatureMax: {
      values: "33.2",
      description: "The maximum temperature forecasted to occur during the day, in degrees Celsius."
    },
    temperatureMin: {
      values: "24.8",
      description: "The minimum temperature forecasted to occur during the day, in degrees Celsius."
    },
    windGustSpeedMax: {
      values: "0.0",
      description: "The maximum speed wind is expected to gust to over the period, in kilometers per hour."
    },
    windSpeedAvg: {
      values: "0.0",
      description: "The average expected wind speed over the period, in kilometers per hour."
    },
    windSpeedMax: {
      values: "0.0",
      description: "The maximum expected wind speed over the period, in kilometers per hour."
    },
  }
}
