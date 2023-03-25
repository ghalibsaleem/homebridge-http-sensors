
<p align="center">

<img src="https://github.com/homebridge/branding/raw/master/logos/homebridge-wordmark-logo-vertical.png" width="150">

</p>


# Homebridge Platform Plugin For Sensors over HTTP

This repository contains a Homebridge plugin that enables you to integrate various sensors, such as temperature, humidity, CO2, CO, ambient light or air quality, that have an HTTP API into HomeKit. With this plugin, you can easily monitor and control your sensor data using your Apple Home app on your iOS devices.

The Homebridge platform is an open-source software package that runs on a variety of platforms, including macOS, Linux, and Windows. It emulates the HomeKit API and allows you to connect non-HomeKit devices to the Home app. This plugin extends the functionality of Homebridge by allowing you to integrate sensors with an HTTP API into your smart home ecosystem.

## Install Development Dependencies

Before proceeding with the installation, make sure that you have Homebridge installed on your system. If you haven't installed it yet, you can follow the instructions provided in the [Homebridge documentation](https://github.com/homebridge/homebridge/wiki).

Once you have Homebridge installed, you can install this plugin using the following command:

```
sudo npm install -g homebridge-http-sensors
```
The `sudo` command is required to install the plugin globally on your system. If you are running Homebridge using a non-root user, you may need to run the command without `sudo`.

After the installation is complete, you can add the plugin to your Homebridge configuration file. The configuration file is typically located at `~/.homebridge/config.json`. If the file doesn't exist yet, create it with the following content:

```
{
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "031-45-154"
    },
    "platforms": [
        {
            "platform": "HomebridgeHttpSensonrs",
            "sensors": {}
        }
    ]
}
```

In the platforms section of the configuration file, add the following object to register the plugin:

```
{
    "platform": "HomebridgeHttpSensonrs",
    "sensors": {}
}
```
You can now configure your sensors by adding them to the `sensors` object. See the Configuration section for more information on how to configure your sensors.

Restart Homebridge for the changes to take effect:

```
sudo systemctl restart homebridge
```

You can now add your sensors to the Home app on your iOS device. Open the Home app, tap the "+" icon to add a new accessory, and scan the HomeKit code displayed by Homebridge. Your sensors should now be available in the Home app.

### Configuration
To configure the plugin, you need to add your sensors to the `sensors` object in the Homebridge configuration file. The `sensors` object should contain one or more sensor objects, each representing a single sensor. The following sensor types are supported:

- TemperatureSensor
- HumiditySensor
- CO2Sensor
- COSensor
- AmbientLightSensor
- AirQualitySensor

Each sensor object should have the following properties:

- `getUrl` (required): the URL of the sensor's HTTP API.
- `name` (required): the name of the sensor that will be displayed in the Home app.
- `pollingInterval` (required): the polling interval in milliseconds. The default value is 10000 (10 seconds).
- `threshold` (optional) (Only Valid for CO2 or CO): the threshold value for the sensor. If the sensor value is above this threshold, the sensor will be displayed as "CO2/CO Detected" in the Home app.


Here is an example configuration with sensors::
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

You can add or remove sensors as needed. Make sure to follow the structure of the example configuration file. Once you have updated the configuration file, restart Homebridge for the changes to take effect:

```
sudo systemctl restart homebridge
```

Note: The structure should be exactly same. You can update the `getUrl`, `name`, `pollingInterval` and `threshold` of the config.