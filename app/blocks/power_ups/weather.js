const
  random = Math.random()*100000000, // busts the NodeJS file cache
  weatherMixin = (await import(`./weather_mixin.js?key=${random}`)).default

export default {
  type: "weather",

  toolbox: {
    label: "Retrieve current or forecast weather information for a pre-configured location."
  },

  visualization: {
    colour: 360,
    tooltip: "Current and forecast weather conditions"
  },

  mixins: [
    'replaceDropdownOptions',
    { weatherMixin }
  ],

  extensions: {
    weatherTimeChangesProperties:  ({ block, data, Blockly }) => {
      const weatherTimeField = block.getField('WEATHER_TIME')

      // when the user selects a time option
      weatherTimeField.setValidator(function(weatherTimeKey) {
        // call the mixin to get the new options
        const options = block.propertyOptionsForTime(weatherTimeKey)
        // update the property options
        block.replaceDropdownOptions("WEATHER_PROPERTY", options)
      })
    }
  },

  lines: [
    [ "Weather at...", "CENTER" ],

    [ "lat/lon: [%LAT,%LON]", {
      align: 'CENTER',
      fields: {
        LAT: { serializable_label: '0.0' },
        LON: { serializable_label: '0.0' },
      }
    }],

    [ "When:", {
      field: "WEATHER_TIME",
      options: [
        [ "Now", "current"],
        [ "In 5 minutes", "forecast_minutes_5"],
        [ "In 30 minutes", "forecast_minutes_30"],
        [ "In 1 hour", "forecast_hours_1"],
        [ "In 2 hours", "forecast_hours_2"],
        [ "In 6 hours", "forecast_hours_6"],
        [ "In 12 hours", "forecast_hours_12"],
        [ "In 24 hours", "forecast_hours_24"],
        [ "Tomorrow", "forecast_days_1"],
        [ "Day after tomorrow", "forecast_days_2"],
        [ "5 days from now", "forecast_days_5"],
      ]
    }],

    [ "Property:", {
      field: "WEATHER_PROPERTY",
      options: [
        [ "Temperature F", "tempF"],
        [ "Temperature C", "tempC"],
        [ "Humidty", "humidty"],
        [ "Cloud Cover", "cloudCover"],
        [ "Pressure", "pressure"],
        [ "Conditions", "conditions"],
        [ "Daylight", "daylight"],
      ]
    }],

    [ "(PowerUp ID:%POWER_UP_ID)", {
      field: "POWER_UP_ID",
      serializable_label: 'N/A'
    }],
  ],

  generators: {
    json: block => {
      const
        lat = block.getFieldValue('LAT'),
        lon = block.getFieldValue('LON'),
        powerUpId = block.getFieldValue('POWER_UP_ID'),
        weatherProperty = block.getFieldValue('WEATHER_PROPERTY'),
        payload = JSON.stringify({
          weather: {
            powerUpId, lat, lon, weatherProperty
          }
        })

      return [ payload, 0 ]
    }
  },

  regenerators: {
    json: blockObject => {
      const payload = blockObject.weather

      return {
        type: "weather",
        fields: {
          LAT: payload.lat,
          LON: payload.lon,
          POWER_UP_ID: payload.powerUpId,
          WEATHER_PROPERTY: payload.weatherProperty,
        }
      }
    }
  }
}
