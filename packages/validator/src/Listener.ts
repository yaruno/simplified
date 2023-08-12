import { SystemMessage, SystemMessageType } from '@simplified/protocol';
import { StreamSubscriber } from '@simplified/shared';
import { MessageMetadata, Stream, StreamrClient } from 'streamr-client';
import { Recovery } from './Recovery';

export class Listener {
  private readonly subscriber: StreamSubscriber;
  private readonly recovery: Recovery;

  constructor(
    private readonly client: StreamrClient,
    private readonly stream: Stream,
  ) {
    this.subscriber = new StreamSubscriber(this.client, this.stream);
    this.recovery = new Recovery(
      this.client,
      this.stream,
      this.onSystemMessage.bind(this)
    );
  }

  public async start() {
    await this.subscriber.subscribe(this.onMessage.bind(this));

    await this.recovery.start();
  }

  public async stop() {
    await this.recovery.stop();
  }

  private async onMessage(
    content: unknown,
    metadata: MessageMetadata
  ): Promise<void> {

    const systemMessage = SystemMessage.deserialize(content);
    if (systemMessage.messageType !== SystemMessageType.Measurement) {
      return;
    }

    await this.onSystemMessage(systemMessage, metadata);
  }

  private async onSystemMessage(
    systemMessage: SystemMessage,
    metadata: MessageMetadata
  ): Promise<void> {
    // logger.info('onSystemMessage %s', JSON.stringify(systemMessage));
  }
}