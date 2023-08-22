import { Stream, StreamrClient } from 'streamr-client';

export class StreamPublisher {
	private partitions: number;
	private counter: number = 0;

	constructor(
		private readonly client: StreamrClient,
		private readonly stream: Stream
	) {
		this.partitions = this.stream.getMetadata().partitions;
	}

	public async publish(message: unknown) {
		const partition = this.counter % this.partitions;

		try {

			await this.client.publish(
				{
					id: this.stream.id,
					partition,
				},
				message
			);
		}
		catch(e) {
			console.log('something went horribly wrong while publishing', e)
		}

		this.counter++;
	}
}
