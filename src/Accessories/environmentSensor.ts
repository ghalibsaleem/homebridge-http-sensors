import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { HomebridgeHttpSensonrs } from '../platform';

export class EnvironmentSensorPlatformAccessory {
  private temperatureService: Service | undefined;
  private humidityService: Service | undefined;
  private ambientLightService: Service | undefined;
  private co2Service: Service | undefined;
  private coService: Service | undefined;
  private airQualityService: Service | undefined;


  private currentStates = {
    TempSensor: {
      CurrentTemperature: 25,
    },
    HumiditySensor: {
      CurrentRelativeHumidity: 45,
    },
    AmbientLightSensor:{
      CurrentAmbientLightLevel: 50,
    },
    CO2Sensor:{
      CO2Level: 30,
    },
    COSensor:{
      COLevel: 30,
    },
    AirQualitySensor:{
      VOCDensity: 40,
    },
  };


  constructor(private readonly platform: HomebridgeHttpSensonrs,
    private readonly accessory: PlatformAccessory) {

    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Ghalib Saleem')
      .setCharacteristic(this.platform.Characteristic.Model, 'ESP Sensors')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'ES32-001');

    this.initAmbientLightSensor(accessory);
    this.initTemperatureSensor(accessory);
    this.initHumiditySensor(accessory);
    this.initCO2Sensor(accessory);
    this.initCO2Sensor(accessory);
    this.initAirQualitySensor(accessory);

  }

  private initTemperatureSensor(accessory: PlatformAccessory) {
    this.temperatureService = this.accessory.getService(this.platform.Service.TemperatureSensor)
      || this.accessory.addService(this.platform.Service.TemperatureSensor);

    this.temperatureService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.temperatureService.getCharacteristic(this.platform.Characteristic.CurrentTemperature)
      .setProps({
        minValue: -100,
        maxValue: 100,
      })
      .onSet(this.setCurrentTemperature.bind(this))
      .onGet(this.getCurrentTemperature.bind(this));
  }

  async getCurrentTemperature(): Promise<CharacteristicValue> {
    // implement your own code to check if the device is on

    // if you need to return an error to show the device as "Not Responding" in the Home app:
    // throw new this.platform.api.hap.HapStatusError(this.platform.api.hap.HAPStatus.SERVICE_COMMUNICATION_FAILURE);


    return this.currentStates.TempSensor.CurrentTemperature;
  }

  async setCurrentTemperature(value: CharacteristicValue) {
    // implement your own code to turn your device on/off

  }

  private initAmbientLightSensor(accessory: PlatformAccessory) {
    this.ambientLightService = this.accessory.getService(this.platform.Service.LightSensor)
      || this.accessory.addService(this.platform.Service.LightSensor);

    this.ambientLightService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.ambientLightService.getCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel)
      .onSet(this.setCurrentAmbientLightLevel.bind(this))
      .onGet(this.getCurrentAmbientLightLevel.bind(this));
  }

  async getCurrentAmbientLightLevel(): Promise<CharacteristicValue> {
    return this.currentStates.AmbientLightSensor.CurrentAmbientLightLevel;
  }

  async setCurrentAmbientLightLevel(value: CharacteristicValue) {
    // implement your own code to turn your device on/off

  }

  private initHumiditySensor(accessory: PlatformAccessory) {
    this.humidityService = this.accessory.getService(this.platform.Service.HumiditySensor)
      || this.accessory.addService(this.platform.Service.HumiditySensor);

    this.humidityService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.humidityService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .onSet(this.setCurrentRelativeHumidity.bind(this))
      .onGet(this.getCurrentRelativeHumidity.bind(this));
  }

  async getCurrentRelativeHumidity(): Promise<CharacteristicValue> {
    return this.currentStates.HumiditySensor.CurrentRelativeHumidity;
  }

  async setCurrentRelativeHumidity(value: CharacteristicValue) {
    // implement your own code to turn your device on/off

  }

  private initCO2Sensor(accessory: PlatformAccessory) {
    this.co2Service = this.accessory.getService(this.platform.Service.CarbonDioxideSensor)
      || this.accessory.addService(this.platform.Service.CarbonDioxideSensor);

    this.co2Service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.co2Service.getCharacteristic(this.platform.Characteristic.CarbonDioxideLevel)
      .onSet(this.setCarbonDioxideLevel.bind(this))
      .onGet(this.getCarbonDioxideLevel.bind(this));
  }

  async getCarbonDioxideLevel(): Promise<CharacteristicValue> {
    return this.currentStates.CO2Sensor.CO2Level;
  }

  async setCarbonDioxideLevel(value: CharacteristicValue) {
    // implement your own code to turn your device on/off

  }

  private initCOSensor(accessory: PlatformAccessory) {
    this.coService = this.accessory.getService(this.platform.Service.CarbonMonoxideSensor)
      || this.accessory.addService(this.platform.Service.CarbonMonoxideSensor);

    this.coService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.coService.getCharacteristic(this.platform.Characteristic.CarbonMonoxideLevel)
      .onSet(this.setCarbonMonoxideLevel.bind(this))
      .onGet(this.getCarbonMonoxideLevel.bind(this));
  }

  async getCarbonMonoxideLevel(): Promise<CharacteristicValue> {
    return this.currentStates.COSensor.COLevel;
  }

  async setCarbonMonoxideLevel(value: CharacteristicValue) {
    // implement your own code to turn your device on/off

  }

  private initAirQualitySensor(accessory: PlatformAccessory) {
    this.airQualityService = this.accessory.getService(this.platform.Service.AirQualitySensor)
      || this.accessory.addService(this.platform.Service.AirQualitySensor);

    this.airQualityService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.airQualityService.getCharacteristic(this.platform.Characteristic.VOCDensity)
      .onSet(this.setVOCDensity.bind(this))
      .onGet(this.getVOCDensity.bind(this));
  }

  async getVOCDensity(): Promise<CharacteristicValue> {
    return this.currentStates.AirQualitySensor.VOCDensity;
  }

  async setVOCDensity(value: CharacteristicValue) {
    // implement your own code to turn your device on/off

  }
}
