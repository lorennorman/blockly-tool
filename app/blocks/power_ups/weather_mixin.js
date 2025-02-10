// helper mixin for the weather block
// simplifies juggling the weather api keys by period type
export default {
  // helper to humanize camelCase strings
  keyToLabel: key => {
    const label = key
      // insert spaces before each capital letter
      .replaceAll(/[A-Z]/g, (match) => `\u00A0${match}`)
      // insert a space after a : and upcase the next letter
      .replaceAll(/:[a-z]/g, (match) => `:\u00A0${match.slice(1).toUpperCase()}`)
      // upcase the first letter
      .replace(/^[a-z]/, (match) => match.toUpperCase())

    return label
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

    const propertyOptions = optionKeys.reduce((acc, key) => {
      const label = this.keyToLabel(key)
      acc.push([ label, key ])

      return acc
    }, [])

    return propertyOptions
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
  ]
}
