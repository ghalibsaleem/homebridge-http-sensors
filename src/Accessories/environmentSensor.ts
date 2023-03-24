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
      PM2_5:1,
      PM10: 1,
    },
  };


  constructor(private readonly platform: HomebridgeHttpSensonrs,
    private readonly accessory: PlatformAccessory) {
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
    this.initCOSensor(accessory);
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

    setInterval(async () => {
      const url = this.platform.config.sensors.TemperatureSensor.getUrl;
      let data = await getTextData(url);
      if (data < 0.01){
        data = 0.01;
      }
      this.currentStates.TempSensor.CurrentTemperature = data;
      this.temperatureService?.setCharacteristic(this.platform.Characteristic.CurrentTemperature, data);
    }, parseInt(this.platform.config.sensors.TemperatureSensor.pollingInterval));
  }

  async getCurrentTemperature(): Promise<CharacteristicValue> {
    return this.currentStates.TempSensor.CurrentTemperature;
  }

  private initAmbientLightSensor(accessory: PlatformAccessory) {
    this.ambientLightService = this.accessory.getService(this.platform.Service.LightSensor)
      || this.accessory.addService(this.platform.Service.LightSensor);

    this.ambientLightService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.ambientLightService.getCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel)
      .onGet(this.getCurrentAmbientLightLevel.bind(this));
    setInterval(async () => {
      const url = this.platform.config.sensors.AmbientLightSensor.getUrl;
      let data = await getTextData(url);
      if (data < 0.01){
        data = 0.01;
      }
      this.currentStates.AmbientLightSensor.CurrentAmbientLightLevel = data;
      this.ambientLightService?.setCharacteristic(this.platform.Characteristic.CurrentAmbientLightLevel, data);
    }, parseInt(this.platform.config.sensors.AmbientLightSensor.pollingInterval));
  }

  async getCurrentAmbientLightLevel(): Promise<CharacteristicValue> {
    return this.currentStates.AmbientLightSensor.CurrentAmbientLightLevel;
  }

  private initHumiditySensor(accessory: PlatformAccessory) {
    this.humidityService = this.accessory.getService(this.platform.Service.HumiditySensor)
      || this.accessory.addService(this.platform.Service.HumiditySensor);

    this.humidityService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.humidityService.getCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity)
      .onGet(this.getCurrentRelativeHumidity.bind(this));
    setInterval(async () => {
      const url = this.platform.config.sensors.HumiditySensor.getUrl;
      let data = await getTextData(url);
      if (data < 0.01){
        data = 0.01;
      }
      this.currentStates.HumiditySensor.CurrentRelativeHumidity = data;
      this.humidityService?.setCharacteristic(this.platform.Characteristic.CurrentRelativeHumidity, data);
    }, parseInt(this.platform.config.sensors.HumiditySensor.pollingInterval));
  }

  async getCurrentRelativeHumidity(): Promise<CharacteristicValue> {
    return this.currentStates.HumiditySensor.CurrentRelativeHumidity;
  }

  private initCO2Sensor(accessory: PlatformAccessory) {
    this.co2Service = this.accessory.getService(this.platform.Service.CarbonDioxideSensor)
      || this.accessory.addService(this.platform.Service.CarbonDioxideSensor);

    this.co2Service.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.co2Service.getCharacteristic(this.platform.Characteristic.CarbonDioxideLevel)
      .onGet(this.getCarbonDioxideLevel.bind(this));
    setInterval(async () => {
      const url = this.platform.config.sensors.CO2Sensor.getUrl;
      let data = await getTextData(url);
      if (data < 0.01){
        data = 0.01;
      }
      this.currentStates.CO2Sensor.CO2Level = data;
      this.co2Service?.setCharacteristic(this.platform.Characteristic.CarbonDioxideLevel, data);
    }, parseInt(this.platform.config.sensors.CO2Sensor.pollingInterval));
  }

  async getCarbonDioxideLevel(): Promise<CharacteristicValue> {
    return this.currentStates.CO2Sensor.CO2Level;
  }

  private initCOSensor(accessory: PlatformAccessory) {
    this.coService = this.accessory.getService(this.platform.Service.CarbonMonoxideSensor)
      || this.accessory.addService(this.platform.Service.CarbonMonoxideSensor);

    this.coService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.coService.getCharacteristic(this.platform.Characteristic.CarbonMonoxideLevel)
      .onGet(this.getCarbonMonoxideLevel.bind(this));
    setInterval(async () => {
      const url = this.platform.config.sensors.COSensor.getUrl;
      let data = await getTextData(url);
      if (data < 0.01){
        data = 0.01;
      }
      this.currentStates.COSensor.COLevel = data;
      this.coService?.setCharacteristic(this.platform.Characteristic.CarbonMonoxideLevel, data);
    }, parseInt(this.platform.config.sensors.CO2Sensor.pollingInterval));
  }

  async getCarbonMonoxideLevel(): Promise<CharacteristicValue> {
    return this.currentStates.COSensor.COLevel;
  }

  private initAirQualitySensor(accessory: PlatformAccessory) {
    this.airQualityService = this.accessory.getService(this.platform.Service.AirQualitySensor)
      || this.accessory.addService(this.platform.Service.AirQualitySensor);

    this.airQualityService.setCharacteristic(this.platform.Characteristic.Name, accessory.context.device.exampleDisplayName);
    this.airQualityService.getCharacteristic(this.platform.Characteristic.VOCDensity)
      .onGet(this.getVOCDensity.bind(this));
    this.airQualityService.getCharacteristic(this.platform.Characteristic.AirQuality)
      .onGet(this.getAirQuality.bind(this));
    this.airQualityService.getCharacteristic(this.platform.Characteristic.PM10Density)
      .onGet(this.getPM10.bind(this));
    this.airQualityService.getCharacteristic(this.platform.Characteristic.PM2_5Density)
      .onGet(this.getPM2_5.bind(this));

    setInterval(async () => {
      const url = this.platform.config.sensors.AirQualitySensor.getUrl;
      const data = await getJsonData(url);
      this.currentStates.AirQualitySensor.AirQuality = data.AirQuality;
      this.currentStates.AirQualitySensor.VOCDensity = data.VOCDensity;
      this.currentStates.AirQualitySensor.PM2_5 = data.PM2_5;
      this.currentStates.AirQualitySensor.PM10 = data.PM10;
      this.coService?.setCharacteristic(this.platform.Characteristic.CarbonMonoxideLevel, data.VOCDensity);
    }, parseInt(this.platform.config.sensors.AirQualitySensor.pollingInterval));
  }

  async getVOCDensity(): Promise<CharacteristicValue> {
    return this.currentStates.AirQualitySensor.VOCDensity;
  }

  async getPM2_5(): Promise<CharacteristicValue> {
    return this.currentStates.AirQualitySensor.PM2_5;
  }

  async getPM10(): Promise<CharacteristicValue> {
    return this.currentStates.AirQualitySensor.PM10;
  }

  async getAirQuality(): Promise<CharacteristicValue> {
    return this.currentStates.AirQualitySensor.AirQuality;
  }
}
