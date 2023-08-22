import { Serializer } from '../abstracts/Serializer';
import { RecoveryComplete } from './RecoveryComplete';
import { SystemMessage, SystemMessageType } from './SystemMessage';

const VERSION = 1;

export default class RecoveryCompleteSerializerV1 extends Serializer<RecoveryComplete> {
	toArray(message: RecoveryComplete): any[] {
		return [VERSION, SystemMessageType.RecoveryComplete, message.requestId, message.seqNum];
	}

	fromArray(arr: any[]): RecoveryComplete {
		const [version, _messageType, requestId, seqNum] = arr;

		return new RecoveryComplete({
			version,
			requestId,
			seqNum,
		});
	}
}

SystemMessage.registerSerializer(
	VERSION,
	SystemMessageType.RecoveryComplete,
	new RecoveryCompleteSerializerV1()
);
