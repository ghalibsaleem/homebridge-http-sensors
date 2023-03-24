import { Service, PlatformAccessory, CharacteristicValue } from 'homebridge';

import { HomebridgeHttpSensonrs } from '../platform';
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

    this.initAmbientLightSensor();
    this.initTemperatureSensor();
    this.initHumiditySensor();
    this.initCO2Sensor();
    this.initCOSensor();
    this.initAirQualitySensor();


  }

  private initTemperatureSensor() {
    this.temperatureService = this.accessory.getService(this.platform.Service.TemperatureSensor)
      || this.accessory.addService(this.platform.Service.TemperatureSensor);

    this.temperatureService.setCharacteristic(this.platform.Characteristic.Name, this.platform.config.sensors.TemperatureSensor.name);
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

  private initAmbientLightSensor() {
    this.ambientLightService = this.accessory.getService(this.platform.Service.LightSensor)
      || this.accessory.addService(this.platform.Service.LightSensor);

    this.ambientLightService.setCharacteristic(this.platform.Characteristic.Name, this.platform.config.sensors.AmbientLightSensor.name);
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

  private initHumiditySensor() {
    this.humidityService = this.accessory.getService(this.platform.Service.HumiditySensor)
      || this.accessory.addService(this.platform.Service.HumiditySensor);

    this.humidityService.setCharacteristic(this.platform.Characteristic.Name, this.platform.config.sensors.HumiditySensor.name);
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

  private initCO2Sensor() {
    this.co2Service = this.accessory.getService(this.platform.Service.CarbonDioxideSensor)
      || this.accessory.addService(this.platform.Service.CarbonDioxideSensor);

    this.co2Service.setCharacteristic(this.platform.Characteristic.Name, this.platform.config.sensors.CO2Sensor.name);
    this.co2Service.getCharacteristic(this.platform.Characteristic.CarbonDioxideLevel)
      .onGet(this.getCarbonDioxideLevel.bind(this));
    this.co2Service.getCharacteristic(this.platform.Characteristic.CarbonDioxideDetected)
      .onGet(this.getCarbonDioxideDetected.bind(this));
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

  async getCarbonDioxideDetected(): Promise<CharacteristicValue> {
    let threshold = 1000;
    if (this.platform.config.sensors.CO2Sensor.threshold){
      threshold = this.platform.config.sensors.CO2Sensor.threshold;
    }

    if (this.currentStates.CO2Sensor.CO2Level > threshold) {
      return true;
    }
    return false;
  }

  private initCOSensor() {
    this.coService = this.accessory.getService(this.platform.Service.CarbonMonoxideSensor)
      || this.accessory.addService(this.platform.Service.CarbonMonoxideSensor);

    this.coService.setCharacteristic(this.platform.Characteristic.Name, this.platform.config.sensors.COSensor.name);
    this.coService.getCharacteristic(this.platform.Characteristic.CarbonMonoxideLevel)
      .onGet(this.getCarbonMonoxideLevel.bind(this));
    this.coService.getCharacteristic(this.platform.Characteristic.CarbonMonoxideDetected)
      .onGet(this.getCarbonMonoxideDetected.bind(this));
    setInterval(async () => {
      const url = this.platform.config.sensors.COSensor.getUrl;
      let data = await getTextData(url);
      data = 3;
      if (data < 0.01){
        data = 0.01;
      }
      this.currentStates.COSensor.COLevel = data;
      this.coService?.setCharacteristic(this.platform.Characteristic.CarbonMonoxideLevel, data);
    }, parseInt(this.platform.config.sensors.COSensor.pollingInterval));
  }

  async getCarbonMonoxideLevel(): Promise<CharacteristicValue> {
    return this.currentStates.COSensor.COLevel;
  }

  async getCarbonMonoxideDetected(): Promise<CharacteristicValue> {
    let threshold = 1000;
    if (this.platform.config.sensors.COSensor.threshold){
      threshold = this.platform.config.sensors.COSensor.threshold;
    }

    if (this.currentStates.COSensor.COLevel > threshold) {
      return true;
    }
    return false;
  }

  private initAirQualitySensor() {
    this.airQualityService = this.accessory.getService(this.platform.Service.AirQualitySensor)
      || this.accessory.addService(this.platform.Service.AirQualitySensor);

    this.airQualityService.setCharacteristic(this.platform.Characteristic.Name, this.platform.config.sensors.AirQualitySensor.name);
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
      this.currentStates.AirQualitySensor.AirQuality = data.air_quality;
      this.currentStates.AirQualitySensor.VOCDensity = data.voc;
      this.currentStates.AirQualitySensor.PM2_5 = data.pm2_5;
      this.currentStates.AirQualitySensor.PM10 = data.pm10;
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
