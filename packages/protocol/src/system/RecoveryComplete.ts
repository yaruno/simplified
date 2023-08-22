import {
	SystemMessage,
	SystemMessageOptions,
	SystemMessageType,
} from './SystemMessage';

interface RecoveryCompleteOptions extends SystemMessageOptions {
	requestId: string;
	seqNum: number;
}

export class RecoveryComplete extends SystemMessage {
	requestId: string;
	seqNum: number;

	constructor({
		version = SystemMessage.LATEST_VERSION,
		requestId,
		seqNum,
	}: RecoveryCompleteOptions) {
		super(version, SystemMessageType.RecoveryComplete);

		this.requestId = requestId;
		this.seqNum = seqNum;
	}
}
