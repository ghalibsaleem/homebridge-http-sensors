import { Service, PlatformAccessory, CharacteristicValue, PlatformConfig } from 'homebridge';

import { HomebridgeHttpSensonrs } from '../platform';
import { beginPuller } from '../Utilities/executor';
import { getTextData, getJsonData } from '../network/fetchData';

export class EnvironmentSensorPlatformAccessory {
  private temperatureService: Service | undefined;
  private humidityService: Service | undefined;
  private ambientLightService: Service | undefined;
  private co2Service: Service | undefined;
  private coService: Service | undefined;
  private airQualityService: Service | undefined;
  private globalConfig: PlatformConfig;


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
      AirQuality: 1,
      VOCDensity: 40,
    },
  };


  constructor(private readonly platform: HomebridgeHttpSensonrs,
    private readonly accessory: PlatformAccessory,
    public readonly config: PlatformConfig) {
    this.globalConfig = config;
    // set accessory information
    this.accessory.getService(this.platform.Service.AccessoryInformation)!
      .setCharacteristic(this.platform.Characteristic.Manufacturer, 'Ghalib Saleem')
      .setCharacteristic(this.platform.Characteristic.Model, 'ESP Sensors')
      .setCharacteristic(this.platform.Characteristic.SerialNumber, 'ES32-001');
    //this.config = config;

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
      .onGet(this.getCurrentTemperature.bind(this));
    beginPuller(this.setCurrentTemperature, 5000);
  }

  async getCurrentTemperature(): Promise<CharacteristicValue> {
    return this.currentStates.TempSensor.CurrentTemperature;
  }

  private async setCurrentTemperature() {
    const url = this.globalConfig.sensors.TemperatureSensor.getUrl;
    const data = await getTextData(url);
    this.currentStates.TempSensor.CurrentTemperature = data;
    this.temperatureService?.setCharacteristic(this.platform.Characteristic.CurrentTemperature, data);
  }

  private initAmbientLightSensor(accessory: PlatformAccessory) {
    this.ambientLightService = this.accessory.getService(this.platform.Service.LightSensor)
      || this.accessory.addService(this.platform.Service.LightSensor);

    this.ambientLightService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.ambientLightService.getCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel)
      .onGet(this.getCurrentAmbientLightLevel.bind(this));
    beginPuller(this.setCurrentAmbientLightLevel, 5000);
  }

  async getCurrentAmbientLightLevel(): Promise<CharacteristicValue> {
    return this.currentStates.AmbientLightSensor.CurrentAmbientLightLevel;
  }

  private async setCurrentAmbientLightLevel() {
    const url = this.globalConfig.sensors.AmbientLightSensor.getUrl;
    const data = await getTextData(url);
    this.currentStates.AmbientLightSensor.CurrentAmbientLightLevel = data;
    this.ambientLightService?.setCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, data);
  }

  private initHumiditySensor(accessory: PlatformAccessory) {
    this.humidityService = this.accessory.getService(this.platform.Service.HumiditySensor)
      || this.accessory.addService(this.platform.Service.HumiditySensor);

    this.humidityService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.humidityService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .onGet(this.getCurrentRelativeHumidity.bind(this));
    beginPuller(this.setCurrentRelativeHumidity, 5000);
  }

  async getCurrentRelativeHumidity(): Promise<CharacteristicValue> {
    return this.currentStates.HumiditySensor.CurrentRelativeHumidity;
  }

  private async setCurrentRelativeHumidity() {
    const url = this.globalConfig.sensors.HumiditySensor.getUrl;
    const data = await getTextData(url);
    this.currentStates.HumiditySensor.CurrentRelativeHumidity = data;
    this.humidityService?.setCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, data);
  }

  private initCO2Sensor(accessory: PlatformAccessory) {
    this.co2Service = this.accessory.getService(this.platform.Service.CarbonDioxideSensor)
      || this.accessory.addService(this.platform.Service.CarbonDioxideSensor);

    this.co2Service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.co2Service.getCharacteristic(this.platform.Characteristic.CarbonDioxideLevel)
      .onGet(this.getCarbonDioxideLevel.bind(this));
    beginPuller(this.setCarbonDioxideLevel, 5000);
  }

  async getCarbonDioxideLevel(): Promise<CharacteristicValue> {
    return this.currentStates.CO2Sensor.CO2Level;
  }

  private async setCarbonDioxideLevel() {
    const url = this.globalConfig.sensors.CO2Sensor.getUrl;
    const data = await getTextData(url);
    this.currentStates.CO2Sensor.CO2Level = data;
    this.co2Service?.setCharacteristic(this.platform.Characteristic.CarbonDioxideLevel, data);
  }

  private initCOSensor(accessory: PlatformAccessory) {
    this.coService = this.accessory.getService(this.platform.Service.CarbonMonoxideSensor)
      || this.accessory.addService(this.platform.Service.CarbonMonoxideSensor);

    this.coService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.coService.getCharacteristic(this.platform.Characteristic.CarbonMonoxideLevel)
      .onGet(this.getCarbonMonoxideLevel.bind(this));
    beginPuller(this.setCarbonMonoxideLevel, 5000);
  }

  async getCarbonMonoxideLevel(): Promise<CharacteristicValue> {
    return this.currentStates.COSensor.COLevel;
  }

  private async setCarbonMonoxideLevel() {
    const url = this.globalConfig.sensors.COSensor.getUrl;
    const data = await getTextData(url);
    this.currentStates.COSensor.COLevel = data;
    this.coService?.setCharacteristic(this.platform.Characteristic.CarbonMonoxideLevel, data);

  }

  private initAirQualitySensor(accessory: PlatformAccessory) {
    this.airQualityService = this.accessory.getService(this.platform.Service.AirQualitySensor)
      || this.accessory.addService(this.platform.Service.AirQualitySensor);

    this.airQualityService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.airQualityService.getCharacteristic(this.platform.Characteristic.VOCDensity)
      .onGet(this.getVOCDensity.bind(this));
    this.airQualityService.getCharacteristic(this.platform.Characteristic.AirQuality)
      .onGet(this.getAirQuality.bind(this));
    //beginPuller(this.setAirQuality, 5000);
  }

  async getVOCDensity(): Promise<CharacteristicValue> {
    return this.currentStates.AirQualitySensor.VOCDensity;
  }

  async getAirQuality(): Promise<CharacteristicValue> {
    return this.currentStates.AirQualitySensor.AirQuality;
  }

  private async setAirQuality() {
    const url = this.globalConfig.sensors.AirQualitySensor.getUrl;
    const data = await getJsonData(url);
    this.currentStates.AirQualitySensor.AirQuality = data.AirQuality;
    this.currentStates.AirQualitySensor.VOCDensity = data.VOCDensity;
    this.airQualityService?.setCharacteristic(this.platform.Characteristic.VOCDensity, data.VOCDensity);
  }
}
