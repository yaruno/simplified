import { SystemMessage, SystemMessageType } from '@simplified/protocol';
import { StreamSubscriber } from '@simplified/shared';
import { MessageMetadata, Stream, StreamrClient } from 'streamr-client';

const LIMIT = 10000;

export class Cache {
	private streamSubscriber: StreamSubscriber;

	private records: {
		message: SystemMessage;
		metadata: MessageMetadata;
	}[] = [];

	constructor(
		private readonly client: StreamrClient,
		private readonly stream: Stream,
	) {
		this.streamSubscriber = new StreamSubscriber(
			this.client,
			this.stream
		);
	}

	public async start() {
		await this.streamSubscriber.subscribe(this.onMessage.bind(this));
	}

	public async stop() {
		await this.streamSubscriber.unsubscribe();
	}

	private async onMessage(content: unknown, metadata: MessageMetadata) {
		const systemMessage = SystemMessage.deserialize(content);
		if (systemMessage.messageType !== SystemMessageType.Measurement) {
			return;
		}

		this.records.push({
			message: systemMessage,
			metadata,
		});

		if (this.records.length > LIMIT) {
			this.records.splice(0, this.records.length - LIMIT);
		}
	}

	public get(from: number) {
		return this.records.filter((record) => record.metadata.timestamp >= from);
	}
}
