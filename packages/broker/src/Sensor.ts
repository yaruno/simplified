import { Measurement } from '@simplified/protocol';
import { StreamPublisher } from '@simplified/shared';
import { Logger } from '@streamr/utils';

const logger = new Logger(module);

const INTERVAL_FAST = 50;
const INTERVAL_SLOW = 50;
const THRESHOLD = 0;

export class Sensor {
	private timer?: NodeJS.Timeout;
	private counter: number = 0;

	constructor(
		private readonly id: string,
		private readonly streamPublisher: StreamPublisher
	) {
		//
	}

	public async start(interval: number = INTERVAL_FAST) {
		logger.info('Started', { interval });
		this.timer = setInterval(this.onTimer.bind(this), interval);
	}

	public async stop() {
		if (this.timer) {
			clearInterval(this.timer);
			this.timer = undefined;
		}
		logger.info('Stopped');
	}

	private async onTimer() {
		if (this.counter === THRESHOLD) {
			logger.info('Threshold reached. Switching to slower interval', { THRESHOLD });
			this.stop();
			this.start(INTERVAL_SLOW);
		}

		const measurement = new Measurement({
			sensorId: this.id,
			pressure: 1000 + this.counter % 10,
			temperature: 100 + this.counter % 50,
		});
		this.counter++;
		await this.streamPublisher.publish(measurement.serialize());
		//console.log('msg sent at: ', Date.now())

		
	}
}
