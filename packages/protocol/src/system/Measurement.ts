import {
	SystemMessage,
	SystemMessageOptions,
	SystemMessageType,
} from './SystemMessage';

interface MeasurementOptions extends SystemMessageOptions {
	sensorId: string;
	pressure: number;
	temperature: number;
}

export class Measurement extends SystemMessage {
	sensorId: string;
	pressure: number;
	temperature: number;

	constructor({
		version = SystemMessage.LATEST_VERSION,
		sensorId,
		pressure,
		temperature,
	}: MeasurementOptions) {
		super(version, SystemMessageType.Measurement);

		this.sensorId = sensorId;
		this.pressure = pressure;
		this.temperature = temperature;
	}
}
