import { RecoveryComplete, RecoveryRequest, RecoveryResponse, SystemMessage, SystemMessageType } from '@simplified/protocol';
import { StreamPublisher, StreamSubscriber } from '@simplified/shared';
import { Logger } from '@streamr/utils';
import { MessageMetadata, Stream, StreamrClient } from 'streamr-client';
import { Cache } from './Cache';

const PAYLOAD_LIMIT = 500;

const logger = new Logger(module);

export class Recovery {
	private readonly streamSubscriber: StreamSubscriber;

	constructor(
		private readonly client: StreamrClient,
		private readonly stream: Stream,
		private readonly streamPublisher: StreamPublisher,
		private readonly cache: Cache,
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

	private async onMessage(message: unknown) {
		const systemMessage = SystemMessage.deserialize(message);
		if (systemMessage.messageType !== SystemMessageType.RecoveryRequest) {
			return;
		}

		const recoveryRequest = systemMessage as RecoveryRequest;
		logger.info(
			`Received RecoveryRequest: ${JSON.stringify(recoveryRequest)}`
		);

		await this.processRequest(recoveryRequest.requestId);
	}

	private async processRequest(requestId: string) {
		const cacheRecords = this.cache.get(0);

		const payload: [SystemMessage, MessageMetadata][] = [];
		for await (const cacheRecord of cacheRecords) {
			payload.push([cacheRecord.message, cacheRecord.metadata]);

			if (payload.length === PAYLOAD_LIMIT) {
				await this.sendResponse(requestId, payload.splice(0));
			}
		}

		if (payload.length > 0) {
			await this.sendResponse(requestId, payload);
		}

		await this.sendComplete(requestId);
	}

	private async sendResponse(
		requestId: string,
		payload: [SystemMessage, MessageMetadata][]
	) {
		const recoveryResponse = new RecoveryResponse({ requestId, payload });

		await this.streamPublisher.publish(recoveryResponse.serialize());
		logger.info(
			`Published RecoveryResponse: ${JSON.stringify({ requestId: recoveryResponse.requestId })}`
		);
	}

	private async sendComplete(requestId: string) {
		const recoveryComplete = new RecoveryComplete({ requestId });
		await this.streamPublisher.publish(recoveryComplete.serialize());
		logger.info(
			`Published RecoveryComplete: ${JSON.stringify({ requestId: recoveryComplete.requestId })}`
		);
	}
}
