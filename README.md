
<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>


# Homebridge Platform Plugin For Sensors over HTTP

This Homebridge plugin can be used integrate your temperature, Humidity, CO2, CO, Ambient Light or Air Quality sensor which has a http api into HomeKit.

## Install Development Dependencies

Make sure that you have homedridge installed and then execute this command.

```
sudo npm install -g homebridge-http-sensors
```

Sample Config:
```
{
    "name": "Bedroom",
    "platform": "HomebridgeHttpSensonrs",
    "sensors": {
        "TemperatureSensor": {
            "getUrl": "http://192.168.1.179/temperature",
            "name": "Temperature",
            "pollingInterval": 10000
        },
        "HumiditySensor": {
            "getUrl": "http://192.168.1.179/humidity",
            "name": "Humidity",
            "pollingInterval": 10000
        },
        "CO2Sensor": {
            "getUrl": "http://192.168.1.179/eco2",
            "name": "CO2",
            "pollingInterval": 50000,
            "threshold": 1000
        },
        "COSensor": {
            "getUrl": "http://192.168.1.179/eco2",
            "name": "CO",
            "pollingInterval": 100000,
            "threshold": 1000
        },
        "AmbientLightSensor": {
            "getUrl": "http://192.168.1.179/ambientlight",
            "name": "AMbient Light",
            "pollingInterval": 70000
        },
        "AirQualitySensor": {
            "getUrl": "http://192.168.1.179/airquality",
            "name": "Air Quality",
            "pollingInterval": 100000
        }
    }
}
```

Note: The structure should be exactly same. You can update the `getUrl`, `name`, `pollingInterval` and `threshold` of the config.