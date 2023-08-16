import { Measurement } from '@simplified/protocol';
import { StreamPublisher } from '@simplified/shared';
import { Logger } from '@streamr/utils';

const logger = new Logger(module);

const INTERVAL = 1000;

export class Sensor {
	private timer?: NodeJS.Timeout;
	private counter: number = 0;

	constructor(
		private readonly id: string,
		private readonly streamPublisher: StreamPublisher
	) {
		//
	}

	public async start() {
		logger.info('Started');
		this.timer = setInterval(this.onTimer.bind(this), INTERVAL);
	}

	public async stop() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
		logger.info('Stopped');
	}

	private async onTimer() {
		const measurement = new Measurement({
			sensorId: this.id,
			pressure: 1000 + this.counter % 10,
			temperature: 100 + this.counter % 50,
		});
		this.counter++;
		await this.streamPublisher.publish(measurement.serialize());
	}
}
