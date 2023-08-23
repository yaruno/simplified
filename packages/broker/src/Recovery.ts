import { RecoveryComplete, RecoveryRequest, RecoveryResponse, SystemMessage, SystemMessageType } from '@simplified/protocol';
import { StreamPublisher, StreamSubscriber } from '@simplified/shared';
import { Logger } from '@streamr/utils';
import { MessageMetadata, Stream, StreamrClient } from 'streamr-client';
import { Cache } from './Cache';

const PAYLOAD_LIMIT = 100;

const DELAY = 150

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

	private randomIntFromInterval(min: number , max: number ): number { // min and max included 
		return Math.floor(Math.random() * (max - min + 1) + min)
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

		setTimeout(async () => {
			await this.processRequest(recoveryRequest.requestId);
		}, 1000)
	}

	private async waitAWhile(time: number): Promise<void> {
		return new Promise(resolve => {
		  setTimeout(resolve, time)
		})
	  }

	//Todo: throttle also sending a response
	private async processRequest(requestId: string) {
		const cacheRecords = this.cache.get(0);
		console.log("Records in cache: ", cacheRecords.length)

		const payload: [SystemMessage, MessageMetadata][] = [];
		for await (const cacheRecord of cacheRecords) {
			
			payload.push([cacheRecord.message, cacheRecord.metadata]);

			if (payload.length === PAYLOAD_LIMIT) {
				await this.waitAWhile(this.randomIntFromInterval(200,300))
				await this.sendResponse(requestId, payload.splice(0));
			}
		}

		if (payload.length > 0) {
			await this.waitAWhile(this.randomIntFromInterval(200,300))
			await this.sendResponse(requestId, payload);
		}

		await this.sendComplete(requestId);
	}

	//Todo: throttle also sending a response
	private async sendResponse(
		requestId: string,
		payload: [SystemMessage, MessageMetadata][]
	) {
		const recoveryResponse = new RecoveryResponse({ requestId, payload });
		const recoveryResponseSeralized = recoveryResponse.serialize();
		//await this.waitAWhile(250)
		await this.streamPublisher.publish(recoveryResponseSeralized);
		console.log("Sending a recovery response at: ", Date.now())
		logger.info(
			`Published RecoveryResponse: ${JSON.stringify({ requestId: recoveryResponse.requestId, bytes: recoveryResponseSeralized.length })}`
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
