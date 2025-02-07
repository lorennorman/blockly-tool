export default {
  name: 'Power-Ups',
  colour: 360,

  callback: workspace => {
    const contents = [
      { kind: 'label', text: "Your Configured Power-Ups" },
      { kind: 'label', text: "Weather Locations:" },
    ]

    contents.push.apply(contents, workspace.extensionData?.weatherLocations?.map(location => ({
      kind: 'block',
      type: 'weather',
      fields: {
        LAT: location.lat,
        LON: location.lon,
        POWER_UP_ID: location.powerUpId,
        WEATHER_PROPERTY: location.weatherProperty
      }
    })))

    return contents
  }
}
